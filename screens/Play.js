import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput } from 'react-native';
import * as Speech from 'expo-speech';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';

export default function Play({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [spellItem, setSpellItem] = useState(null);

    // set ref to textinput
    const textInput = React.createRef();

    // set current word list in play
    const wordList = navigation.getParam('words');
    const [deckWords, setDeckWords] = useState(wordList);

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
                wordList.map(word => {
                    return (
                        <View key={word.id}>
                        <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                            <SpellItem>
                                <Text style={globalStyles.text}>{word.word}</Text>
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