import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { v4 as uuid } from 'uuid';
import ImagePick from './ImagePick';
import WordImagePick from './WordImagePick';
import { globalStyles } from '../styles/global';

export default function ModalForm({ setModalOpen, getDecks, setEditStatus, setSelectedDeckData }) {
    const [deckName, setDeckName] = useState('');
    const [inputFields, setInputFields] = useState([{ wordId: uuid(), word: null, wordImg: 'default' }]);
    const [deckImg, setDeckImg] = useState(null);
    
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

    // collect images
    const addImage = (i, wordImg) => {
        const values = [...inputFields];
        values[i].wordImg = wordImg;
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
        // post user uploaded deckImg if available
        } else if (deckImg) {
            axios.post('http://localhost:8080/vocabulary', {
                deck: `${deckName}`,
                id: uuid(),
                deckImg: deckImg,
                words: inputFields
            })
            .then(_res => {
                getDecks();
                setModalOpen(false);
                setEditStatus(false);
                setSelectedDeckData(null);
            })
            .catch(err => console.log(err));
        // post default deckImg if user does not select a deckImg
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
            <View style={styles.deckContainer}>
                <ImagePick defaultDeckImg={'default'} deckImg={deckImg} setDeckImg={setDeckImg}/>
                <TextInput 
                    style={styles.deckInput} 
                    placeholder='Vocabulary Deck' 
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                />
            </View>
            <KeyboardAwareScrollView style={styles.inputContainer} extraHeight={160}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {
                        inputFields.map((field, i) => {
                            return(
                                <View key={field.wordId} style={styles.wordContainer}>
                                    <WordImagePick defaultWordImg={'default'} index={i} addImage={addImage}/> 
                                    <TextInput style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
                                </View>
                            )
                        })
                    }
                    <Icon name='ios-add-circle' type='ionicon' color='#F2822D' onPress={addInputField}/>
                </ScrollView>
            </KeyboardAwareScrollView>
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
        backgroundColor: '#F2E155'
    },
    deckContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 50,
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start'
    },
    inputContainer: {
        height: 370,
        marginTop: 15
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
        width: 240,
        height: 50
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