import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import UserImage from "./UserImage.js";

class ChattingPartner extends React.Component {
    constructor(props) {
        super(props)
    }

    render(){
        return(
            <View style = {chattingPartner.container}>
                <View style= {chattingPartner.info}>
                    <Text>{this.props.chatPartner}, 24</Text>
                    <Text>10 miles away</Text>
                </View>
                <View style={chattingPartner.imageArea}>
                    <UserImage myPartnerImage={this.props.myPartnerImage}></UserImage>        
                </View>
            </View>
        )
    }
}

const chattingPartner = StyleSheet.create({
    container: {
        height: 100,
        display: 'flex',
        alignSelf: 'stretch',
        
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    info: {
        alignSelf: 'stretch',
        justifyContent: 'center',
        margin: 12,
        marginLeft: 20,
    },
    imageArea: {
        alignSelf: 'flex-end',
        margin: 8,
        marginRight: 20,
    }


});

export default ChattingPartner;