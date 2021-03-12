import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {yourIP} from '../../IPAddress/IPAddress.js'
import * as FileSystem from 'expo-file-system';
import CurrentUserContext from '../Context/CurrentUserContext.js';
import logo from './logo.png';

class SettingsPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            selectedImage: null,
            imageUploaded: false,
            myProfileImage: null,
        }
    }

    componentDidMount = () => {
        const contextData = this.context;
        const userID = contextData.userID;
        this.fetchImage(userID);
    }

    setSelectedImage = (image) => {
        this.setState(() => ({
            selectedImage: image,
        }))

    }

    fetchImage = async (userID) => {
        const response = await fetch('http://' + yourIP + ':5000/getImage', {
            method: 'POST',
            body: JSON.stringify({
                'userID': userID
            })
        })
        const json = await response.json()

        if (json['success']){
            const imageData = "data:image/jpeg;base64," + json['imageData']
            this.setState(() => ({
                myProfileImage: imageData,
            }))
        }
    }

    openImagePickerAsync = async () => {
        let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (permissionResult.granted === false) {
          alert("Permission to access camera roll is required!");
          return;
        }

        let pickerResult = await ImagePicker.launchImageLibraryAsync({base64:true});

        if (pickerResult.cancelled === true) {
            return;
          }

        this.setSelectedImage({ localUri: pickerResult.uri, entireThing:pickerResult });

    }

    uploadImage = async (userID) => {
        if (this.state.selectedImage !== null) {

            var file_to_send;

            if (this.state.selectedImage['entireThing'].base64 == null) {
                file_to_send = await this.state.selectedImage['entireThing'].uri
                var index = file_to_send.indexOf("base64,");
                file_to_send = file_to_send.substring(index + 7)
            } else {
                file_to_send = await this.state.selectedImage['entireThing'].base64
            }

            const params = {photo_base64: file_to_send};

            fetch ('http://' + yourIP + ':5000/storeImgDB', {
                    method: 'post',
                    body: JSON.stringify({
                        'name': 'Image Upload',
                        'userID': userID,
                        'file_attachment': params,
                    })
                }
            )
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson['success']){
                    console.log("upload success");
                    //this.setSelectedImage({ localUri: null, entireThing:null });
                    this.setState(() => ({
                        imageUploaded: true,
                        selectedImage: null,
                    }))
                    this.fetchImage(userID)
                    this.props.route.params.updateImage(userID)
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                console.error(error);
            });
        } else {
            console.log("Please select an image first...")
        }
    }


    createMessages = (messages) => {
        return (messages.map((message) => (
            <Message
                key={message.messageId}
                sender={message.sender}
                message={message.message}
            />
        )))
    }

    renderImage = () => {

        if (this.state.selectedImage !== null) {
            return <Image
                        source={{ uri: this.state.selectedImage.localUri }}
                        style={styles.thumbnail}
                    />
        }
        else if (this.state.myProfileImage != null) {
            return <Image
                        source={{ uri: this.state.myProfileImage }}
                        style={styles.thumbnail}
                    />
        }
    }

    render(){
        if (Platform.OS === "ios") {
            return(
                <CurrentUserContext.Consumer>
                {context => (
                <View style={styles.container}>
                    <View style = {styles.header}>
                    <View style={styles.shadowLight}>
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.settings} >Back</Text>
                        </TouchableOpacity>
                        </View>
                        <Image source={logo} style={styles.logo} />
                        <View
                            style={styles.dummyButton}>
                        </View>
                    </View>
                    <Text style={styles.title} >SETTINGS</Text>
                    <View style={styles.shadowDark}>
                        <View style={styles.shadowLight}>
                            {this.renderImage()}
                        </View>
                    </View>
                    <View>
                    {
                        this.state.imageUploaded ?
                        <Text> Image successfully uploaded! </Text>
                            :
                        <Text></Text>
                    }
                    </View>
                    <View style={styles.shadowLight}>
                    <TouchableOpacity
                        onPress={this.openImagePickerAsync} style={styles.button}>
                        <Text style={styles.buttonText}>Select Photo</Text>
                    </TouchableOpacity>
                    </View>
                    <View style={styles.shadowLight}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.5}
                        onPress={() => this.uploadImage(context.userID)}>
                        <Text style={styles.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>
                    </View>
                </View>
                )}
                </CurrentUserContext.Consumer>
            )
        } else {
            // Android
            return(
                <CurrentUserContext.Consumer>
                {context => (
                <View style={styles.container}>
                    <View style = {styles.header}>
                    <View> 
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.settings} >Back</Text>
                        </TouchableOpacity>
                        </View>
                        <Image source={logo} style={styles.logo} />
                        <View
                            style={styles.dummyButton}>
                        </View>
                    </View>
                    <Text style={styles.title} >SETTINGS</Text>
                    <View style={styles.shadowDark}>
                        <View style={styles.shadowLight}>
                            {this.renderImage()}
                        </View>
                    </View>
                    <View>
                    {
                        this.state.imageUploaded ?
                        <Text> Image successfully uploaded! </Text>
                            :
                        <Text></Text>
                    }
                    </View>
                    <View style={styles.shadowLight}>
                        <TouchableOpacity
                            onPress={this.openImagePickerAsync} style={styles.button}>
                            <Text style={styles.buttonText}>Select Photo</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.shadowLight}>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.5}
                            onPress={() => this.uploadImage(context.userID)}>
                            <Text style={styles.buttonText}>Upload Photo</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                )}
                </CurrentUserContext.Consumer>
            )
        }
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
  },
  logo: {
    top: 0,
    width: 160,
    height: 40,
    marginTop: 50,
    marginLeft: 35,
    marginRight: 35,
  },
  settingsButton: {
    top: 0,
    marginTop: 50,
    width: 70,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: "#AEAEC0",
    shadowOffset: {
            width: 5,
            height: 5,
        },
    shadowOpacity: 0.4,
    shadowRadius: 6.68,
    elevation: 60,
    backgroundColor: '#F0F0F3',
  },
  button: {
    top: 0,
    marginTop: 20,
    width: 150,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    shadowColor: "#AEAEC0",
    shadowOffset: {
            width: 5,
            height: 5,
        },
    shadowOpacity: 0.4,
    shadowRadius: 6.68,
    elevation: 60,
    backgroundColor: '#F0F0F3',
  },
  dummyButton: {
    top: 0,
    marginTop: 50,
    width: 60,
    height: 30,
    justifyContent: 'center',
  },
  settings: {
    padding: 0,
    margin: 0,
  },
  thumbnail: {
    width: 300,
    height: 300,
    resizeMode: "cover",
    borderColor: "#83DAFF",
    borderWidth: 5,
    borderRadius: 20,
  },
  shadowDark: {
    borderRadius: 20,
    shadowColor: "#AEAEC0",
    shadowOffset: {
            width: 10,
            height: 10,
        },
    shadowOpacity: 0.4,
    shadowRadius: 6.68,
    elevation: 30,
    backgroundColor: '#FFFFFF',
  },
  shadowLight: {
    borderRadius: 20,
    shadowColor: "#FFFFFF",
    shadowOffset: {
            width: -10,
            height: -10,
        },
    shadowOpacity: 0.7,
    shadowRadius: 6.68,
    elevation: 30,
  },
  text: {
    fontSize: 24,
    marginTop: 20
  },
  title: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20
  },
});

SettingsPage.contextType = CurrentUserContext;







export default SettingsPage;
