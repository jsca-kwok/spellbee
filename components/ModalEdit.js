import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { globalStyles } from '../styles/global';

export default function ModalEdit({ setModalOpen, getDecks, setSelectedDeckData, selectedDeckData, setEditStatus }) {
    const [deckName, setDeckName] = useState(`${selectedDeckData.deck}`);
    const [inputFields, setInputFields] = useState(selectedDeckData.words);
    const [newInputFields, setNewInputFields] = useState([]);

    // cancel changes - revert back to prev state
    const cancelChanges = () => {
        setDeckName(`${selectedDeckData.deck}`);
        setInputFields(selectedDeckData.words);
        setNewInputFields([]);
        getDecks();
    }

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

    // change word
    const changeWord = (i, text) => {
        const values = [...inputFields];
        values[i].word = text;
        setInputFields(values);
    }

    // add new vocabulary deck to db
    const addNewDeck = () => {
        const newWords = [...inputFields];
        newWords.push(...newInputFields);
        if (!deckName) {
            Alert.alert("Oops!", "Missing a vocabulary deck name", [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        } else if (inputFields.length < 5) {
            Alert.alert("Oops!", "Please add at least 5 words", [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        } else {
            axios.put('http://localhost:8080/vocabulary', {
                deck: `${deckName}`,
                id: `${selectedDeckData.id}`,
                deckImg: 'default',
                words: newWords
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
                    placeholder={selectedDeckData.deck}
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                    defaultValue={selectedDeckData.deck}
                />
                <ScrollView>
                    {/* lists all current words in vocab deck */}
                    {
                        selectedDeckData.words.map((item, i) => {
                            return (
                                <TextInput 
                                    key={item.wordId}
                                    style={styles.input}
                                    placeholder={item.word}
                                    autoCapitalize='none'
                                    onChangeText={text => {changeWord(i, text)}}
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
                        cancelChanges();
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
        textAlign: 'center',
        alignItems: 'center',
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