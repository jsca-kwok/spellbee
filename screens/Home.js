import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';

export default function Home({ navigation }) {

    // go to 'Decks' screen and pass in navigation prop
    const startGameHandler = () => {
        navigation.navigate('Decks', {navigation});
    }

    // generate random game tip
    const gameTip = ['Tip: Long press on a vocab deck to edit or delete', 'Tip: Add your own vocab decks', `Tip: Don't forget to rest your eyes`];
    const index = Math.floor(Math.random()*3);

    return (
        <View style={globalStyles.container}>
            <Animatable.Text style={globalStyles.text} animation='flash' direction='alternate'>Logged in!</Animatable.Text>
            <Text style={styles.tip}>{gameTip[index]}</Text>
            <Animatable.View animation='pulse' iterationCount='infinite'>
                <TouchableOpacity style={styles.startButton} onPress={startGameHandler}>
                    <Text style={globalStyles.text}>START GAME</Text>
                </TouchableOpacity>
            </Animatable.View>
        </View>
    );
}

const styles = StyleSheet.create({
    startButton: {
        backgroundColor: '#f5f5f5',
        margin: 25,
        padding: 15,
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5
    },
    tip: {
        fontFamily: 'Varela',
        fontSize: 14,
        marginTop: 15
    }
})