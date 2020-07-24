import React, { useState } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, TextInput, Image, KeyboardAvoidingView, Text } from 'react-native';
import * as Speech from 'expo-speech';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalStyles } from '../styles/global';
import SpellItem from '../components/SpellItem';
import RoundEnd from '../components/RoundEnd';
import Tutorial from '../components/Tutorial';
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
    const [itemsLeft, setItemsLeft] = useState(6);
    const [showPositiveFeedback, setShowPositiveFeedback] = useState(false);
    const [showNegativeFeedback, setShowNegativeFeedback] = useState(false);
    const [hintIndex, setHintIndex] = useState(-1);
    const [showHint, setShowHint] = useState(false);
    const [hintError, setHintError] = useState(false);
    const [choosePicturePrompt, setChoosePicturePrompt] = useState(false);
    const [correct, setCorrect] = useState(0);
    const [attempts, setAttempts] = useState(0);

    // set ref to textinput
    const textInput = React.createRef();

    // set current word list in play
    const wordList = navigation.state.params.item.words;
    // randomizes word list and chooses only 6
    const randomWords = wordList.sort(() => Math.random() - 0.5).slice(0,6);
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
        setHintIndex(-1);
        setChoosePicturePrompt(false);
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
        // if no picture is chosen and user attempts to submit
        if (!spellItem) {
            setShowNegativeFeedback(false);
            setShowPositiveFeedback(false);
            setChoosePicturePrompt(true);
            textInput.current.clear();
        // correct spelling
        } else if (spellItem === input) {
            // remove word and set existing words as words in play
            deckWords.splice(takeOutIndex, 1);
            setDeckWords(deckWords);
            setSpellItem(null);
            // clear input when spelling is correct, decrease items left
            textInput.current.clear();
            // decrease items left 
            const count = itemsLeft - 1;
            setItemsLeft(count);
            // reset hints
            setHintIndex(0);
            // set attempts and correct
            const newAttemptCount = attempts + 1;
            const newCorrectCount = correct + 1;
            setAttempts(newAttemptCount);
            setCorrect(newCorrectCount);
        // incorrect spelling
        } else {
            playSound('incorrect');
            setShowNegativeFeedback(true);
            // increase attempts
            const newAttemptCount = attempts + 1;
            setAttempts(newAttemptCount);
        }
        // do not show feedback for last correct answer
        if (spellItem === input && itemsLeft !== 1) {
            setShowPositiveFeedback(true);
            setShowNegativeFeedback(false);
            playSound('correct');
        } else if (spellItem === input && itemsLeft <= 1) {
            setShowPositiveFeedback(false);
            setShowNegativeFeedback(false);
            playSound('complete');
        }
    }

    // calculate accuracy
    const calculateAccuracy = (correct, attempts) => {
        return (correct/attempts*100);
    }

    // play sound effect only if game settings have sfx toggled on
    const soundEffectsStatus = navigation.state.params.soundEffectsStatus;

    const playSound = async(sound) => {
        if (soundEffectsStatus && sound === 'correct') {
            const correctFX = new Audio.Sound();
            await correctFX.loadAsync(
                require('../assets/sounds/correct.wav')
            );
            correctFX.replayAsync();
        } else if (soundEffectsStatus && sound === 'incorrect') {
            const incorrectFX = new Audio.Sound();
            await incorrectFX.loadAsync(
                require('../assets/sounds/incorrect.wav')
            )
            incorrectFX.replayAsync();
        } else if (soundEffectsStatus && sound === 'complete') {
            const completeFX = new Audio.Sound();
            await completeFX.loadAsync(
                require('../assets/sounds/wand.wav')
            )
            completeFX.replayAsync();
        }
        return;
    }

    // hint
    const giveHint = () => {
        if (!spellItem) {
            setHintError(true);
            setTimeout(()=> {setHintError(false)}, 2000);
        }
        if (spellItem && hintIndex < spellItem.length) {
            setShowPositiveFeedback(false);
            setShowNegativeFeedback(false);
            setShowHint(true);
            const newHintIndex = hintIndex + 1;
            setHintIndex(newHintIndex);
            setTimeout(()=> {setShowHint(false)}, 1000);
        } else {
            setShowPositiveFeedback(false);
            setShowNegativeFeedback(false);
            setShowHint(true);
            setHintIndex(0);
            setTimeout(()=> {setShowHint(false)}, 1000);
        } 
    }

    // return to decks from result screen
    const goBack = () => {
        navigation.goBack();
    }

    // grab tutorial status
    let showTutorial = navigation.state.params.showTutorial;

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss()}}>
            <KeyboardAvoidingView style={styles.playScene} behavior='padding' keyboardVerticalOffset={55}>
                {
                    showTutorial && itemsLeft !== 0 ?
                    <View style={styles.tutorialContainer}>
                        <Animatable.View animation='zoomInLeft' delay={1000} easing='ease-in'>
                            <Tutorial tutorialMessage='Buzz! Choose a picture' />
                        </Animatable.View>
                    </View>
                    : null
                }
                <Animatable.View animation='flipInY' style={styles.imageContainer}>
                    {
                        deckWords.map(word => {
                            return (
                                <Animatable.View key={word.wordId} animation='pulse' iterationCount='infinite'>
                                    <TouchableOpacity onPress={() => {handlePress(word.word)}}>
                                        <SpellItem style={styles.spellItem}>
                                            {
                                                word.wordImg && word.wordImg.slice(0,4) === 'file' ? <Image style={styles.userImages} source={{uri: word.wordImg}} />
                                                : <Image style={styles.images} source={defaultImages[word.wordImg] || animalImages[word.word] || coloursImages[word.word] || fruitsAndVegImages[word.word]} />
                                            }
                                        </SpellItem>
                                    </TouchableOpacity>
                                </Animatable.View>
                            )
                        })
                    }
                </Animatable.View>
                {/* show hints */}
                {
                    spellItem && showHint ? <Animatable.Text animation='fadeInUp' style={styles.hintText}>{spellItem[hintIndex]}</Animatable.Text> : null
                }
                <View style={styles.hintAndFeedbackContainer}>
                    {
                        spellItem ? 
                        <Animatable.View animation='bounceInUp'>
                        <TouchableOpacity style={styles.hintButton} onPress={giveHint}>
                            <Text style={styles.hintButtonText}>?</Text>
                        </TouchableOpacity>
                        </Animatable.View>
                        : null
                    }
                    {/* show feedback on correct answer */}
                    {
                        showPositiveFeedback ? 
                        <Animatable.View animation='tada' style={styles.feedbackContainer}>
                            <Text style={styles.positiveFeedback}>{positiveFeedback[index]}</Text>
                        </Animatable.View> 
                        : null
                    }
                    {
                        showNegativeFeedback ? 
                        <Animatable.View animation='shake' style={styles.feedbackContainer}>
                            <Text style={styles.negativeFeedback}>{negativeFeedback[index]}</Text>
                        </Animatable.View>
                        : null
                    }
                    {
                        choosePicturePrompt ?
                        <Animatable.View animation='shake' style={styles.feedbackContainer}>
                        <Text style={styles.choosePicturePrompt}>Choose a picture first</Text>
                        </Animatable.View>
                        : null
                    }
                </View>
                {/* if no items are left to spell, hide input and show RoundEnd */}
                {
                    itemsLeft !== 0 ? 
                    <Animatable.View animation='bounceInUp' style={styles.inputContainer}>
                        <TextInput 
                            onSubmitEditing={(event) => handleInputChange(event)}
                            placeholder='Tap here to spell it!' 
                            autoCapitalize='none'
                            autoCompleteType='off'
                            autoCorrect={false}
                            ref={textInput}
                            style={globalStyles.input}
                        />
                    </Animatable.View>
                    : <RoundEnd goBack={goBack} calculateAccuracy={calculateAccuracy} correct={correct} attempts={attempts}/>
                }
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    playScene: {
        flex: 1,
        backgroundColor: '#7ACDF2',
        alignItems: 'center'
    },
    userImages: {
        width: wp('40%'),
        height: hp('20%'),
        margin: wp('0.5%'),
        overflow: 'hidden',
        borderRadius: 10
    },
    images:{
        resizeMode: 'contain',
        width: wp('40%'),
        height: hp('20%'),
        margin: wp('0.5%'),

    },
    imageContainer: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginVertical: hp('0.5%'),
    },
    feedbackContainer: {
        borderRadius: 10,
        backgroundColor: 'rgba(245,245,245, 0.8)'
    },
    positiveFeedback: {
        fontSize: hp('3.5%'),
        fontFamily: 'Varela',
        color: '#175B00',
        padding: hp('1.5%')
    },
    negativeFeedback: {
        fontSize: hp('3.5%'),
        fontFamily: 'Varela',
        color: 'red',
        padding: hp('1.5%')
    },
    choosePicturePrompt: {
        fontSize: hp('3.5%'),
        fontFamily: 'Varela',
        color: 'black',
        padding: hp('1.5%')
    },
    inputContainer: {
        width: '90%'
    },
    hintAndFeedbackContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%'
    },
    hintButtonText: {
        fontSize: wp('12%'),
        fontFamily: 'Varela',
        color: 'rgba(0,0,0,0.7)'
    },
    hintButton: {
        backgroundColor: 'rgba(242,239,154, 0.6)',
        width: wp('15%'),
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25
    },
    hintText: {
        fontSize: hp('40%'),
        fontFamily: 'Varela',
        color: 'rgba(0,0,0,0.7)'
    }
})