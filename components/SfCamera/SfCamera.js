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
		if (this.camera) {
			this.camera.takePictureAsync({ base64: true, quality: 0 }).then(data => {
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

				// FileSystem.moveAsync({
				//   from: data.uri,
				//   to: `${FileSystem.documentDirectory}photos/Photo_${this.state.photoId}.jpg`,
				// }).then(() => {
				//   this.setState({
				//     photoId: this.state.photoId + 1,
				//   });
				//   Vibration.vibrate();
				// });
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
		return (
			<Camera
				ref={ref => {
					this.camera = ref;
				}}
				style={{
					flex: 1
				}}
				type={this.state.type}
				flashMode={this.state.flash}
				autoFocus={this.state.autoFocus}
				zoom={this.state.zoom}
				whiteBalance={this.state.whiteBalance}
				ratio={this.state.ratio}
				focusDepth={this.state.depth}
			>
				<View
					style={{
						flex: 0.5,
						backgroundColor: 'transparent',
						flexDirection: 'row',
						justifyContent: 'space-around',
						paddingTop: Constants.statusBarHeight / 2
					}}
				>
					<TouchableOpacity
						style={styles.flipButton}
						onPress={this.toggleFacing.bind(this)}
					>
						<Text style={styles.flipText}> FLIP </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.flipButton}
						onPress={this.toggleFlash.bind(this)}
					>
						<Text style={styles.flipText}>
							{' '}
							FLASH: {this.state.flash}{' '}
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={styles.flipButton}
						onPress={this.toggleWB.bind(this)}
					>
						<Text style={styles.flipText}>
							{' '}
							WB: {this.state.whiteBalance}{' '}
						</Text>
					</TouchableOpacity>
				</View>
				<View
					style={{
						flex: 0.4,
						backgroundColor: 'transparent',
						flexDirection: 'row',
						alignSelf: 'flex-end',
						marginBottom: -5
					}}
				>
					{this.state.autoFocus !== 'on' ? (
						<Slider
							style={{
								width: 150,
								marginTop: 15,
								marginRight: 15,
								alignSelf: 'flex-end'
							}}
							onValueChange={this.setFocusDepth.bind(this)}
							step={0.1}
						/>
					) : null}
				</View>
				<View
					style={{
						flex: 0.1,
						paddingBottom: isIPhoneX ? 20 : 0,
						backgroundColor: 'transparent',
						flexDirection: 'row',
						alignSelf: 'flex-end'
					}}
				>
					<TouchableOpacity
						style={[
							styles.flipButton,
							styles.picButton,
							{ flex: 0.3, alignSelf: 'flex-end' }
						]}
						onPress={this.takePicture.bind(this)}
					>
						<Text style={styles.flipText}> SNAP </Text>
					</TouchableOpacity>
					<TouchableOpacity
						style={[
							styles.flipButton,
							styles.galleryButton,
							{ flex: 0.25, alignSelf: 'flex-end' }
						]}
						onPress={this.toggleView.bind(this)}
					>
						<Text style={styles.flipText}> Gallery </Text>
					</TouchableOpacity>
				</View>
			</Camera>
		);
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
        <ActivityIndicator style={styles.spinner} size="large" color="#0000ff" animating={this.state.isLoading}/>
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
