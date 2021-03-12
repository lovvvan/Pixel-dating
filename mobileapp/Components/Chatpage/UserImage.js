import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';

class UserImage extends React.Component {


    


    render(){
        return(
            <View style = {userImage.container}>
                <Image
                        source={{ uri: this.props.myPartnerImage }}
                        style={userImage.thumbnail}
                />        
            </View>
        )
    }
}


const imgWidth = 75;
const userImage = StyleSheet.create({
    container: {
        height: imgWidth,
        width: imgWidth,
        
      },
    thumbnail: {
        width: imgWidth,
        height: imgWidth,
        borderWidth: 5,
        borderRadius: 20,
        borderColor: '#C6FFF1',
        //resizeMode: "contain"
    },
});

export default UserImage;