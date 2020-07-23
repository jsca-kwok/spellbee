import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ConfettiCannon from 'react-native-confetti-cannon';
import { globalStyles } from '../styles/global';
const logo = require('../assets/images/icons/logo.png');

// generate random feedback
const feedback = ['Fantastic Job!', 'Spelling Genius!', 'Brilliant!', 'Most Excellent!'];
const index = Math.floor(Math.random()*4);

export default function RoundEnd({ goBack }) {
    return (
        <>
        <ConfettiCannon style={styles.confettiContainer} count={200} origin={{x: -10, y: -10}} fadeOut={true}/>
        <View style={styles.playScene}>
            <Animatable.View style={styles.logoImgContainer} animation='slideOutUp' iterationCount='infinite' direction='alternate'>
                <Animatable.Image style={styles.logoImg} source={logo} animation='swing' iterationCount='infinite'/>
            </Animatable.View> 
            <Text style={styles.text}>{feedback[index]}</Text>
            <Animatable.View animation='pulse' iterationCount='infinite'>
                <TouchableOpacity style={styles.button} onPress={() => goBack() }>
                    <Text style={globalStyles.text}>Let's spell some more!</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
        </>
    );
}

const styles = StyleSheet.create({
    confettiContainer: {
        flex: 1,
        backgroundColor: '#7ACDF2',
    },
    playScene: {
        flex: 1,
        alignItems: 'center',
    },
    logoImgContainer: {
        flex: 1
    },
    logoImg: {
        resizeMode: 'contain',
        bottom: 250,
        width: wp('40%'),
        height: hp('60%')
    },
    text: {
        fontFamily: 'Varela',
        fontSize: wp('10%')
    },
    button: {
        padding: wp('5%'),
        marginVertical: hp('5%'),
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        alignItems: 'center'
    }
})