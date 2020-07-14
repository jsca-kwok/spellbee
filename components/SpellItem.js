import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function SpellItem(props) {

    return(
        <View style={StyleSheet.spellItem}>
            <View style={StyleSheet.spellItemContent}>
                { props.children }
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    spellItem: {

    },
    spellItemContent: {
        
    }
})