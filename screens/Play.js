import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, Text } from 'react-native';
import * as Speech from 'expo-speech';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';
import RoundEnd from '../components/RoundEnd';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';


// generate random feedback
const feedback = ['Correcto-mundo!', 'Fabulous!', 'Yesiree!', `That's right!`];
const index = Math.floor(Math.random()*4);

export default function Play({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [spellItem, setSpellItem] = useState(null);
    const [itemsLeft, setItemsLeft] = useState(5);
    const [showFeedback, setShowFeedback] = useState(false);

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
        setShowFeedback(false);
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
            const count = itemsLeft - 1;
            setItemsLeft(count);
        }
        // do not show feedback for last correct answer
        if (spellItem === input && itemsLeft !== 1) {
            setShowFeedback(true);
        } else if (itemsLeft < 1) {
            setShowFeedback(false);
        }
    }

    // return to decks from result screen
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <View style={styles.playScene}>
            <View style={styles.imageContainer}>
                {
                    deckWords.map(word => {
                        return (
                            <Animatable.View key={word.wordId} animation='pulse' iterationCount='infinite'>
                                <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                                    <SpellItem style={styles.spellItem}>
                                        <Image style={globalStyles.images} source={defaultImages[word.wordImg] || animalImages[word.word] || coloursImages[word.word] || fruitsAndVegImages[word.word]} />
                                    </SpellItem>
                                </TouchableOpacity>
                            </Animatable.View>
                        )
                    })
                }
            </View>
            {/* show feedback on correct answer */}
            {
                showFeedback ? <Animatable.Text style={styles.feedback} animation='slideInUp'>{feedback[index]}</Animatable.Text> : null
            }
            {/* if no items are left to spell, hide input and show RoundEnd */}
            {
                itemsLeft !== 0 ? 
                <TextInput 
                    onChange={(event) => handleInputChange(event)}
                    placeholder='Tap here to spell it!' 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    ref={textInput}
                    style={globalStyles.input}
                /> : null
            }
            {
                itemsLeft === 0 ? <RoundEnd goBack={goBack} /> : null
            }
        </View>
    );
}

const styles = StyleSheet.create({
    playScene: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#7ACDF2'
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    feedback: {
        fontSize: 25,
        fontFamily: 'Varela',
        color: '#175B00'
    }
})