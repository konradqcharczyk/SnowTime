import React, { Component } from 'react';
import { Platform, Text, ScrollView, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';
import { YouTubeApiHandler } from './YouTubeApiHandler.js';
import { config } from './config.js';

export default class TrickListView extends Component {
  state = {
    videoUri: null,
    isVideo: 0,
    wtf: 1,
  };

  playVideo = async (trickName) => {
    url = await new YouTubeApiHandler().getVideoUrl(trickName);
    console.log(url);
    this.setState({
      isVideo: 1,
      videoUri: url,
    });

  }
 
  render() {
    tutorials = config.TRICKS;

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



