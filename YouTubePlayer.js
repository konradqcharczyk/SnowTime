import React, { Component } from 'react';
import { Text, View, StyleSheet, WebView, Button, Linking} from 'react-native';
import { Constants } from 'expo';



// You can import from local files
import AssetExample from './AssetExample';
// or any pure javascript modules available in npm
import { Card } from 'react-native-elements'; // Version can be specified in package.json

export default class YouTubePlayer extends Component {
  render() {
    // return (
    //   <WebView
    //     style={styles.container}
    //     javaScriptEnabled={true}
    //     scalesPageToFit={true}
    //     // style = "height: 500, overflow:'hidden'"
    //     source={{
    //       uri: 'https://www.youtube.com/watch?v=ncrRYHBT4Sorel=0&autoplay=0&showinfo=0&controls=0',
    //     }}
    //   />
    // );
    // return (
    //   <View style={styles.container} scalesPageToFit={true}>
    //   <WebView scalesPageToFit={true} style={"flex: 1"}
    //     source={{uri: 'https://github.com/facebook/react-native'}}
    //   />
    //   </View>
    // );
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