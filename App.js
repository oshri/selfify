import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import  SfCamera from './components/SfCamera/SfCamera';

export default class App extends React.Component {
 

  render() {
    return <View style={styles.container}><SfCamera></SfCamera></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  }
});
