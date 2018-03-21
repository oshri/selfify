import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import  SfCamera from './components/SfCamera/SfCamera';
import Chips from './components/Chips/Chips';

export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {chipData: [
      {label: 'Melons'},
      { label: 'Beach'},
      {label: 'Watermelon im the bomba'},
      {label: 'Ocean'},
      {label: 'im the kebab'},
      {label: 'no, im the kebab'},
    ]};
  }


  render() {
  return (
    <View style={styles.container}>
      <View style={styles.camera}>
        <SfCamera></SfCamera>
      </View>
      <View>
        <Chips items={this.state.chipData}></Chips>

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
