import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity, Fade } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Home({ navigation }) {

    const startGameHandler = () => {
        // go to 'Decks' screen and pass in navigation prop
        navigation.navigate('Decks', {navigation});
    }

    return (
        <View style={globalStyles.container}>
            <Text style={globalStyles.text}>Logged in!</Text>
            <TouchableOpacity style={styles.startButton} onPress={startGameHandler}>
                <Text style={globalStyles.text}>START GAME</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    startButton: {
        backgroundColor: '#f5f5f5',
        margin: 40,
        padding: 15,
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5
    }
})