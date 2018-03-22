import React from 'react';
import { StyleSheet, Dimensions, Text, View } from 'react-native';
import Carousel from 'react-native-snap-carousel';
import { ExpoItem } from '../ExpoItem/ExpoItem';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const state = {
  paralax: true,
  parallaxProps: {
    // TODO ADD PROPERTIES
  },
  even: true
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    width: viewportWidth,
    flex: 1,
    backgroundColor: 'powderblue',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default class ExpoCarousel extends React.Component {

  carouselState = {
    sliderWidth: viewportWidth,
    itemWidth: viewportWidth
  };

  _renderItem ({item, index}) {
      return (
        <View style={styles.container}>
          <ExpoItem state={state} pic={item}/>
        </View>
      );
  }
  
  render() {
    const { images } = this.props;
    return (
      <Carousel
        ref={(c) => { this._carousel = c; }}
        data={images}
        renderItem={this._renderItem}
        sliderWidth={this.carouselState.sliderWidth}
        itemWidth={this.carouselState.itemWidth}
      />
    );
  }
}
