import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import TrickListScreen from './TrickListScreen'
import LocationScreen from './LocationScreen';
import HomeScreen from './HomeScreen'
import {
  createBottomTabNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';


const tabs = {
  MAIN_MENU: 'MAIN_MENU',
  TRICK_LIST: 'TRICK_LIST',
  LOCATION: 'LOCATION',
  TEST: 'TEST'
}

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: tabs.TEST,
    }
  }



  setMode = async (next_mode) => {
    this.setState({
      mode: next_mode,
    });
  }

  setMainMenu = () => {
    console.log('wrocilo');
    this.setState({
      mode: tabs.MAIN_MENU,
    })
  }

  render() {

    switch(this.state.mode) {
      case tabs.MAIN_MENU:
        toReturn =  <View style={styles.container}>
                      <Button style={styles.Button} title="Start riding" onPress={this.setMode.bind(this, tabs.LOCATION)}></Button>
                      <Button style={styles.Button} title="Training" onPress={this.setMode.bind(this, tabs.TRICK_LIST)}></Button>
                      {/* <LocationFetcher setMainMenu={this.setMainMenu} mode='MAIN_MENU'/> */}
                    </View>;
      break;
      case tabs.TRICK_LIST:
        toReturn = <View style={styles.container}>
                      <TrickListScreen setMainMenu={this.setMainMenu}/>
                   </View>;
      break;
      case tabs.LOCATION:
      toReturn =  <View style={styles.container}>
                      <LocationScreen setMainMenu={this.setMainMenu} />
                  </View>;
      break;

      case tabs.TEST:
      toReturn =  <HomeScreen></HomeScreen>
      break;

    }

    return (
      toReturn
    );
  }

}

//probably can be passed as properties to ytHandler and locFetch
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 250,
    backgroundColor: '#fff',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  Button: {
    padding: 5,
  },
});

