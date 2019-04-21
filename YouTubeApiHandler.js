import React, { Component } from 'react';
import { Platform, Text, ScrollView, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';

const API_KEY = 'AIzaSyBnyzw_EQ2knnKw48lg0WmsEKGoYWi88rw';

export class YouTubeApiHandler{

    static a(trickName) {
        return trickName;
    }

    getVideoUrl= async (trickName) => {

        videoId = null;
        console.log("https://www.googleapis.com/youtube/v3/search/?key=" + API_KEY + "&part=snippet&order=relevance&maxResults=1&q=tutorial+snowboard"+ trickName)
        await fetch("https://www.googleapis.com/youtube/v3/search/?key=" + API_KEY + "&part=snippet&order=relevance&maxResults=1&q=tutorial+snowboard"+ trickName)
        .then(res => res.json())
        .then(res => {
            videoId = res.items[0].id.videoId;
            console.log(videoId)
            
        })
        return `https://www.youtube.com/watch?v=` + videoId;
        }
  
  }
