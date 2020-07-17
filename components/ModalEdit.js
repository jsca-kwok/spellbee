import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { globalStyles } from '../styles/global';

export default function ModalEdit({ setModalOpen, modalStatus, getDecks, setSelectedDeckData, selectedDeckData, editStatus, setEditStatus }) {
    const [deckName, setDeckName] = useState(`${selectedDeckData.deck}`);
    const [inputFields, setInputFields] = useState(selectedDeckData.words);
    const [newInputFields, setNewInputFields] = useState([{ wordId: uuid(), word: null, wordImg: 'default' }]);

    // add new input field
    const addInputField = () => {
        const values = [...newInputFields];
        values.push({ wordId: uuid(), word: null, wordImg: 'default' });
        setNewInputFields(values);
    }

    // collect text input values 
    const addWord = (i, text) => {
        const values = [...newInputFields];
        values[i].word = text;
        setNewInputFields(values);
    }

    // add new vocabulary deck to db
    const addNewDeck = () => {
        const newWords = [...inputFields];
        newWords.push(...newInputFields);
        console.log(newWords);
        axios.put('http://localhost:8080/vocabulary', {
            deck: `${deckName}`,
            id: `${selectedDeckData.id}`,
            deckImg: 'default',
            words: newWords
        })
        .then(_res => getDecks())
        .catch(err => console.log(err));
    }

    return(
        <View style={styles.pageContainer}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    placeholder={selectedDeckData.deck}
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                    defaultValue={selectedDeckData.deck}
                />
                {/* lists all current words in vocab deck */}
                {
                    selectedDeckData.words.map((item, i) => {
                        return (
                            <TextInput 
                                key={item.wordId}
                                style={styles.input}
                                placeholder={item.word}
                                autoCapitalize='none'
                                onChangeText={text => {addWord(i, text)}}
                                defaultValue={item.word}
                            />
                        )
                    })
                }
                {
                    newInputFields.map((field, i) => {
                        return(
                            <TextInput key={field.wordId} style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
                        )
                    })
                }
                <Icon name='ios-add-circle' type='ionicon' color='#F2822D' onPress={addInputField}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    styles={styles.button}
                    onPress={() => {
                        addNewDeck();
                        setModalOpen(!modalStatus);
                }}>
                    <Text style={globalStyles.text}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    styles={styles.button}
                    onPress={() => {
                        setModalOpen(!modalStatus);
                        setEditStatus(!editStatus);
                        setSelectedDeckData(null);
                }}>
                    <Text style={globalStyles.text}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#F2E155',
        justifyContent: 'space-between'
    },
    inputContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 60
    },
    input: {
        fontSize: 20,
        fontFamily: 'Varela',
        padding: 5
    },
    buttonContainer: {
       justifyContent: 'flex-end',
       alignItems: 'center',
       marginBottom: 50
    },
    button: {
        padding: 5
    }
})