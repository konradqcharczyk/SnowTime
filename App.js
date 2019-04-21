import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from 'react-native-elements';
import TrickListView from './TrickListView'



export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null
    }
  }

  // componentDidMount() {
  //   fetch('https://www.googleapis.com/youtube/v3/search/?key=AIzaSyBnyzw_EQ2knnKw48lg0WmsEKGoYWi88rw&part=snippet&order=relevance&maxResults=1&q=ollie+180+tutorial+snowboard')
  //   .then(res => res.json())
  //   .then(res => {
  //     const videoId = res.items[0].id.videoId;
  //     this.setState({
  //       data: videoId
  //     })
  //   })
  // }

  render() {
    // text = this.state.data;
    // console.log({text});
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
