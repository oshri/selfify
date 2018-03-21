import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import  SfCamera from './components/SfCamera/SfCamera';

export default class App extends React.Component {
 

  render() {
  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <SfCamera></SfCamera>
      </View>
    </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    width: '100%',
    height: 300,
    backgroundColor: 'powderblue'
  },
  tags: {
    width: '100%',
    height: 100,
    backgroundColor: 'powderblue'
  }
});
