import React from 'react';
import { Animated, Easing, StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';

import Carousel from 'react-native-snap-carousel';
import PropTypes from 'prop-types';
import { ParallaxImage } from 'react-native-snap-carousel';
import styles from '../../style/SlideEntry.style';

export class ExpoItem extends React.Component {
    vertical = false;

    get image () {
        const { pic: { illustration }, state: { parallax, parallaxProps, even } } = this.props;

        return parallax ? (
            <ParallaxImage
              source={{ uri: illustration }}
              containerStyle={[styles.imageContainer, even ? styles.imageContainerEven : {}]}
              style={styles.image}
              animOpacity={new Animated.Value(100)}
              fadeDuration={2000}
              parallaxFactor={0.5}
              showSpinner={true}
              spinnerColor={even ? 'rgba(255, 255, 255, 0.4)' : 'rgba(0, 0, 0, 0.25)'}
              {...parallaxProps}
            />
        ) : (
            <Image
              source={{ uri: illustration }}
              style={styles.image}
            />
        );
    }

    render () {
        const { state, pic } = this.props;

        return (
            <TouchableOpacity
                activeOpacity={1}
                style={styles.slideInnerContainer}
                onPress={() => { 
                    // TODO show title of an image
                    // alert(`You've clicked '${pic.title}'`); 
                }}>
                    <View style={styles.shadow} />
                    <View style={[styles.imageContainer, state.even ? styles.imageContainerEven : {}]}>
                        { this.image }
                    </View>
            </TouchableOpacity>
        );
    }
    
}