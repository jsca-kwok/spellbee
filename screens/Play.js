import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Text } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';
import RoundEnd from '../components/RoundEnd';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';


// generate random feedback
const positiveFeedback = ['Correcto-mundo!', 'Fabulous!', 'Yesiree!', `That's right!`];
const negativeFeedback = ['Not quite..', 'Try again', 'So close!', 'Almost!'];
const index = Math.floor(Math.random()*4);

export default function Play({ navigation }) {
    const [inputValue, setInputValue] = useState('');
    const [spellItem, setSpellItem] = useState(null);
    const [itemsLeft, setItemsLeft] = useState(4);
    const [showPositiveFeedback, setShowPositiveFeedback] = useState(false);
    const [showNegativeFeedback, setShowNegativeFeedback] = useState(false);

    // set ref to textinput
    const textInput = React.createRef();

    // set current word list in play
    const wordList = navigation.state.params.item.words;
    // randomizes word list and chooses only 4
    const randomWords = wordList.sort(() => Math.random() - 0.5).slice(0,4);
    const [deckWords, setDeckWords] = useState(randomWords);

    // text to speech according to user settings
    const voicePitch = navigation.state.params.voicePitch;
    const voiceRate = navigation.state.params.voiceRate;
    const sayWord = (word) => {
        Speech.speak(word, { pitch: voicePitch, rate: voiceRate });
    }

    const handlePress = (word) => {
        sayWord(word);
        setSpellItem(word);
        setShowPositiveFeedback(false);
        setShowNegativeFeedback(false);
    }

    // native element of onChange is passed in
    const handleInputChange = (event) => {
        setInputValue(event.nativeEvent.text.toLowerCase());
        spellCheck(spellItem, event.nativeEvent.text.toLowerCase());
    }

    const spellCheck = (spellItem, input) => {
        // find word to remove if spelling is correct
        const takeOutOfPlay = deckWords.find(word => word.word === spellItem);
        const takeOutIndex = deckWords.indexOf(takeOutOfPlay);
        // remove word and set existing words as words in play
        if (spellItem === input) {
            deckWords.splice(takeOutIndex, 1);
            setDeckWords(deckWords);
            playSound(true);
            // clear input when spelling is correct
            textInput.current.clear();
            const count = itemsLeft - 1;
            setItemsLeft(count);
        } else {
            playSound(false);
            setShowNegativeFeedback(true);
        }
        // do not show feedback for last correct answer
        if (spellItem === input && itemsLeft !== 1) {
            setShowPositiveFeedback(true);
        } else if (itemsLeft < 1) {
            setShowPositiveFeedback(false);
        }
    }

    // play sound effect only if game settings have sfx toggled on
    const soundEffectsStatus = navigation.state.params.soundEffectsStatus;

    const playSound = async(correctStatus) => {
        if (soundEffectsStatus && correctStatus) {
            const correctFX = new Audio.Sound();
            await correctFX.loadAsync(
                require('../assets/sounds/correct.wav')
            );
            correctFX.replayAsync();
        } else if (soundEffectsStatus && !correctStatus) {
            const incorrectFX = new Audio.Sound();
            await incorrectFX.loadAsync(
                require('../assets/sounds/incorrect.wav')
            )
            incorrectFX.replayAsync();
        }
        return;
    }

    // return to decks from result screen
    const goBack = () => {
        navigation.goBack();
    }

    return (
        <KeyboardAvoidingView style={styles.playScene} behavior='padding' keyboardVerticalOffset={55}>
            <View style={styles.imageContainer}>
                {
                    deckWords.map(word => {
                        return (
                            <Animatable.View key={word.wordId} animation='pulse' iterationCount='infinite'>
                                <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                                    <SpellItem style={styles.spellItem}>
                                        {
                                            word.wordImg && word.wordImg.slice(0,4) === 'file' ? <Image style={styles.images} source={{uri: word.wordImg}} />
                                            : <Image style={styles.images} source={defaultImages[word.wordImg] || animalImages[word.word] || coloursImages[word.word] || fruitsAndVegImages[word.word]} />
                                        }
                                    </SpellItem>
                                </TouchableOpacity>
                            </Animatable.View>
                        )
                    })
                }
            </View>
            {/* show feedback on correct answer */}
            {
                showPositiveFeedback ? <Animatable.View animation='slideInUp' style={styles.feedbackContainer}><Text style={styles.positiveFeedback}>{positiveFeedback[index]}</Text></Animatable.View> : null
            }
            {
                showNegativeFeedback ? <Animatable.View animation='slideInUp' style={styles.feedbackContainer}><Text style={styles.negativeFeedback}>{negativeFeedback[index]}</Text></Animatable.View> : null
            }
            {/* if no items are left to spell, hide input and show RoundEnd */}
            {
                itemsLeft !== 0 ? 
                <TextInput 
                    onSubmitEditing={(event) => handleInputChange(event)}
                    placeholder='Tap here to spell it!' 
                    autoCapitalize='none'
                    autoCompleteType='off'
                    autoCorrect={false}
                    ref={textInput}
                    style={globalStyles.input}
                /> : <RoundEnd goBack={goBack} />
            }
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    playScene: {
        flex: 1,
        backgroundColor: '#7ACDF2',
        alignItems: 'center'
    },
    images:{
        resizeMode: 'contain',
        width: 140,
        height: 140
    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: 20
    },
    feedbackContainer: {
        borderRadius: 10,
        alignSelf: 'flex-end',
        marginRight: 15,
        backgroundColor: 'rgba(245,245,245, 0.8)',
    },
    positiveFeedback: {
        fontSize: 15,
        fontFamily: 'Varela',
        color: '#175B00',
        padding: 5,
    },
    negativeFeedback: {
        fontSize: 15,
        fontFamily: 'Varela',
        color: 'red',
        padding: 5,
    }
})