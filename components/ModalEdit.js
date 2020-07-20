import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import ImagePick from './ImagePick';
import WordImagePick from './WordImagePick';
import { globalStyles } from '../styles/global';

export default function ModalEdit({ setModalOpen, getDecks, setSelectedDeckData, selectedDeckData, setEditStatus }) {
    const [deckName, setDeckName] = useState(`${selectedDeckData.deck}`);
    const [inputFields, setInputFields] = useState(selectedDeckData.words);
    const [newInputFields, setNewInputFields] = useState([]);
    const [deckImg, setDeckImg] = useState(selectedDeckData.deckImg);

    // cancel changes - revert back to prev state
    const cancelChanges = () => {
        setDeckName(`${selectedDeckData.deck}`);
        setInputFields(selectedDeckData.words);
        setDeckImg(selectedDeckData.deckImg);
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

    // collect images
    const addImage = (i, wordImg) => {
        const values = [...inputFields];
        values[i].wordImg = wordImg;
        setNewInputFields(values);
    }

    // change word
    const changeWord = (i, text) => {
        const values = [...inputFields];
        values[i].word = text;
        setInputFields(values);
    }

    // change image
    const changeImage = (i, wordImg) => {
        const values = [...inputFields];
        values[i].wordImg = wordImg;
        setInputFields(values);
    }

    // add new vocabulary deck to db
    const addNewDeck = () => {
        const newWords = [...inputFields];
        newWords.push(...newInputFields);
        // filter out empty words from being added into db
        const realWords = newWords.filter(word => word.word !== null && word.word !== '');
        setInputFields(realWords);
        if (!deckName) {
            Alert.alert("Oops!", "Missing a vocabulary deck name", [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        } else if (realWords.length < 5) {
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
                deckImg: deckImg,
                words: realWords
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
                <ImagePick defaultDeckImg={selectedDeckData.deckImg} deckImg={deckImg} setDeckImg={setDeckImg} />
                <TextInput 
                    style={styles.deckInput} 
                    placeholder={selectedDeckData.deck}
                    autoCapitalize='none'
                    onChangeText={text => {setDeckName(text)}}
                    defaultValue={selectedDeckData.deck}
                />
            </View>
            <KeyboardAwareScrollView style={styles.inputContainer} extraHeight={160}>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {/* lists all current words in vocab deck */}
                    {
                        selectedDeckData.words.map((item, i) => {
                            // only show input if input field is not empty
                            if (item.word !== null && item.word!== '') {
                                return (
                                    <View style={styles.wordContainer}>
                                        <WordImagePick defaultWordImg={'default'} index={i} changeImage={changeImage} currentWordImg={item.wordImg} /> 
                                        <TextInput 
                                            key={item.wordId}
                                            style={styles.input}
                                            placeholder={item.word}
                                            autoCapitalize='none'
                                            onChangeText={text => {changeWord(i, text)}}
                                            defaultValue={item.word}
                                        />
                                    </View>
                                )
                            }
                        })
                    }
                    {
                        newInputFields.map((field, i) => {
                            return(
                                <View style={styles.wordContainer}>
                                    <WordImagePick defaultWordImg={'default'} index={i} addImage={addImage} /> 
                                    <TextInput key={field.wordId} style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
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
    },
    deckContainer: {
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