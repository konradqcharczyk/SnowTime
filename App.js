import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import TrickListView from './TrickListView'



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mode: 'MAIN_MENU',
      wtf: 1
    }
  }

  setMode = async (next_mode) => {
    this.setState({
      mode: next_mode,
    });

    this.setState({
      wtf: 1,
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
        toReturn = <Text>YouTuby</Text>
      break;
      case 'LOCATION':
        toReturn = <Text>Location</Text>
      break;
    }

  
    return (
      <View style={styles.container}>
        <TrickListView/>
      </View>
    );
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
