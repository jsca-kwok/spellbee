import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import { v4 as uuid } from 'uuid';

export default function ModalForm({ setModalOpen, getDecks, setEditStatus, setSelectedDeckData }) {
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
        // check if there is a deck name
        if (!deckName) {
            Alert.alert("Oops!", "Missing a vocabulary deck name", [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        // check if there are at least 5 words
        } else if (inputFields.length < 5) {
            Alert.alert("Oops!", "Please add at least 5 words", [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        } else {
            axios.post('http://localhost:8080/vocabulary', {
                deck: `${deckName}`,
                id: uuid(),
                deckImg: 'default',
                words: inputFields
            })
            .then(_res => {
                getDecks();
                setModalOpen(false);
                setEditStatus(false);
                setSelectedDeckData(null);
            })
            .catch(err => console.log(err));
        }
    }

    return(
        <View style={styles.pageContainer}>
            <View style={styles.inputContainer}>
                <TextInput 
                    style={styles.deckInput} 
                    placeholder='Vocabulary Deck Name' 
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                />
                <ScrollView>
                    {
                        inputFields.map((_field, i) => {
                            return(
                                <TextInput style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
                            )
                        })
                    }
                    <Icon name='ios-add-circle' type='ionicon' color='#F2822D' onPress={addInputField}/>
                </ScrollView>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity  
                    style={styles.button}
                    onPress={() => {
                        addNewDeck();
                }}>
                    <Text style={globalStyles.text}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => {
                        setModalOpen(false);
                        setEditStatus(false);
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
        marginTop: 50, 
        flex: 1
    },
    deckInput: {
        backgroundColor: '#F2EF9A',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        fontSize: 20,
        fontFamily: 'Varela',
        padding: 15,
        marginBottom: 15,
        width: '90%'
    },
    input: {
        fontSize: 20,
        fontFamily: 'Varela',
        paddingVertical: 5,
        textAlign: 'center'
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row'
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