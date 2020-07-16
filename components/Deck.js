import React from 'react';
import { StyleSheet, View } from 'react-native';
import { globalStyles } from '../styles/global';

export default function Deck(props) {
    return(
        <View style={globalStyles.container}>
            { props.children }
        </View>
    )
}

