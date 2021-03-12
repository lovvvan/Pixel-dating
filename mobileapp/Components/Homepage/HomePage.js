import React from 'react';
import { Image, Button, StyleSheet, Text, View, TouchableOpacity, Platform } from 'react-native';
import CurrentUserContext from '../Context/CurrentUserContext.js';
import {yourIP} from '../../IPAddress/IPAddress.js';
import logo from './logo.png';

// Maybe I can add the profile picure in context and get it from there each time?

class HomePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            matches: [],
            myProfileImage: null,
            selectedImage: null,
        }
    }

    componentDidMount() {
        const contextData = this.context;
        const userID = contextData.userID;
        this.fetchImage(userID);
    }

    // TODO: Matches with username. Should match with
    // userID, matches with username currently
    findMatch = async (userID) => {
        const response = await fetch('http://' + yourIP + ':5000/newMatch', {
            method: 'POST',
            body: JSON.stringify({
                'userID': userID
            })
        })
        const json = await response.json()
        const myMatchID = json['value']
        const chatroomID = json['chatroomID']
        const matchUsername = json['matchUsername']
        this.createNewMatch(myMatchID, chatroomID, matchUsername);
        return json
    }

    createNewMatch = (userID, chatroomID, matchUsername) => {
        const tmpState = this.state;
        const newMatch = {
            matchId: chatroomID,
            matchedWith: userID,
            matchUsername: matchUsername
        };
        const newMatches = tmpState.matches.slice();
        newMatches.push(newMatch);
        this.setState(() => ({
            matches: newMatches,
        }))
    }

    renderMatches = () => {
        return (this.state.matches.map((match) => (
                <Button
                    key={match.matchId}
                    title = {"Open Chat with " + match.matchUsername}
                    onPress={() => this.props.navigation.navigate('Chat', {
                        chatPartner: match.matchedWith,
                        chatroomID: match.matchId,
                    })}
                />
        )))
    }

    startNewChat = async (context) => {
        // Find match
        // Navigate to Chat page, send chat partner as props
        const match = await this.findMatch(context.userID)
        const success = match['success']

        if (success == 'true') {
            const myMatch = match['value'] // This is the ID?
            const myMatchUsername = match['matchUsername']
            const chatroomID = match['chatroomID']
            this.props.navigation.navigate('Chat', {
                chatPartner: myMatchUsername,
                chatroomID: chatroomID,
                myPartnerID: myMatch, // ID?
            })
        } else {
            // TODO: display to user someway that starting new
            // chat was unsuccessful
            console.log('Find match and start new chat failed')
        }
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

    pixTest = async (userID, pixLevel) => {
      const response = await fetch('http://' + yourIP + ':5000/getImagePixTest', {
          method: 'POST',
          body: JSON.stringify({
              'userID': userID,
              'pixLevel': pixLevel

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

    render(){
        if (Platform.OS === "ios") {
            return(
                <CurrentUserContext.Consumer>
                    {context => (
                        <View style = {styles.container}>
                            <View style = {styles.header}>
                                
                                <View style={styles.shadowLight}>
                                <TouchableOpacity
                                    style={styles.settingsButton}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Text style={styles.settings} >Log out</Text>
                                </TouchableOpacity>
                                </View>
                                <Image source={logo} style={styles.logo} />
                                <View >style={styles.shadowLight}>
                                <TouchableOpacity
                                    style={styles.settingsButton}
                                    onPress={() => this.props.navigation.navigate('Settings', {
                                        userID: context.userID,
                                        updateImage: this.fetchImage
                                    })}>
                                    <Text style={styles.settings} >Settings</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.title} >HOME</Text>
                            <View style={styles.shadowDark}>
                                <View style={styles.shadowLight}>
                                    {this.renderImage()}
                                </View>
                            </View>
                            <Text>Test pixelation levels below</Text>
                            <View style={styles.pix} >
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 0)}>
                                    <Text style={styles.buttonText}>0</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 1)}>
                                    <Text style={styles.buttonText}>1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 2)}>
                                    <Text style={styles.buttonText}>2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 3)}>
                                    <Text style={styles.buttonText}>3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 4)}>
                                    <Text style={styles.buttonText}>4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 5)}>
                                    <Text style={styles.buttonText}>5</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.text} >Hi {context.username}!</Text>
                            <View style={styles.shadowLight}>
                            <TouchableOpacity
                                style={styles.button}
                                activeOpacity={0.5}
                                onPress={() => this.startNewChat(context)}>
                                <Text style={styles.buttonText}>Find your next match!</Text>
                            </TouchableOpacity>
                            </View>
                        </View>
                    )}
                </CurrentUserContext.Consumer>
                )
        } else {
            // For Android
            return(
                <CurrentUserContext.Consumer>
                    {context => (
                        <View style = {styles.container}>
                            <View style = {styles.header}>
                                
                                <View>
                                <TouchableOpacity
                                    style={styles.settingsButton}
                                    onPress={() => this.props.navigation.goBack()}>
                                    <Text style={styles.settings} >Log out</Text>
                                </TouchableOpacity>
                                </View>
                                <Image source={logo} style={styles.logo} />
                                <View>
                                <TouchableOpacity
                                    style={styles.settingsButton}
                                    onPress={() => this.props.navigation.navigate('Settings', {
                                        userID: context.userID,
                                        updateImage: this.fetchImage
                                    })}>
                                    <Text style={styles.settings} >Settings</Text>
                                </TouchableOpacity>
                                </View>
                            </View>
                            <Text style={styles.title} >HOME</Text>
                            <View style={styles.shadowDark}>
                                <View style={styles.shadowLight}>
                                    {this.renderImage()}
                                </View>
                            </View>
                            <Text>Test pixelation levels below</Text>
                            <View style={styles.pix} >
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 0)}>
                                    <Text style={styles.buttonText}>0</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 1)}>
                                    <Text style={styles.buttonText}>1</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 2)}>
                                    <Text style={styles.buttonText}>2</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 3)}>
                                    <Text style={styles.buttonText}>3</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 4)}>
                                    <Text style={styles.buttonText}>4</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.pixButton}
                                    activeOpacity={0.5}
                                    onPress={() => this.pixTest(context.userID, 5)}>
                                    <Text style={styles.buttonText}>5</Text>
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.text} >Hi {context.username}!</Text>
                            <View style={styles.shadowLight}>
                                <TouchableOpacity
                                    style={styles.button}
                                    activeOpacity={0.5}
                                    onPress={() => this.startNewChat(context)}>
                                    <Text style={styles.buttonText}>Find your next match!</Text>
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
    pix: {
      flexDirection: 'row',
    },
    button: {
      top: 0,
      marginTop: 20,
      width: 250,
      height: 70,
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
      backgroundColor: '#83DAFF',
    },
    pixButton: {
      top: 0,
      marginTop: 10,
      marginLeft: 5,
      marginRight: 5,
      width: 40,
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
    pixButtonText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonText: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    dummyButton: {
      top: 0,
      marginTop: 50,
      width: 80,
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


HomePage.contextType = CurrentUserContext;






export default HomePage;
