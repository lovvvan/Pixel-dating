import React from 'react';
import { Platform, StyleSheet, Text, View, ScrollView, Dimensions, KeyboardAvoidingView } from 'react-native';
import Message from "./Message.js";
import CurrentUserContext from '../Context/CurrentUserContext.js';

var {height, width} = Dimensions.get('window');

class MessageList extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
        };
        this.scroll = null;
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

    sendScroll = () => {
        this.scroll.scrollToEnd();
    }

    render(){
        return(
            <View
                style={chatPage.outerContainer}
            >
                <ScrollView style={chatPage.scrollView} ref={(scroll => {this.scroll = scroll})}>
                    <View style = {chatPage.container}>
                            {this.createMessages(this.props.messages)}
                    <View style={chatPage.uglySolution}>

                    </View>
                    </View>
                </ScrollView>
            </View>
        )
    }
}

MessageList.contextType = CurrentUserContext;


const chatPage = StyleSheet.create({

    outerContainer: {
        flex: 1,
        alignSelf: 'stretch',
    },
    outerContainerKey: {
        flex: 1,
        alignSelf: 'stretch',
        maxHeight: height*0.5,
    },
    scrollView: {
        maxHeight: height,
    },
    container: {
      flexGrow: 1,
      justifyContent: 'flex-start',
    },
    uglySolution: {
        height: 45,
    }

});









export default MessageList;
