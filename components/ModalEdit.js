import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Icon } from 'react-native-elements';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ImagePick from './ImagePick';
import WordImagePick from './WordImagePick';
import { globalStyles } from '../styles/global';

export default function ModalEdit({ setModalOpen, getDecks, setSelectedDeckData, selectedDeckData, setEditStatus, userId }) {
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
        const wordId = values[i].wordId;
        const wordImg = values[i].wordImg;
        values.splice(i, 1, {
            word: text,
            wordId: wordId,
            wordImg: wordImg
        })
        setInputFields(values);
    }

    // change image
    const changeImage = (i, wordImg) => {
        const values = [...inputFields];
        const wordId = values[i].wordId;
        const word = values[i].word;
        values.splice(i, 1, {
            word: word,
            wordId: wordId,
            wordImg: wordImg
        })
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
        } else if (realWords.length < 6) {
            Alert.alert("Oops!", "Please add at least 6 words", [
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
                words: newWords,
                userId: userId
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
                                    <Animatable.View animation='lightSpeedIn' style={styles.wordContainer} key={item.wordId}>
                                        <WordImagePick defaultWordImg={'default'} index={i} changeImage={changeImage} currentWordImg={item.wordImg} /> 
                                        <TextInput 
                                            style={styles.input}
                                            placeholder={item.word}
                                            autoCapitalize='none'
                                            onChangeText={text => {changeWord(i, text)}}
                                            defaultValue={item.word}
                                        />
                                    </Animatable.View>
                                )
                            }
                        })
                    }
                    {
                        newInputFields.map((field, i) => {
                            return(
                                <Animatable.View animation='lightSpeedIn' style={styles.wordContainer} key={field.wordId}>
                                    <WordImagePick defaultWordImg={'default'} index={i} addImage={addImage} /> 
                                    <TextInput key={field.wordId} style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
                                </Animatable.View>
                            )
                        })
                    }
                    <Icon size={wp('7%')} name='ios-add-circle' type='ionicon' color='#F2822D' onPress={addInputField}/>
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
        marginTop: hp('8%')
    },
    wordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: wp('3%')
    },
    inputContainer: {
        marginTop: hp('1%')
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
        fontSize: wp('6.5%'),
        fontFamily: 'Varela',
        padding: hp('2%'),
        width: wp('70%'),
        height: hp('8%')
    },
    input: {
        fontSize: wp('6.5%'),
        fontFamily: 'Varela',
        paddingVertical: hp('1%'),
        textAlign: 'center'
    },
    buttonContainer: {
       justifyContent: 'space-evenly',
       alignItems: 'center',
       marginTop: hp('2%'),
       flexDirection: 'row',
       marginBottom: hp('1%')
    },
    button: {
        paddingVertical: hp('2%'),
        marginBottom: hp('2%'),
        width: wp('35%'),
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        alignItems: 'center'
    }
})