import React from 'react';
import { Image, StyleSheet, Text, View, TextInput, Button, TouchableOpacity, Platform } from 'react-native';
import {yourIP} from '../../IPAddress/IPAddress.js'
import logo from './logo.png';

class CreateAccountPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
        }
      }

    validateFormData = () => {
        if (this.state.username != "" &&
            this.state.password != "" &&
            this.state.email != ""){
            return true
        }
        return false
    }
    createAccount = () => {

        if (this.validateFormData()){
            fetch('http://' + yourIP + ':5000/createAccount', {
                method: 'POST',
                body: JSON.stringify({
                    'username': this.state.username,
                    'password': this.state.password,
                    'email': this.state.email
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson['success']){
                    this.props.navigation.navigate('Login')
                    // TODO : give feedback to user that the account creation was a success
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                console.error(error);
            });
        } else {
            console.log("Please enter the proper information...")
        }


    }

    render(){
        if (Platform.OS === "ios") {
            return(
                <View style={styles.container} >
                    <View style = {styles.header}>
                        <View style={styles.shadowLight}>
                        <TouchableOpacity
                            style={styles.settingsButton}
                            onPress={() => this.props.navigation.goBack()}>
                            <Text style={styles.settings} >Back</Text>
                        </TouchableOpacity>
                        </View>
                        <Image source={logo} style={styles.logo} />
                        <View style={styles.shadowLight}>
                        <View style={styles.dummyButton}>
                        </View>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.title} >CREATE ACCOUNT</Text>
                        <Text style={styles.text}>
                            Fill in your information below to create your Pixelice account!
                        </Text>
                    </View>
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Username"
                        onChangeText={(username) => {this.setState({username:username})}}
                        value={this.state.username}
                    />
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Password"
                        secureTextEntry={true}
                        onChangeText={(password) => {this.setState({password:password})}}
                        value={this.state.password}
                    />
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Email"
                        onChangeText={(email) => (this.setState({email:email}))}
                        value={this.state.email}
                    />
                    <View style={styles.shadowLight}>
                    <TouchableOpacity
                        style={styles.button}
                        activeOpacity={0.5}
                        onPress={this.createAccount}>
                        <Text style={styles.buttonText}>Create account</Text>
                    </TouchableOpacity>
                    </View>
                </View>
            )
        } else {
            return(
                <View style={styles.container} >
                    <View style = {styles.header}>
                        <View>
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => this.props.navigation.goBack()}>
                                <Text style={styles.settings} >Back</Text>
                            </TouchableOpacity>
                        </View>
                        <Image source={logo} style={styles.logo} />
                        <View>
                            <View style={styles.dummyButton}>
                            </View>
                        </View>
                    </View>
                    <View style={{alignItems: 'center'}}>
                        <Text style={styles.title} >CREATE ACCOUNT</Text>
                        <Text style={styles.text}>
                            Fill in your information below to create your Pixelice account!
                        </Text>
                    </View>
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Username"
                        onChangeText={(username) => {this.setState({username:username})}}
                        value={this.state.username}
                    />
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Password"
                        secureTextEntry={true}
                        onChangeText={(password) => {this.setState({password:password})}}
                        value={this.state.password}
                    />
                    <TextInput
                        style = {styles.inputStyle}
                        placeholder = "Email"
                        onChangeText={(email) => (this.setState({email:email}))}
                        value={this.state.email}
                    />
                    <View>
                        <TouchableOpacity
                            style={styles.button}
                            activeOpacity={0.5}
                            onPress={this.createAccount}>
                            <Text style={styles.buttonText}>Create account</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            )
        }
    }
}

const offset = 10;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
    },
    logo: {
      top: 0,
      width: 160,
      height: 40,
      marginTop: 50,
      marginLeft: 20,
      marginRight: 20,
    },
    settingsButton: {
      top: 0,
      marginTop: 50,
      width: 80,
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
    dummyButton: {
      top: 0,
      marginTop: 50,
      width: 80,
      height: 30,
      justifyContent: 'center',
    },
    text: {
        width: 300,
        marginTop: 30,
        marginBottom: 20,
        textAlign: 'center',
        alignItems: 'center',
    },
    inputStyle: { // 3. <- Add a style for the input
        height: offset * 3.5,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#111111',
        borderWidth: 1,
            borderWidth: 1,
            borderRadius: 25 ,

      },
      button: {
        top: 0,
        marginTop: 20,
        width: 200,
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
        alignSelf: 'center',
        alignItems: 'center',
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
        //alignItems: 'center',
      },
      title: {
        fontSize: 24,
        marginTop: 20,
      },
  });








export default CreateAccountPage;
