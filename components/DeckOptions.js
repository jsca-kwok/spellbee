import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';

export default function DeckOptions({ toEditDeck, confirmDeleteDeck, setSelectedDeck, setModalOpen, modalOpen, setEditStatus, editStatus }) {
    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setModalOpen(!modalOpen)}>
                <Text style={globalStyles.text}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={(_e) => confirmDeleteDeck(toEditDeck)}>
                <Text style={globalStyles.text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
                setSelectedDeck(null);
                setEditStatus(!editStatus);
            }}>
                <Text style={globalStyles.text}>Cancel</Text>
            </TouchableOpacity>  
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        paddingVertical: 15,
        marginBottom: 15,
        width: 120,
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        alignItems: 'center'
    }
})