import React, { Component } from 'react';
import { Platform, Text, View, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';

export default class TrickListView extends Component {
  state = {
    location: null,
    errorMessage: null,
  };

  render() {
    const tutorials = ['Tail Press', 'Nose Press', 'Ollie', 'Ollie 180']
    return (
      <View style={styles.container}>
        <Text>Start learning new tricks!</Text>
        {
          tutorials.map((value, index)=>{
             return <Button style={styles.Button} title={value}></Button>
          }
          )
        }
      </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
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