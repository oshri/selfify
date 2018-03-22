import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image
} from "react-native";

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon } from 'native-base'

export default  class ImageCard extends React.Component {

    render() {
        const { image, closeCallback } = this.props;
        return (
            <Card>
                <CardItem cardBody>
                    <View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
                        <TouchableOpacity  onPress={closeCallback()} >
                            <MaterialCommunityIcons name="google-circles-communities" style={{ color: 'white', fontSize: 36 }}>
                            </MaterialCommunityIcons>
                        </TouchableOpacity>
                    </View>
                    <Image source={image} style={{ height: 200, width: null, flex: 1 }} />
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
    }
});