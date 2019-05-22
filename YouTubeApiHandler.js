import React, { Component } from 'react';
import { Platform, Text, ScrollView, StyleSheet } from 'react-native';
import { Constants, Location, Permissions } from 'expo';
import { Button } from 'react-native-elements';
import { config } from './config.js';

export class YouTubeApiHandler{

    getVideoUrl= async (trickName, type) => {

        videoId = null;
        console.log("https://www.googleapis.com/youtube/v3/search/?key=" + config.API_KEY + "&part=snippet&order=relevance&maxResults=1&q=tutorial+" + type + "+" + trickName)
        await fetch("https://www.googleapis.com/youtube/v3/search/?key=" + config.API_KEY + "&part=snippet&order=relevance&maxResults=1&q=tutorial+" + type + "+" + trickName)
        .then(res => res.json())
        .then(res => {
            videoId = res.items[0].id.videoId;
            console.log(videoId)
            
        })
        return `https://www.youtube.com/watch?v=` + videoId;
        }
  
  }
