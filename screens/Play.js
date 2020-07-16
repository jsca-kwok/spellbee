import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Image } from 'react-native';
import * as Speech from 'expo-speech';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';

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
        <View style={styles.playScene}>
            <View style={styles.imageContainer}>
                {
                    deckWords.map(word => {
                        return (
                            <View key={word.wordId}>
                                <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                                    <SpellItem>
                                        <Image style={globalStyles.images} source={defaultImages[word.wordImg] || animalImages[word.word] || coloursImages[word.word] || fruitsAndVegImages[word.word]} />
                                    </SpellItem>
                                </TouchableOpacity>
                            </View>
                        )
                    })
                }
            </View>
            <TextInput 
                onChange={(event) => handleInputChange(event)}
                placeholder='Tap here to spell it!' 
                autoCapitalize='none'
                autoCompleteType='off'
                ref={textInput}
                style={globalStyles.input}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    playScene: {
        flex: 1,
        alignItems: 'center'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center'
    }
})