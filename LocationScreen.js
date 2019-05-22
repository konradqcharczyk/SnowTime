import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet, AsyncStorage, Alert} from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';

import KalmanFilter from 'kalmanjs';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';

import DateTimePicker from "react-native-modal-datetime-picker";

export default class LocationScreen extends Component {
  state = {
    locationPrev: null,
    location: null,
    errorMessage: null,
    distance: 0,
    currSpeed: 0,
    maxSpeed: 0,
    avgSpeed: 0,
    count: 0,
    fetching: 0,
    isDateTimePickerVisible: false,
    endTime: null,
    distanceToInit: 0,
    wasAlert: false
  };

  timeInterval = 3; //s
  iterationsToDoCheckpoint = 4; //s //TODO change to about 30min
  minKmph = 0;
  skipFirstLoc = 1;
  wasSkippedCnt = 1;
  initLoc = null;
  prevLoc = null;
  kf = null;

  constructor(props) {
    super(props);
  }

  _showAlert() {
    Alert.alert(
      'Are you sure?',
      'This will end recording data',
      [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'Stop', onPress: () => this._endCollectingData()},
      ],
      {cancelable: false},
    );
  }

  _showAlertGoBack() {
    Alert.alert(
      "It's time to go back",
      'You need to go back if you want get out',
      [
        {
          text: 'OK!',
        },
      ],
      {cancelable: false},
    );
  }

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }

    this.kf = new KalmanFilter();
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }


  _startCollectingData() {
    console.log("STARTEd");
    if(this.state.endTime == null){
      this.showDateTimePicker();
    }

    this.setState(
      {fetching: 1}
    );
    this.interval = setInterval(() => this.fetchLocation(this.state.location), this.timeInterval * 1000);
  }

  _pauseCollectingData() {
    this.setState(
      {fetching: 0}
    );
    clearInterval(this.interval);
  }

  _endCollectingData = async () => {
    this._pauseCollectingData();
    this._resetData();
  }

  _resetData() {
    this.setState ({
      locationPrev: null,
      location: null,
      errorMessage: null,
      distance: 0,
      currSpeed: 0,
      maxSpeed: 0,
      avgSpeed: 0,
      count: 0,
      endTime: null,
      distanceToInit: 0,
      wasAlert: false
    });
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };
 
  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  handleDatePicked = date => {
    this.setState({ endTime: date.getTime() });
    this.hideDateTimePicker();
  };

  handleCancleTimePicker = () => {
    this._pauseCollectingData();
    this.hideDateTimePicker();
  }


  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
  };

  fetchLocation = async (prevLoc) => {
    
    this.setState((state) => {
      return {count: state.count + 1}
    });

    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // console.log("StartTime = " + time)
    const location = await Location.getCurrentPositionAsync({accuracy : 3});
    var today = new Date();
    var timeEnd = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    // console.log("EndTime = " + timeEnd);

    if(this.initLoc == null) {
      this.initLoc = location;
    }

    if(this.state.count % this.iterationsToDoCheckpoint == 0) {
      if(this.prevLoc != null) {
        latNorm = location.coords.latitude
        lngNorm = location.coords.longitude
        latPrevNorm = this.prevLoc.coords.latitude
        lngPrevNorm = this.prevLoc.coords.longitude
        delta = this.kf.filter(this.measure(JSON.stringify(latNorm)
                                , JSON.stringify(lngNorm)
                                , JSON.stringify(latPrevNorm)
                                , JSON.stringify(lngPrevNorm))
                                )
        this.setState((state) => {
          return { distanceToInit: state.distance + delta }
        });
        timeDelta = this.state.endTime - new Date().getTime() - (this.state.distanceToInit / this.state.avgSpeed);
        
        timeDelta = 0.001 * timeDelta // to seconds
        console.log(timeDelta);
        if(timeDelta < 0 && !this.state.wasAlert) {
          this._showAlertGoBack();
          this.setState(
            {wasAlert: true}
          );
        }
      }
      this.prevLoc = location;
    }

    if(prevLoc == null) {
      this.setState(
        {location: location}
      );
      --this.skipFirstLoc;
    }
    else if(this.skipFirstLoc <= 0) {
      latNorm = location.coords.latitude
      lngNorm = location.coords.longitude
      latPrevNorm = prevLoc.coords.latitude
      lngPrevNorm = prevLoc.coords.longitude
      
      delta = this.kf.filter(this.measure(JSON.stringify(latNorm)
                                          , JSON.stringify(lngNorm)
                                          , JSON.stringify(latPrevNorm)
                                          , JSON.stringify(lngPrevNorm))
                                          )
      speed = (delta / (this.timeInterval * this.wasSkippedCnt)) * 3,6; //in kmph
      this.setState(
        {currSpeed: speed}
      );
      if(speed > this.minKmph) {
        this.setState(
          {location: location}
        );
        
        if (this.state.maxSpeed < speed) {
          this.setState(
            {maxSpeed: speed}
          );
        }

        this.setState((state) => {
          return {distance: state.distance + delta
          }
        });
        this.setState((state) => {
          return {avgSpeed: (((state.avgSpeed * state.count) + speed) / (state.count + 1)),
          }
        });

        this.wasSkippedCnt = 1;
        }
        else {
          this.wasSkippedCnt++;
        }

      }
      else {
        --this.skipFirstLoc; 
      }
  }


  measure(lat1, lon1, lat2, lon2){  // generally used geo measurement function
    var R = 6378.137; // Radius of earth in KM
    var dLat = lat2 * Math.PI / 180 - lat1 * Math.PI / 180;
    var dLon = lon2 * Math.PI / 180 - lon1 * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d ;
  }




  render() {
    let coords = '';
    let loc = null;
    if (this.state.errorMessage) {
      text = this.state.errorMessage;
    } else if (this.state.location) {
      text = JSON.stringify(this.state.location);
      coords = this.state.location.coords;
      loc = this.state.location;
    }

    tableData = [
      ['Altitude', parseFloat(Math.round(Number(JSON.stringify(coords.altitude)) * 100) / 100).toFixed(0) + " m a.s.l",],
      ['Distance', parseFloat(Math.round(Number(this.state.distance) * 100) / 100).toFixed(3) + " Km",],
      ['Current speed', parseFloat(Math.round(Number(this.state.currSpeed) * 100) / 100).toFixed(3) + " Km/h",],
      ['Average speed', parseFloat(Math.round(Number(this.state.avgSpeed) * 100) / 100).toFixed(3) + " Km/h",],
      ['Max speed', parseFloat(Math.round(Number(this.state.maxSpeed) * 100) / 100).toFixed(3) + " Km/h",],
      // ['End time', this.state.endTime],
      ['Distance to start point', parseFloat(Math.round(Number(this.state.distanceToInit) * 100) / 100).toFixed(3) + " Km",],
    ]

    if(this.state.fetching == 0) {
      buttonTitle = 'Start';
      onPressFunction = this._startCollectingData;
    } else {
      buttonTitle = 'Pause';
      onPressFunction = this._pauseCollectingData;
    }
    toReturn =<View style={styles.container}>
                <Table borderStyle={{borderWidth: 2, borderColor: '#c8e1ff'}}>
                  <Rows data={tableData} textStyle={styles.text}/>
                </Table>
                <Button onPress={onPressFunction.bind(this, loc)} title={buttonTitle} style={styles.Button}/>
                <Button onPress={this._showAlert.bind(this)} title="End" style={styles.Button}/>
                <DateTimePicker
                  mode = 'time'
                  titleIOS = 'Pick return time'
                  isVisible={this.state.isDateTimePickerVisible}
                  onConfirm={this.handleDatePicked}
                  onCancel={this.handleCancleTimePicker}
                />

              </View>
    

    return (
      toReturn
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#eaeff7',
    alignContent: 'center'
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  Button: {
    padding: 5,
  },
  text: { 
    margin: 6,
    fontSize: 20,
    textAlign: 'center',
   },
});


