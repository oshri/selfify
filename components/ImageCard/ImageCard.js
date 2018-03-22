import React, { Component } from "react";
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default  class ImageCard extends React.Component {

    render() {
        const { image, loading } = this.props;
        return (
            <Card style={{ flex: 1, position: 'relative' }}>
                <CardItem cardBody>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                        <TouchableOpacity >
                            <MaterialCommunityIcons name="google-circles-communities" style={{ color: 'white', fontSize: 36 }}>
                            </MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                    <Image 
                        source={{uri: image}}
                        style={{ flex: 1 }} />

                    <ActivityIndicator style={styles.spinner} size="large" color="#000000" animating={loading}/>
                </CardItem>
            </Card>
        );
    }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    spinner: {
		position: 'absolute',
		top: viewportWidth / 2,
		left: viewportWidth / 2,
		zIndex: 1000
	}
});