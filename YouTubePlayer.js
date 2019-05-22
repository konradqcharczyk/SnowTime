import React, { Component } from 'react';
import { Text, View, StyleSheet, WebView, Button, Linking} from 'react-native';
import { Constants } from 'expo';



// You can import from local files
import AssetExample from './AssetExample';
// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // Version can be specified in package.json

export default class YouTubePlayer extends Component {
  render() {
    return (
      <View style={styles.container}>
       <Button title="Click me" onPress={ ()=>{ Linking.openURL('https://google.com')}} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
  },
});