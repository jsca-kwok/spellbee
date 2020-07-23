import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import { globalStyles } from '../styles/global';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
const logo = require('../assets/images/icons/logo.png');

export default function Tutorial({ tutorialMessage }) {
    return(
        <View style={styles.tutorial}>
          <Image source={logo} style={styles.mascot}/>
          <View style={styles.chatBubble}>
            <Text style={globalStyles.text}>{tutorialMessage}</Text>
          </View>
        </View>
    )
}

const styles = StyleSheet.create({
    tutorial: {
        flexDirection: 'row',
        alignItems: 'center',
        left: -50,
        backgroundColor: 'transparent'
    },
    mascot: {
        resizeMode: 'contain',
        width: wp('30%'),
        height: hp('15%')
    },
    chatBubble: {
        backgroundColor: 'rgba(245,245,245, 0.6)',
        padding: hp('2%'),
        borderRadius: 10,
        borderColor: 'black'
    }
})