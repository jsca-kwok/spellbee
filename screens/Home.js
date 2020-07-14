import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Home({ navigation }) {

    const startGameHandler = () => {
        // go to 'Decks' screen and pass in navigation prop
        navigation.navigate('Decks', {navigation});
    }

    return (
        <TouchableOpacity style={globalStyles.container} onPress={startGameHandler}>
            <Text style={globalStyles.text}>START GAME</Text>
        </TouchableOpacity>
    );
}