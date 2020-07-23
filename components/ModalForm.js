import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import axios from 'axios';
import { Icon } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { v4 as uuid } from 'uuid';
import ImagePick from './ImagePick';
import WordImagePick from './WordImagePick';
import { globalStyles } from '../styles/global';

export default function ModalForm({ setModalOpen, getDecks, setEditStatus, setSelectedDeckData, userId }) {
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
        } else if (inputFields.length < 6) {
            Alert.alert("Oops!", "Please add at least 6 words", [
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
                words: inputFields,
                userId: userId 
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
                words: inputFields,
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
                                <Animatable.View animation='lightSpeedIn' key={field.wordId} style={styles.wordContainer}>
                                    <WordImagePick defaultWordImg={'default'} index={i} addImage={addImage}/> 
                                    <TextInput style={styles.input} placeholder='New word' onChangeText={text => addWord(i, text)} autoCapitalize='none'/>
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
        paddingVertical: hp('2%'),
        textAlign: 'center'
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: hp('2%'),
        marginBottom: hp('1%'),
        flexDirection: 'row'
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