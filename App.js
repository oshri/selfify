import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import SfCamera from './components/SfCamera/SfCamera';
import Chips from './components/Chips/Chips';

export default class App extends React.Component {
 
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      chipData: [
        {label: 'Melons'},
        { label: 'Beach'},
        {label: 'Watermelon im the bomba'},
        {label: 'Ocean'},
        {label: 'im the kebab'},
        {label: 'no, im the kebab'},
      ]
    };
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          <SfCamera></SfCamera>
        </View>
        <View style={styles.tags}>
          <Chips items={this.state.chipData}></Chips>
        </View>
        <ActivityIndicator size="large" color="#0000ff" animating={this.state.isLoading}/>
      </View>);
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
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
