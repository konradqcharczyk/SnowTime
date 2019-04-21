import React, { Component } from 'react';
import { Platform, Text, ScrollView, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';
import { YouTubeApiHandler } from './YouTubeApiHandler.js';

export default class TrickListView extends Component {
  state = {
    videoUri: null,
    isVideo: 0,
  };

  playVideo = async (trickName) => {
    url = await new YouTubeApiHandler().getVideoUrl(trickName);
    console.log(url);
    this.setState({
      isVideo: 1,
    });

    this.setState({
      videoUri: url,
    });
  }
 
  render() {
    tutorials = ['Tail Press', 'Nose Press', 'Ollie', 'Ollie 180']

    if (this.state.isVideo === 0) {
      toReturn = <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
      <Text>Start learning new tricks!</Text>
      {
        tutorials.map((value, index)=>{
          return <Button style={styles.Button} title={value} onPress={this.playVideo.bind(this, value)}></Button>
        }
        )
      }
    </ScrollView>;
    }
    else {
      url = this.state.videoUrl;
      toReturn =  <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
                    <Text>Play video: {url}</Text>
                  </ScrollView>;
    };
    return (toReturn);
    }
}

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight + 50,
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



