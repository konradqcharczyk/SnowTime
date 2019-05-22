import React, { Component } from 'react';
import { Text, ScrollView, StyleSheet, Linking, View } from 'react-native';
import { Constants} from 'expo';
import { Button , CheckBox, ButtonGroup } from 'react-native-elements';
import { YouTubeApiHandler } from './YouTubeApiHandler.js';
import { config } from './config.js';

import SegmentedControlTab from 'react-native-segmented-control-tab'

export default class TrickListScreen extends Component {
  constructor(props) {
    super(props);
    this.updateIndex = this.updateIndex.bind(this);
  }

  state = {
    selectedIndex: 0,
  };

  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }
  

  handleIndexChange = (index) => {
    this.setState({
      ...this.state,
      selectedIndex: index,
    });
  }


  onPress = type => this.setState({ type });

  playVideo = async (trickName) => {
    if(this.state.selectedIndex == 0) {
      type = 'ski'
    }else {
      type = 'snowboard'
    }
    url = await new YouTubeApiHandler().getVideoUrl(trickName, type);
    Linking.openURL(url);
  }
 
  render() {

    tutorials = [];
    const buttons = ['Ski', 'Snowboard'];
    const { selectedIndex } = this.state;

    if(this.state.selectedIndex == 0) {
      tutorials = config.TRICKS_SKI;
    } else {
      tutorials = config.TRICKS_SNB;
    }

    toReturn = <View style={styles.container}>
                  <Text style={styles.paragraph}>Start learning something new!</Text>
                  {/* <SegmentedControlTab
                  values={['Ski', 'Snowboard']}
                  selectedIndex={this.state.selectedIndex}
                  onTabPress={this.handleIndexChange}
                  /> */}
                  <ButtonGroup
                    onPress={this.updateIndex}
                    selectedIndex={selectedIndex}
                    buttons={buttons}
                    containerStyle={styles.ButtonGroup}
                  />
                  <ScrollView style={styles.container}  showsVerticalScrollIndicator={false}>
                  {
                      tutorials.map((value, index)=>{
                        return <Button style={styles.Button} title={value} onPress={this.playVideo.bind(this, value)}></Button>
                      }
                      )
                  }
                  </ScrollView>
                </View>

    return (toReturn);
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#eaeff7',
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    textAlign: 'center',
  },
  Button: {
    padding: 5,
    height: 50
  },
  Button: {
    height: 60
  },
});


