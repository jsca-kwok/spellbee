import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { globalStyles } from '../styles/global';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

export default function ModalForm({ setModalOpen, modalStatus, getDecks }) {
    const [deckName, setDeckName] = useState('');
    const [word, setWord] = useState({});
    const [word2, setWord2] = useState({});
    const [word3, setWord3] = useState({});
    const [word4, setWord4] = useState({});
    const [word5, setWord5] = useState({});
    const [wordList, setWordList] = useState([])

    // add new vocabulary deck to db
    const addNewDeck = () => {
        wordList.push(word, word2, word3, word4, word5);
        setWordList(wordList);
        axios.post('http://localhost:8080/vocabulary', {
            deck: `${deckName}`,
            id: uuid(),
            deckImg: 'default',
            words: wordList
        })
        .then(_res => getDecks())
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
                onChangeText={text => setWord({wordId: uuid(), word: text, wordImg: 'default'})}
            />
            <TextInput 
                style={globalStyles.text} 
                placeholder='New Word' 
                autoCapitalize='none'
                onChangeText={text => setWord2({wordId: uuid(), word: text, wordImg: 'default'})}
            />
            <TextInput 
                style={globalStyles.text} 
                placeholder='New Word' 
                autoCapitalize='none'
                onChangeText={text => setWord3({wordId: uuid(), word: text, wordImg: 'default'})}
            />
            <TextInput 
                style={globalStyles.text} 
                placeholder='New Word' 
                autoCapitalize='none'
                onChangeText={text => setWord4({wordId: uuid(), word: text, wordImg: 'default'})}
            />
            <TextInput 
                style={globalStyles.text} 
                placeholder='New Word' 
                autoCapitalize='none'
                onChangeText={text => setWord5({wordId: uuid(), word: text, wordImg: 'default'})}
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
                onPress={() => {setModalOpen(!modalStatus)}}
            >
                <Text style={globalStyles.container}>CANCEL</Text>
            </TouchableOpacity>
        </View>
    )
}