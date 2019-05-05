import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';

import KalmanFilter from 'kalmanjs';

export default class LocationFetcher extends Component {
  state = {
    locationPrev: null,
    location: null,
    errorMessage: null,
    distance: 0
  };


  timeInterval = 12; //s
  minKmph = 1;
  skipFirstLoc = 1;
  wasSkippedCnt = 1;
  initLoc = null;
  kf = null;

  componentWillMount() {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
    this.interval = setInterval(() => this.fetchLocation(this.state.location), this.timeInterval * 1000);
    this.kf = new KalmanFilter();
  }


  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }

    this.fetchLocation();
  };

  fetchLocation = async (prevLoc) => {
    var today = new Date();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("StartTime = " + time)
    const location = await Location.getCurrentPositionAsync({accuracy : Location.Accuracy.Highest});
    var today = new Date();
    var timeEnd = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    console.log("EndTime = " + timeEnd);

    if(this.initLoc == null) {
      this.initLoc = location;
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
      console.log(delta);
      console.log(speed);
      if(speed > this.minKmph) {
        this.setState(
          {location: location}
        );

        this.setState((state) => {
          return {distance: state.distance + delta,
                  currSpeed: speed}
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
    return d * 1000; // meters
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

    return (
      <View style={styles.container}>
        <Button onPress={this.fetchLocation.bind(this, loc)} title="Refetch location" style={styles.Button}/>
        <Text style={styles.paragraph}>Latitude: {JSON.stringify(coords.latitude)}</Text>
        <Text style={styles.paragraph}>Longitude: {JSON.stringify(coords.longitude)}</Text>
        <Text style={styles.paragraph}>Altitude: {JSON.stringify(coords.altitude)}</Text>
        <Text style={styles.paragraph}>Accuracy: {JSON.stringify(coords.accuracy)}</Text>
        <Text style={styles.paragraph}>Distance: {this.state.distance}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    backgroundColor: '#fff',
  },
  paragraph: {
    fontSize: 18,
    textAlign: 'center',
  },
  Button: {
    padding: 5,
  },
});