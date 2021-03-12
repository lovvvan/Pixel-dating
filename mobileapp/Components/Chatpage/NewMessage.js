import React from 'react';
import { StyleSheet, Text, View, TextInput, Button, Dimensions, Platform, KeyboardAvoidingView } from 'react-native';
import io from 'socket.io-client';
import { StatusBar } from 'expo-status-bar';
import { render } from 'react-dom';

var {height, width} = Dimensions.get('window');

class NewMessage extends React.Component {

    constructor(props) {
        super(props);
        console.log(props)
        this.state = {
            text: '',
            margin: 0
        }
      }

    handleOnChangeText = (text) => {
        this.setState({text: text})
    }

    sendChatMessage = () => {
        this.props.sendChatMessage(this.state.text)
        this.setState({text: ''})
    }


    onFocus= () => {
       this.setState({
           margin:90
       })
     }

     onBlur= () => {
       this.setState({
         margin: 0
       })
     }


    render() {
      if (Platform.OS === "ios") {
        return (
            <KeyboardAvoidingView
                //behavior={(Platform.OS === "ios" || Platform.OS === "android") ? "padding" : "height"}
                style={{flex: 1,
                        backgroundColor: '#f5f5f5',
                        borderWidth: 1,
                        borderColor: '#AEAEC0',
                        maxHeight: height*0.08,
                        alignSelf: 'stretch',
                        borderRadius: 90,
                        padding: 5,
                        marginBottom: this.state.margin,
                        justifyContent: 'center'}}
            >
                <StatusBar style="auto" />

                <View style={styles.innerContainer}>

                        <TextInput
                            style = {styles.textInput}
                            onBlur={ () => this.onBlur() }
                            onFocus={ () => this.onFocus() }
                            placeholder = "Type message..."
                            onChangeText={(text) => this.handleOnChangeText(text)}
                            value={this.state.text}
                        />

                        <Button
                            title="Send"
                            onPress={this.sendChatMessage}
                            style={styles.button}
                        />
                </View>
            </KeyboardAvoidingView>
        );
      } else {
        return (
          <KeyboardAvoidingView
                //behavior={(Platform.OS === "ios" || Platform.OS === "android") ? "padding" : "height"}
                style={styles.container}
            >
                <StatusBar style="auto" />

                <View style={styles.innerContainer}>
                        <TextInput
                            style = {styles.textInput}
                            placeholder = "Type message..."
                            onChangeText={(text) => this.handleOnChangeText(text)}
                            value={this.state.text}
                        />
                        <Button
                            title="Send"
                            onPress={this.sendChatMessage}
                            style={styles.button}
                        />

                </View>
            </KeyboardAvoidingView>
        )
      }
    }
}



// const newMessage = StyleSheet.create({
//     container: {
//       flex: 1,
//       alignItems: 'center',
//       justifyContent: 'center',
//     },
// });


// const offset = 24;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        borderWidth: 1,
        borderColor: '#AEAEC0',
        maxHeight: height*0.08,
        //minHeight: height*0.05,
        alignSelf: 'stretch',
        borderRadius: 90,
        padding: 5,
        justifyContent: 'center',
    },
    innerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    textInput: { // 3. <- Add a style for the input
        // height: offset * 2,
        // margin: offset,
        // paddingHorizontal: offset,
        //borderColor: '#111111',
        //borderWidth: 1,
        //maxHeight: height*0.1,
        alignSelf: 'flex-start',
        width: width*0.75,
        marginLeft: 8,
      },
      button: {
          alignSelf: 'flex-end',
          width: width*0.15,
          marginRight: 8,
      }
  });






export default NewMessage;
