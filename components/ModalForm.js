import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

export default function ModalForm({ setModalOpen, modalStatus }) {
    const [deckName, setDeckName] = useState('');
    const [word, setWord] = useState([]);

    console.log(deckName, word);

    // add new vocabulary deck to db
    const addNewDeck = () => {
        axios.post('http://localhost:8080/vocabulary', {
            deck: `${deckName}`,
            deckImg: '',
            words: [{
                wordId: uuid(),
                word: `${word}`,
                wordImg: ''
            }]
        })
            .then(res => console.log(res.data))
            .catch(err => console.log(err));
    }

    return(
        <View style={globalStyles.container}>
            <TextInput 
                style={globalStyles.text} 
                placeholder='Vocabulary Deck Name' 
                autoCapitalize='none'
                onChangeText={text => {setDeckName(text)}}
            />
            <TextInput 
                style={globalStyles.text} 
                placeholder='New Word' 
                autoCapitalize='none'
                onChangeText={text => {setWord(text)}}
            />
            <TouchableOpacity 
                style={globalStyles.container} 
                onPress={() => {
                    addNewDeck();
                    setModalOpen(!modalStatus);
                }}>
                <Text style={globalStyles.container}>SAVE</Text>
            </TouchableOpacity>
        </View>
    )
}