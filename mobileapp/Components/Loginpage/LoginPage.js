import React from 'react';
import { Image, Button, StyleSheet, Text, View, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import {yourIP} from '../../IPAddress/IPAddress.js';
import CurrentUserContext from '../Context/CurrentUserContext.js';
import { LinearGradient } from 'expo-linear-gradient';
import logo from './logo.png';

class LoginPage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: "",
            password: "",
        }
      }


    login = (context) => {
        fetch('http://' + yourIP + ':5000/Login', {
                method: 'POST',
                body: JSON.stringify({
                    'username': this.state.username,
                    'password': this.state.password,
                })
            })
            .then((response) => response.json())
            .then((responseJson) => {
                if (responseJson['success']){
                    var username = responseJson['username']
                    var userID = responseJson['userID']
                    context.setUser(username, userID)
                    this.props.navigation.navigate('Home')
                } else {
                    console.log(responseJson)
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    render(){
        return(
            <CurrentUserContext.Consumer>
                {context => (
                    <KeyboardAvoidingView
                        behavior={(Platform.OS === "ios" || Platform.OS === "android") ? "padding" : "height"}
                        style = {styles.container}
                    >
                      <LinearGradient
                        // Background Linear Gradient
                        colors={['#B8FFEE', '#60B3FF']}
                        //colors={['#C6FFF1', '#87C5FF']}
                        start={[0,0]}
                        end={[1,1]}
                        style={styles.background}
                      />
                      <Image source={logo} style={styles.logo} />
                        <View>
                            <Text></Text>
                            <TextInput
                                style = {styles.inputStyle}
                                placeholder = "Username"
                                placeholderTextColor="#FFFFFF"
                                onChangeText={(username) => {this.setState({username:username})}}
                                value={this.state.username}
                            />
                            <TextInput
                                style = {styles.inputStyle}
                                placeholder = "Password"
                                placeholderTextColor="#FFFFFF"
                                secureTextEntry={true}
                                onChangeText={(password) => {this.setState({password:password})}}
                                value={this.state.password}
                            />
                            <Button
                                // TO DO : Fix the authenticate
                                title = "Log in"
                                onPress={() => this.login(context)}
                            >
                            </Button>
                            <Button
                                title = "Create account"
                                onPress={() => this.props.navigation.navigate('CreateAccount')}
                            >
                            </Button>
                        </View>
                    </KeyboardAvoidingView>
                )}
            </CurrentUserContext.Consumer>
        )
    }
}




const offset = 10;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      textAlign: 'center',
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    background: {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 0,
      height: 850,
    },
    inputStyle: { // 3. <- Add a style for the input
        height: offset * 3.5,
        width: 250,
        margin: offset,
        paddingHorizontal: offset,
        borderColor: '#FFFFFF',
        color: '#FFFFFF',
        borderWidth: 1,
        borderRadius: 25 ,
      },
      logo: {
        width: 160,
        height: 40,
        margin: 50
      }
  });




export default LoginPage;
