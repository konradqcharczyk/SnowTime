import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, Linking } from 'react-native';
import { Constants} from 'expo';
import { Button } from 'react-native-elements';
import { YouTubeApiHandler } from './YouTubeApiHandler.js';
import { config } from './config.js';

export default class TrickListView extends Component {
  state = {
  };

  playVideo = async (trickName) => {
    url = await new YouTubeApiHandler().getVideoUrl(trickName);
    Linking.openURL(url);
  }
 
  render() {
    tutorials = config.TRICKS;

    toReturn = <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
                  <Text>Start learning new tricks!</Text>
                  {
                    tutorials.map((value, index)=>{
                      return <Button style={styles.Button} title={value} onPress={this.playVideo.bind(this, value)}></Button>
                    }
                    )
                  }
                 </ScrollView>;

    return (toReturn);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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



