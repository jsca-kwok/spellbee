import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/global';

export default function SignIn({ navigation }) {

    const startGameHandler = () => {
        // go to 'Home' screen and pass in navigation prop
        navigation.navigate('Home', {navigation});
    }

    return (
        <>
        <Button title='go' onPress={startGameHandler} />
        </>
    );
}