import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';
import axios from 'axios';

export default function ModalEdit({ setModalOpen, modalStatus, getDecks, setSelectedDeckData, selectedDeckData, editStatus, setEditStatus }) {
    const [deckName, setDeckName] = useState(`${selectedDeckData.deck}`);
    const [wordList, setWordList] = useState([]);

    // add new vocabulary deck to db
    const addNewDeck = () => {
        wordList.push(word, word2, word3, word4, word5);
        setWordList(wordList);
        axios.post('http://localhost:8080/vocabulary', {
            deck: `${deckName}`,
            id: uuid(),
            deckImg: '',
            words: wordList
        })
        .then(_res => getDecks())
        .catch(err => console.log(err));
    }

    return(
        <View style={globalStyles.container}>
            <TextInput 
                style={globalStyles.text} 
                placeholder={selectedDeckData.deck}
                autoCapitalize='none'
                onChangeText={text => {setDeckName(text)}}
                defaultValue={selectedDeckData.deck}
            />
            {/* lists all current words in vocab deck */}
            <FlatList 
                data={selectedDeckData.words}
                renderItem={({ item }) => (
                    <TextInput 
                        key={item.wordId}
                        style={globalStyles.text} 
                        placeholder={item.word}
                        autoCapitalize='none'
                        onChangeText={text => {setDeckName(text)}}
                        defaultValue={item.word}
                    />
                )}
            />
            <TouchableOpacity 
                style={globalStyles.container} 
                onPress={() => {
                    addNewDeck();
                    setModalOpen(!modalStatus);
                }}
            >
                <Text style={globalStyles.container}>SAVE</Text>
            </TouchableOpacity>
            <TouchableOpacity 
                style={globalStyles.container} 
                onPress={() => {
                    setModalOpen(!modalStatus);
                    setEditStatus(!editStatus);
                    setSelectedDeckData(null);
                }}
            >
                <Text style={globalStyles.container}>CANCEL</Text>
            </TouchableOpacity>
        </View>
    )
}