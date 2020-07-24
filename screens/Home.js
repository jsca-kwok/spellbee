import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalStyles } from '../styles/global';

export default function Home({ navigation, userName, signOutWithGoogleAsync, userId }) {

    // go to 'Decks' screen and pass in navigation prop
    const startGameHandler = () => {
        navigation.navigate('Decks', { navigation, userId: userId });
    }

    return (
        <View style={globalStyles.container}>
            <Animatable.Text style={globalStyles.text} animation='flash' direction='alternate'>Hi {userName}!</Animatable.Text>
            <TouchableOpacity onPress={signOutWithGoogleAsync}>
                <Text style={styles.notYou}>Not you?</Text>
            </TouchableOpacity>
            <Animatable.View animation='bounceIn'>
                <Animatable.View animation='pulse' iterationCount='infinite'>
                    <TouchableOpacity style={styles.startButton} onPress={startGameHandler}>
                        <Text style={globalStyles.text}>START GAME</Text>
                    </TouchableOpacity>
                </Animatable.View>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    startButton: {
        backgroundColor: '#f5f5f5',
        margin: wp('5%'),
        padding: hp('2%'),
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5
    },
    notYou: {
        fontFamily: 'Varela',
        fontSize: hp('2.5%'),
        textDecorationStyle: 'solid',
        textDecorationLine: 'underline'
    }
})