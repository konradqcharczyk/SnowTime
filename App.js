import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import TrickListView from './TrickListView'
import LocationFetcher from './LocationFetcher';

import { WebView } from 'react-native-webview';


export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'YOU_TUBE',
    }
  }

  setMode = async (next_mode) => {
    this.setState({
      mode: next_mode,
    });
  }

  render() {

    switch(this.state.mode) {
      case 'MAIN_MENU':
        toReturn =  <View style={styles.container}>
                      <Button style={styles.Button} title="Start riding" onPress={this.setMode.bind(this, "LOCATION")}></Button>
                      <Button style={styles.Button} title="Training" onPress={this.setMode.bind(this, "YOU_TUBE")}></Button>
                    </View>;
      break;
      case 'YOU_TUBE':
        toReturn = <View style={styles.container}>
                      <TrickListView/>
                   </View>;
      break;
      case 'LOCATION':
      toReturn =  <View style={styles.container}>
                      <LocationFetcher/>
                  </View>;
      break;

      case 'YOUTUBE_TEST':
      toReturn =  <View style={styles.container}>
                    <Text>elko</Text>
                    <WebView source={{ uri: 'https://facebook.github.io/react-native/' }} />
                  </View>;
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
