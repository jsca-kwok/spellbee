import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';

export default function Play({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [spellItem, setSpellItem] = useState(null);

    // set ref to textinput
    const textInput = React.createRef();

    // set current word list in play
    const wordList = navigation.getParam('words');
    // randomizes word list and chooses only 5
    const randomWords = wordList.sort(() => Math.random() - 0.5).slice(0,5);
    const [deckWords, setDeckWords] = useState(randomWords);

    // text to speech
    const sayWord = (word) => {
        Speech.speak(word, { pitch: 1.4, rate: 0.7 });
    }

    const handlePress = (word) => {
        sayWord(word);
        setSpellItem(word);
    }

    // native element of onChange is passed in
    const handleInputChange = (event) => {
        setInputValue(event.nativeEvent.text);
        spellCheck(spellItem, event.nativeEvent.text);
    }

    const spellCheck = (spellItem, input) => {
        // find word to remove if spelling is correct
        const takeOutOfPlay = deckWords.find(word => word.word === spellItem);
        const takeOutIndex = deckWords.indexOf(takeOutOfPlay);
        // remove word and set existing words as words in play
        if (spellItem === input) {
            deckWords.splice(takeOutIndex, 1);
            setDeckWords(deckWords);
            // clear input when spelling is correct
            textInput.current.clear();
        }
    }

    return (
        <View style={globalStyles.container}>
            {
                deckWords.map(word => {
                    return (
                        <View key={word.wordId}>
                            <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                                <SpellItem style={globalStyles.container}>
                                    <Image style={globalStyles.images} source={animalImages[word.word] || coloursImages[word.word] || fruitsAndVegImages[word.word]} />
                                </SpellItem>
                            </TouchableOpacity>
                        </View>
                    )
                })
            }
            <TextInput 
                onChange={(event) => handleInputChange(event)}
                placeholder='spell it!' 
                autoCapitalize='none'
                autoCompleteType='off'
                ref={textInput}
            />
        </View>
    );
}