import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { v4 as uuid } from 'uuid';

export default function ModalForm({ setModalOpen, modalStatus, getDecks, editStatus, setEditStatus, setSelectedDeckData }) {
    const [deckName, setDeckName] = useState('');
    const [inputFields, setInputFields] = useState([{ wordId: uuid(), word: null, wordImg: 'default' }]);
    
    // add new input field
    const addInputField = () => {
        const values = [...inputFields];
        values.push({ wordId: uuid(), word: null, wordImg: 'default' });
        setInputFields(values);
    }

    // collect text input values 
    const addWord = (i, text) => {
        const values = [...inputFields];
        values[i].word = text;
        setInputFields(values);
    }

    // add new vocabulary deck to db
    const addNewDeck = () => {
        axios.post('http://localhost:8080/vocabulary', {
            deck: `${deckName}`,
            id: uuid(),
            deckImg: 'default',
            words: inputFields
        })
        .then(_res => getDecks())
        .catch(err => console.log(err));
    }

    return(
        <View style={styles.pageContainer}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.input} 
                    placeholder='Vocabulary Deck Name' 
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                />
                {
                    inputFields.map((_field, i) => {
                        return(
                            <TextInput style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
                        )
                    })
                }
                <Icon name='ios-add-circle' type='ionicon' color='#F2822D' onPress={addInputField}/>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity  
                    style={styles.button}
                    onPress={() => {
                        addNewDeck();
                        setModalOpen(!modalStatus);
                }}>
                    <Text style={globalStyles.text}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
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