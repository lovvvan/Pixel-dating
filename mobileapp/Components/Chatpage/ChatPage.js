import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import ChattingPartner from "./ChattingPartner.js";
import ChattingArea from "./ChattingArea.js";
import CurrentUserContext from '../Context/CurrentUserContext.js';
import {yourIP} from '../../IPAddress/IPAddress.js'

class ChatPage extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            myPartnerImage : null,
        }
    }

    componentDidMount = () => {
        const chatroomID   = this.props.route.params.chatroomID;
        const myPartnerID  = this.props.route.params.myPartnerID;
        this.fetchImagePixelized(myPartnerID, chatroomID);
    }

    fetchImagePixelized = async (myPartnerID, chatroomID) => {
        const response = await fetch('http://' + yourIP + ':5000/getImagePixelized', {
            method: 'POST',
            body: JSON.stringify({
                'userID': myPartnerID,
                'chatroomID': chatroomID,
            })
        })
        const json = await response.json()
        if (json['success']){
            const imageData = "data:image/jpeg;base64," + json['imageData']
            this.setState(() => ({
                myPartnerImage: imageData,
            }))
        }
    }



    render(){
        const chatPartner  = this.props.route.params.chatPartner;
        const chatroomID   = this.props.route.params.chatroomID;
        const myPartnerID  = this.props.route.params.myPartnerID;
        return(
            <CurrentUserContext.Consumer>
                {context => (
                    <View style = {chatPage.container}>
                        <ChattingPartner chatPartner={chatPartner}
                                         myPartnerImage={this.state.myPartnerImage}></ChattingPartner>
                        <ChattingArea chatPartner={chatPartner}
                                      username={context.username}
                                      chatroomID={chatroomID}
                                      userID={context.userID}
                                      myPartnerID={myPartnerID}
                                      fetchImagePixelized={this.fetchImagePixelized}
                                      ></ChattingArea>
                    </View>
                )}
            </CurrentUserContext.Consumer>
        )
    }
}

const chatPage = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});



export default ChatPage;
