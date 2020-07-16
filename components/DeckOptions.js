import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';

export default function DeckOptions({ toEditDeck, deleteDeck, setSelectedDeck }) {
    return(
        <View style={globalStyles.container}>
            {/* need to add onpress function for editing */}
            <TouchableOpacity>
                <Text style={globalStyles.text}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={(_e) => deleteDeck(toEditDeck)}>
                <Text style={globalStyles.text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSelectedDeck(null)}>
                <Text style={globalStyles.text}>Cancel</Text>
            </TouchableOpacity>  
        </View>
    )
}