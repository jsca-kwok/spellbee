import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function Deck(props) {
    return(
        <View style={styles.deck}>
            { props.children }
        </View>
    )
}

const styles = StyleSheet.create({
    deck: {
        backgroundColor: '#F2EF9A',
        width: 130,
        minHeight: 150,
        margin: 5,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5
    }
})