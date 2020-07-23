import React, { useState } from 'react';
import * as Google from 'expo-google-app-auth';
import * as Animatable from 'react-native-animatable';
import { StyleSheet, View, TouchableOpacity, Image } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Home from './Home';
const googleSignIn = require('../assets/images/icons/googleSignIn.png');
const logo = require('../assets/images/icons/logo.png');

export default function SignIn({ navigation }) {
    const [signedIn, setSignedIn] = useState(false);
    const [accessToken, setAccessToken] = useState(null);
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);

    const config = {
      iosClientId: '155282369432-38ad416pn945o9u968s4ncoogp1okok3.apps.googleusercontent.com',
      scopes: ['profile', 'email']
    }

    async function signInWithGoogleAsync() {
        try {
          const result = await Google.logInAsync(config);
          if (result.type === 'success') {
            setSignedIn(true);
            setAccessToken(result.accessToken);
            setUserName(result.user.givenName);
            setUserId(result.user.id);
          } else {
            console.log('cancelled')
          }
        } catch (e) {
          console.log('error logging in');
        }
      }

    async function signOutWithGoogleAsync() {
      try {
        const result = await Google.logOutAsync({accessToken, ...config});
        setSignedIn(false);
      }
      catch (e) {
        console.log('error logging out');
      }
    }

    return (
        <View style={styles.screenContainer}>
            <Animatable.Image animation='flipInY' style={styles.logoImg} source={logo} />
            <Animatable.Text animation='zoomInUp' style={styles.logoText}>SpellBee</Animatable.Text>
        {
            !signedIn ? 
            <TouchableOpacity onPress={signInWithGoogleAsync}>
                <Image style={styles.signInButton} source={googleSignIn} />
            </TouchableOpacity>
            : <Home navigation={navigation} userName={userName} signOutWithGoogleAsync={signOutWithGoogleAsync} userId={userId}/>
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
       fontSize: hp('10%'),
       color: '#444',
    },
    logoImg: {
        resizeMode: 'contain',
        height: hp('35%'),
        margin: hp('10%'),
        marginBottom: 0
    },
    signInButton: {
        marginTop: hp('10%'),
        width: hp('35%'),
        resizeMode: 'contain'
    }
})