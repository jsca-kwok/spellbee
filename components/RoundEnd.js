import React from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';
const logo = require('../assets/images/icons/logo.png');

// generate random feedback
const feedback = ['Fantastic Job!', 'Spelling Genius!', 'Brilliant!', 'Most Excellent!'];
const index = Math.floor(Math.random()*4);

export default function RoundEnd({ goBack }) {
    return (
        <View style={styles.playScene}>
            <Animatable.View style={styles.logoImg} animation='slideOutUp' iterationCount='infinite' direction='alternate'>
                <Animatable.Image style={styles.logoImg} source={logo} animation='swing' iterationCount='infinite'/>
            </Animatable.View> 
            <Text style={styles.text}>{feedback[index]}</Text>
            <Animatable.View animation='pulse' iterationCount='infinite'>
                <TouchableOpacity style={styles.button} onPress={() => goBack() }>
                    <Text style={globalStyles.text}>Let's spell some more!</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    playScene: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#7ACDF2'
    },
    logoImg: {
        resizeMode: 'contain',
        flex: 1
    },
    text: {
        fontFamily: 'Varela',
        fontSize: 25, 
    },
    button: {
        padding: 15,
        marginVertical: 15,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        alignItems: 'center'
    }
})