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

import { Card, CardItem, Thumbnail, Body, Left, Right, Button, Icon, Header } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');
export default  class ImageCard extends React.Component {

    render() {
        const { image, loading } = this.props;
        return (
            <Card style={{ flex: 1, position: 'relative' }}>
                <CardItem cardBody>

                   <Header searchBar rounded
                        style={{
                            position: 'absolute', backgroundColor: 'white', opacity: 0.5,
                            left: 0, top: 0, right: 0, zIndex: 1000, alignItems: 'center'
                        }}>

                        <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
                            <TouchableOpacity onPress={this.props.onPress}>
                                <Icon name="close" style={{ color: 'black' }} />
                            </TouchableOpacity>
                        </View>
                    </Header>
                    <View style={{ flex: 1, position: 'absolute', left: 0, top: 50, right: 0, zIndex: 99, overflow: 'hidden'}}>
                        <Image 
                            source={{uri: image}}
                            style={{ flex: 1, height: viewportHeight - 211, width: null }} />
                    </View>
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