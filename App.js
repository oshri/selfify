import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import SfCamera from './components/SfCamera/SfCamera';
import Chips from './components/Chips/Chips';

export default class App extends React.Component {
 
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      tags: []
    };

    this.handleTagsResoults = this.handleTagsResoults.bind(this);

  }

  handleTagsResoults(tags) {
    const newState = { ...this.state };
    newState.tags = tags;
    this.setState({...newState});
  }


  render() {
    return (
      <View style={styles.container}>
        <View style={styles.camera}>
          <SfCamera gettags={this.handleTagsResoults}></SfCamera>
        </View>
        <View style={styles.tags}>
          <Chips items={this.state.tags}></Chips>
        </View>
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
    padding: 10,
    height: 50,
    backgroundColor: 'powderblue'
  }
});
