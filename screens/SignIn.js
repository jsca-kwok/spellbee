import React, { useState } from 'react';
import * as Google from 'expo-google-app-auth';
import { StyleSheet, Text, View, Button, TouchableOpacity, Image } from 'react-native';
import { globalStyles } from '../styles/global';
import Home from './Home';
const googleSignIn = require('../assets/images/icons/googleSignIn.png');
const logo = require('../assets/images/icons/logo.png');

export default function SignIn({ navigation }) {
    const [signedIn, setSignedIn] = useState(false);

    async function signInWithGoogleAsync() {
        try {
          const result = await Google.logInAsync({
            iosClientId: '155282369432-69nfb6n6pf9h5vm3ufq6v7ltmfe8nu3r.apps.googleusercontent.com',
            scopes: ['profile', 'email'],
          });
      
          if (result.type === 'success') {
            setSignedIn(true);
          } else {
            console.log('cancelled')
          }
        } catch (e) {
          console.log('error');
        }
      }

    return (
        <View style={styles.screenContainer}>
            <Image style={styles.logoImg} source={logo} />
            <Text style={styles.logoText}>SpellBee</Text>
        {
            !signedIn ? 
            <TouchableOpacity onPress={signInWithGoogleAsync}>
                <Image style={styles.signInButton} source={googleSignIn} />
            </TouchableOpacity>
            : <Home navigation={navigation} />
        }
        </View>
    );
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F2E155'
    },
    logoText: {
       fontFamily: 'Varela',
       fontWeight: '900',
       fontSize: 55,
       color: '#444',
    },
    logoImg: {
        resizeMode: 'contain',
        height: 200,
        margin: 40,
        marginBottom: 0
    },
    signInButton: {
        marginTop: 60,
        width: 190,
        resizeMode: 'contain'
    }
})