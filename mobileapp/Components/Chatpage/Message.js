import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import CurrentUserContext from '../Context/CurrentUserContext.js';



class Message extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            sender: this.props.sender,
            message: this.props.message,
        }
    }

    //<View style={messageStyle.containerYou}> 
    //</View>

    render(){

        const contextData = this.context;
        const username = contextData.username;

        let messageBox;
        if (this.state.sender === username) {
            messageBox = 
                (   
                    <View style={messageStyle.containerYou}>
                        <Text  style={messageStyle.messageText}>{this.state.message}</Text>
                    </View>
                )
        } else {
            messageBox = 
            (   
                <View style={messageStyle.containerChattingPartner}>
                    <Text  style={messageStyle.messageText}>{this.state.message}</Text>
                </View>
            )
        }

        return(
            <View>
                {messageBox}
            </View>
        )
    }
}

var {height, width} = Dimensions.get('window');

const messageStyle = StyleSheet.create({
    containerYou: {
        alignSelf: 'flex-end',
        margin: 8,
        marginRight: 8,
        flex: 1,
        backgroundColor: '#B4D9FF',
        borderRadius: 15,

        shadowColor: "#000",
        shadowOffset: {
                width: 0,
                height: 5,
            },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,

        maxWidth: width*0.6,
    },
    containerChattingPartner: {
        alignSelf: 'flex-start',
        margin: 8,
        marginLeft: 8,
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 15,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 5,
        },
        shadowOpacity: 0.36,
        shadowRadius: 6.68,
        elevation: 11,

        maxWidth: width*0.6,
    },
    name: {
        color: 'black',
    },
    messageText: {
        padding: 8,
    }

});


Message.contextType = CurrentUserContext;







export default Message; 