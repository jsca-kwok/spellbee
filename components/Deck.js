import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Deck(props) {
    return(
        <View style={StyleSheet.deck}>
            <View style={StyleSheet.deckContent}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    deck: {

    },
    deckContent: {
        
    }
})