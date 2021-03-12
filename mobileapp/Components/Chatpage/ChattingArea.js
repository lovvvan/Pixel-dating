import React from 'react';
import { TouchableWithoutFeedback, Keyboard, Platform, StyleSheet, Text, View, Button, SafeAreaView, Dimensions, KeyboardAvoidingView } from 'react-native';
import NewMessage from "./NewMessage.js";
import MessageList from "./MessageList.js";
import io from 'socket.io-client';
import {yourIP} from '../../IPAddress/IPAddress.js';


class ChattingArea extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            messages: [],
        }
        this.socket = null;
        this.messageListRef = null;
        this.stillChatting;
    }

    componentDidMount = () => {
        const username = this.props.username;
        const chatPartner  = this.props.chatPartner;
        this.props.fetchImagePixelized(this.props.myPartnerID) //  TODO : Not properly tested yet
        this.ConnectSocket();
        // TODO: need to call a join method here that joins the correct user
        //this.testJoinFromPelle();
        //this.testJoinFromKjelle();

        this.joinRoom();
    }

    componentWillUnmount = () => {
        this.endMatch(this.props.chatroomID)
        var data = {
            "userID" : this.props.userID,
            "username" : this.props.username,
            "chatroomID" : this.props.chatroomID,    
        }
        this.socket.emit('leave', data)
        this.socket.disconnect() // is this leave?
    }

    createNewMessage = (messageData) => {
        const tmpState = this.state;

        const newMessage = {
            messageId: messageData.messageID,
            sender: messageData.from,
            message: messageData.message,
        };
        const newMessages = tmpState.messages.slice();
        newMessages.push(newMessage);
        this.setState(() => ({
            messages: newMessages,
        }))
        this.messageListRef.sendScroll();

    }

    ConnectSocket = () => {
        // Connects to server
        this.socket = io("http://" + yourIP + ":5005", {transports: [ 'websocket' ], reconnectionAttempts: 1})
        //Add event listeners
        this.socket.on("connect_error", (err) => {
            console.log(err)
        });
        this.socket.on('message', (data) => {
            if (this.stillChatting){
                console.log("received message")
                var ReceivedMessageObject = JSON.parse(data);
                this.createNewMessage(ReceivedMessageObject);
                if (ReceivedMessageObject.pixelLevelUpdated){
                    console.log("now")
                    this.props.fetchImagePixelized(this.props.myPartnerID, this.props.chatroomID)    
                }
            }
        })
        this.socket.on('matchEnded', (data) => {
            this.stillChatting = false;
            console.log("Match Ended")
        })
    }

    // TODO change to send userID instead of username
    // HERE!
    sendMessage = (message) => {
      fetch('http://' + yourIP + ':5000/sendMessageREST', {
            method: 'POST',
            body: JSON.stringify({
                'userID' : this.props.userID,
                'message' : message,
                'chatroomID' : this.props.chatroomID
            })
        })
        .then((response) => response.json())
        .then((responseJson) => {
          var pixelLevelUpdated = responseJson['pixelLevelUpdated']
          var messageID = responseJson['messageID']

          var data = {
          "userID" : this.props.userID,
          "username" : this.props.username,
          "chatroomID" : this.props.chatroomID,
          "message" : message,
          "messageID" : messageID,
          "pixelLevelUpdated" : pixelLevelUpdated
          }
          this.socket.emit('message', data)
        })
        .catch((error) => {
            console.error(error);
        });
    }


    joinRoom = () => {
        this.socket.emit('join', {'username' : this.props.username,
                                  'userID' : this.props.userID,
                                  'chatroomID' : this.props.chatroomID});
        this.stillChatting = true;
    }


    findMatch = async (username) => {
        const response = await fetch('http://' + yourIP + ':5000/newMatch', {
            method: 'POST',
            body: JSON.stringify({
                'username': username
            })
        })
        const json = await response.json()
        return json
    }

    endMatch = async (chatroomID) => {
        const response = await fetch('http://' + yourIP + ':5000/endMatch', {
            method: 'POST',
            body: JSON.stringify({
                'chatroomID': chatroomID
            })
        })
        const json = await response.json()
        return json
    }


    render(){
        return(
          <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : null}
              style={{ flex: 1 }}
          >
              <SafeAreaView style={styles.container}>
                  <TouchableWithoutFeedback
                      onPress={Keyboard.dismiss}
                  >
                      <View style={styles.inner}>
                          <MessageList
                              ref = {(messageListRef) => {this.messageListRef = messageListRef}}
                              messages = {this.state.messages}
                          >
                          </MessageList>
                          <NewMessage
                              username = {this.props.username}
                              chatPartner = {this.props.chatPartner}
                              sendChatMessage = {this.sendMessage}
                          >
                          </NewMessage>
                      </View>
                  </TouchableWithoutFeedback>
              </SafeAreaView>
          </KeyboardAvoidingView>
        )
    }
}

var {height, width} = Dimensions.get('window');

const styles = StyleSheet.create({
    container: {
        flex: 1,
        borderWidth: 2,
        borderColor: '#F0F0F3',
        borderTopColor: '#AEAEC0',
        
    },
    inner: {
        flex: 1,
        justifyContent: "flex-end",
    },
    containerOld: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 2,
      borderTopColor: '#AEAEC0',
      width: width*0.95,
      backgroundColor: '#F0F0F3',
      borderColor: 'green',
      borderWidth: 3
    },
    containerKeyboard: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      borderTopWidth: 2,
      borderTopColor: '#AEAEC0',
      width: width*0.95,
      backgroundColor: '#F0F0F3',
      borderColor: 'green',
      borderWidth: 3
    },
});









export default ChattingArea;
