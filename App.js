import React from 'react';
import { Dimensions, StyleSheet, Text, View, ScrollView } from 'react-native';
import { Container, Content, Icon, Thumbnail, Header, Left, Right, Body } from 'native-base'
import SfCamera from './components/SfCamera/SfCamera';
import Chips from './components/Chips/Chips';
import ExpoCarousel from './components/ExpoCarousel/ExpoCarousel';

import { searchPhotos } from './services/flickr/flickrApi';


const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

export default class App extends React.Component {
  static navigationOptions = {
    tabBarIcon: ({ tintColor }) => (
        <Icon name="ios-home" style={{ color: tintColor }} />
    )
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      tags: [],
      images: []
    };

    this.handleTagsResoults = this.handleTagsResoults.bind(this);
  }

  filterSimmilarTags(tags) {
    const result = [];
    tags.filter((el, indx) => {
      if(result.indexOf(el) === -1) {
        result.push(el);
      }
    });
    return result;
  }

  handleTagsResoults(tags) {
    const tagResult = this.filterSimmilarTags(tags);
    const newState = { ...this.state };
    newState.tags = tagResult;
    this.setState({...newState});

    const imageData = searchPhotos(tagResult.join(",")).then((result)=>{
      const newState2 = { ...this.state };
      newState2.images = result;
      this.setState({...newState2});
    });

  }
ƒ
  render() {
    return (
      <Container style={styles.container}>
          <Header>
              <Body><Text style={{ fontSize: 20 }}>Selfify</Text></Body>
          </Header>
          <Content>
            <View style={styles.camera}>
              <SfCamera gettags={this.handleTagsResoults}></SfCamera>
            </View>
            <View style={styles.tags}>
              <Chips items={this.state.tags}></Chips>
            </View>
            <View style={styles.images}>
              <ExpoCarousel images={this.state.images}/>
            </View>
          </Content>
      </Container>
    );
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
    height: viewportHeight - 150
  },
  tags: {
    width: '100%',
    padding: 10,
    zIndex: 100,
    height: 50,
  },
  images: {
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    height: viewportHeight / 100 * 40
  }
});
