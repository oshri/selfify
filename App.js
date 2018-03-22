import React from 'react';
import { Dimensions, StyleSheet, Text, View } from 'react-native';
import SfCamera from './components/SfCamera/SfCamera';
import Chips from './components/Chips/Chips';
import ExpoCarousel from './components/ExpoCarousel/ExpoCarousel';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class App extends React.Component {
 
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      tags: [],
      images: [
        {
            title: 'Beautiful and dramatic Antelope Canyon',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
            illustration: 'https://i.imgur.com/UYiroysl.jpg'
        },
        {
            title: 'Earlier this morning, NYC',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/UPrs1EWl.jpg'
        },
        {
            title: 'White Pocket Sunset',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat ',
            illustration: 'https://i.imgur.com/MABUbpDl.jpg'
        },
        {
            title: 'Acrocorinth, Greece',
            subtitle: 'Lorem ipsum dolor sit amet et nuncat mergitur',
            illustration: 'https://i.imgur.com/KZsmUi2l.jpg'
        },
        {
            title: 'The lone tree, majestic landscape of New Zealand',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/2nCt3Sbl.jpg'
        },
        {
            title: 'Middle Earth, Germany',
            subtitle: 'Lorem ipsum dolor sit amet',
            illustration: 'https://i.imgur.com/lceHsT6l.jpg'
        }
      ]
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
        <View style={styles.images}>
          <ExpoCarousel images={this.state.images}/>
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
    height: viewportHeight / 2,
    backgroundColor: 'powderblue'
  },
  tags: {
    width: '100%',
    padding: 10,
    zIndex: 100,
    height: viewportHeight / 10,
    backgroundColor: 'powderblue'
  },
  images: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: viewportHeight / 100 * 40,
    backgroundColor: 'powderblue'
  }
});
