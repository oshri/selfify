import React from 'react';
import { Constants, Camera, FileSystem, Permissions } from 'expo';
import {
	StyleSheet,
	Dimensions,
	Text,
	View,
	TouchableOpacity,
	Slider,
	Vibration,
  	NativeModules,
  	ActivityIndicator
} from 'react-native';
import { Container, Content, Header, Item, Icon, Input, Button } from 'native-base'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import GalleryScreen from '../GalleryScreen/GalleryScreen';
import isIPhoneX from 'react-native-is-iphonex';
import { checkForLabels }  from '../../services/googleVision/googleVisionApi';

const { width: viewportWidth, height: viewportHeight } = Dimensions.get('window');

const landmarkSize = 2;

const flashModeOrder = {
	off: 'on',
	on: 'auto',
	auto: 'torch',
	torch: 'off'
};

const wbOrder = {
	auto: 'sunny',
	sunny: 'cloudy',
	cloudy: 'shadow',
	shadow: 'fluorescent',
	fluorescent: 'incandescent',
	incandescent: 'auto'
};

export default class SfCameraScreen extends React.Component {

	state = {
		flash: 'off',
		zoom: 0,
		autoFocus: 'on',
		depth: 0,
		type: 'back',
		whiteBalance: 'auto',
		ratio: '16:9',
		ratios: [],
		photoId: 1,
		showGallery: false,
		photos: [],
		faces: [],
    	permissionsGranted: false,
    	isLoading: false
	};

	async componentWillMount() {
		const { status } = await Permissions.askAsync(Permissions.CAMERA);
		this.setState({ permissionsGranted: status === 'granted' });
	}

	componentDidMount() {
    // const { gettags }  = this.props.gettags;

		FileSystem.makeDirectoryAsync(
			FileSystem.documentDirectory + 'photos'
		).catch(e => {
			console.log(e, 'Directory exists');
		});
	}

	getRatios = async () => {
		const ratios = await this.camera.getSupportedRatios();
		return ratios;
	};

	toggleView() {
		this.setState({
			showGallery: !this.state.showGallery
		});
	}

	toggleFacing() {
		this.setState({
			type: this.state.type === 'back' ? 'front' : 'back'
		});
	}

	toggleFlash() {
		this.setState({
			flash: flashModeOrder[this.state.flash]
		});
	}

	setRatio(ratio) {
		this.setState({
			ratio
		});
	}

	toggleWB() {
		this.setState({
			whiteBalance: wbOrder[this.state.whiteBalance]
		});
	}

	setFocusDepth(depth) {
		this.setState({
			depth
		});
	}

	takePicture = async function() {
		if (this.camera  && !this.state.isLoading) {
			this.camera.takePictureAsync({ base64: true, quality: 0 }).then(data => {
			Vibration.vibrate();

			this.setState({
				isLoading: true
			});

			const base = data.base64;
			checkForLabels(base).then((res) =>{
				this.setState({
					isLoading: false
				});
				
				this.props.gettags(res);
			});

			FileSystem.moveAsync({
				from: data.uri,
				to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
			}).then(() => {
				this.setState({
					photoId: this.state.photoId + 1,
				});
				Vibration.vibrate();
			});

			});
		}
  };
  
	renderGallery() {
		return <GalleryScreen onPress={this.toggleView.bind(this)} />;
	}

	renderNoPermissions() {
		return (
			<View
				style={{
					flex: 1,
					alignItems: 'center',
					justifyContent: 'center',
					padding: 10
				}}
			>
				<Text style={{ color: 'white' }}>
					Camera permissions not granted - cannot open camera preview.
				</Text>
			</View>
		);
	}

	renderCamera() {
        const { permissionsGranted } = this.state

        if (permissionsGranted === null) {
            return <View />
        }
        else if (permissionsGranted === false) {
            return <Text> No access to camera</Text>
        }
        else {
            return (
                <View style={{ flex: 1, position: 'relative' }}>
					<Camera 
						style={{ flex: 1, justifyContent: 'space-between' }}
						ref={ref => {
							this.camera = ref;
						}}
						type={this.state.type}
						flashMode={this.state.flash}
						autoFocus={this.state.autoFocus}
						zoom={this.state.zoom}
						whiteBalance={this.state.whiteBalance}
						ratio={this.state.ratio}
						focusDepth={this.state.depth}>

                        <Header searchBar rounded
                            style={{
                                position: 'absolute', backgroundColor: 'transparent',
                                left: 0, top: 0, right: 0, zIndex: 100, alignItems: 'center'
                            }}>

                            <View style={{ flexDirection: 'row', flex: 2, justifyContent: 'space-around', paddingHorizontal: 10, marginBottom: 15, alignItems: 'flex-end' }}>
								<TouchableOpacity onPress={this.toggleFacing.bind(this)}>
									<Icon name="ios-reverse-camera" style={{ color: 'white' }} />
								</TouchableOpacity>
								<TouchableOpacity onPress={this.toggleFlash.bind(this)}>
									<Icon name="ios-flash" style={{ color: 'white'}} />
								</TouchableOpacity>
                            </View>
							<View style={{ flexDirection: 'row', flex: 1, justifyContent: 'space-around' }}>
								<TouchableOpacity  onPress={this.toggleWB.bind(this)} >
									<MaterialCommunityIcons name="google-circles-communities" style={{ color: 'white', fontSize: 36 }}>
									</MaterialCommunityIcons>
								</TouchableOpacity>
                            </View>
                        </Header>

                        <View style={styles.snapcontainer}>
							<TouchableOpacity onPress={this.takePicture.bind(this)}>
								<MaterialCommunityIcons name="circle-outline" style={{ color: 'white', fontSize: 100 }}>
								</MaterialCommunityIcons>
							</TouchableOpacity>
                        </View>
                    </Camera>

					<ActivityIndicator style={styles.spinner} size="large" color="#ffffff" animating={this.state.isLoading}/>
                </View>
            )
        }
    }

	render() {
		const cameraScreenContent = this.state.permissionsGranted
			? this.renderCamera()
			: this.renderNoPermissions();
		const content = this.state.showGallery
			? this.renderGallery()
			: cameraScreenContent;
    return (
      <View style={styles.container}>
        {content}
      </View>
    );
	}
}

const styles = StyleSheet.create({
	container: {
        flex: 1,
		backgroundColor: '#000',
		position: 'relative'
    },
	snapcontainer: {
		flexDirection: 'column',
		justifyContent: 'space-between',
		paddingHorizontal: 10,
		marginBottom: 15,
		alignItems: 'center'
	},
	spinner: {
		position: 'absolute',
		top: viewportWidth / 2,
		left: viewportWidth / 2,
		zIndex: 1000
	},
	navigation: {
		flex: 1
	},
	gallery: {
		flex: 1,
		flexDirection: 'row',
		flexWrap: 'wrap'
	},
	flipButton: {
		flex: 0.3,
		height: 40,
		marginHorizontal: 2,
		marginBottom: 10,
		marginTop: 20,
		borderRadius: 8,
		borderColor: 'white',
		borderWidth: 1,
		padding: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	flipText: {
		color: 'white',
		fontSize: 15
	},
	item: {
		margin: 4,
		backgroundColor: 'indianred',
		height: 35,
		width: 80,
		borderRadius: 5,
		alignItems: 'center',
		justifyContent: 'center'
	},
	picButton: {
		backgroundColor: 'darkseagreen'
	},
	galleryButton: {
		backgroundColor: 'indianred'
	},
	row: {
		flexDirection: 'row'
	}
});
