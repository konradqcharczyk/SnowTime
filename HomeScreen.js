import React from 'react';
import { Text, View, AsyncStorage, StyleSheet} from 'react-native';
import { createBottomTabNavigator, createAppContainer } from 'react-navigation';
import TrickListScreen from './TrickListScreen';
import LocationScreen from './LocationScreen';

import { Table, TableWrapper, Row, Rows, Col, Cols, Cell } from 'react-native-table-component';
import { State } from 'react-native-gesture-handler';

import AwesomeButton from 'react-awesome-button/src/components/AwesomeButton';
import AwesomeButtonProgress from 'react-awesome-button/src/components/AwesomeButtonProgress';
import AwesomeButtonSocial from 'react-awesome-button/src/components/AwesomeButtonSocial';


class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

    }
    state = {
        distance: 0,
        maxSpeed: 0
    }
    
    _getInfo = async () => {
        distance = await AsyncStorage.getItem('DISTANCE');
        maxSpeed = await AsyncStorage.getItem('MAX_SPEED');
        this.setState({
            distance: distance,
            maxSpeed: maxSpeed
        })
    }


    render() {
        this._getInfo();
        tableData = [
            ['Distance', this.state.distance,],
            ['Max speed', this.state.maxSpeed,],
            ['Time spend riding', 'TODO',],
        ]
        
        // tableData = [
        //     ['Distance', '123',],
        //     ['Max speed', '123',],
        //     ['Time spend riding', 'TODO',],
        // ]
        return (
        <View style={styles.container}>
            <View>
              <Text style={styles.paragraph}>It's...</Text><Text style={styles.title}>SnowTime!</Text>
            </View>
            {/* <View>
              <AwesomeButton type="primary">Primary</AwesomeButton>
            </View> */}
        </View>
        );
    }
}


const TabNavigator = createBottomTabNavigator({
  Home: HomeScreen,
  Tricks: TrickListScreen,
  "Start riding!" :  LocationScreen,
});

export default createAppContainer(TabNavigator);

const styles = StyleSheet.create({
    container: {
      paddingTop: 5,
      backgroundColor: '#eaeff7',
      paddingTop: 50,
      flex: 1
    },
    paragraph: {
      fontSize: 24,
      textAlign: 'center',
    },
    title: {
      fontSize: 64,
      textAlign: 'center',
    },
    Button: {
      padding: 5,
    },
    text: { 
      margin: 6
     },
  });