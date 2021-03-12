import { StatusBar } from 'expo-status-bar';
import React from 'react';
import ChatPage from "./Components/Chatpage/ChatPage.js"
import LoginPage from "./Components/Loginpage/LoginPage.js"
import HomePage from "./Components/Homepage/HomePage.js"
import SettingsPage from "./Components/Settingspage/SettingsPage.js"
import CreateAccountPage from "./Components/CreateAccountpage/CreateAccountPage.js"
import { render } from 'react-dom';
import { StyleSheet, Text, View, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CurrentUserProvider from './Components/Context/CurrentUserProvider.js';
import { LogBox } from 'react-native';

LogBox.ignoreLogs(['Warning: ...']); // Ignore log notification by message
LogBox.ignoreAllLogs();//Ignore all log notifications

const Stack = createStackNavigator();

export default class App extends React.Component {



  render() {
    return(
      <CurrentUserProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName = "Login">
            <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
            <Stack.Screen name="Home" component={HomePage} options={{ headerShown: false }} />
            <Stack.Screen name="Chat" component={ChatPage} />
            <Stack.Screen name="Settings" component={SettingsPage} options={{ headerShown: false }} />
            <Stack.Screen name="CreateAccount" component={CreateAccountPage} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      </CurrentUserProvider>
    )
  }


}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
