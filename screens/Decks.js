import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Text, View, FlatList, TouchableOpacity, Modal, Image, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { Audio } from 'expo-av';
import * as Speech from 'expo-speech';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';
import ModalForm from '../components/ModalForm';
import ModalEdit from '../components/ModalEdit';
import ModalSettings from '../components/ModalSettings';
import DeckOptions from '../components/DeckOptions';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';

const backgroundMusic = new Audio.Sound();

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState('');
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const [selectedDeckData, setSelectedDeckData] = useState(null);
    const [musicStatus, setMusicStatus] = useState(false);
    const [searchedDecks, setSearchedDecks] = useState('');
    const [settingsModalOpen, setSettingsModalOpen] = useState(false);
    const [soundEffectsStatus, setSoundEffectsStatus] = useState(true);
    const [voicePitch, setVoicePitch] = useState(1);
    const [voiceRate, setVoiceRate] = useState(0);
    const [isEnabled, setIsEnabled] = useState(false);

    const userId = navigation.state.params.userId;

    // seed vocab decks
    useEffect(() => {getDecks()}, []);
    const getDecks = () => {
        axios.get('http://localhost:8080/vocabulary')
        .then(res => {
            // only show decks that are default with app or user made
            const userDecks = res.data.filter(deck => deck.userId === userId || !deck.userId);
            setDecks(userDecks); 
            setSearchedDecks(userDecks);
        })
        .catch(err => console.log(err));
    }

    // confirm delete deck
    const confirmDeleteDeck = (id) => {
        Alert.alert("Careful!", "Are you sure you want to delete?", [
            {
                text: "Yes",
                onPress: () => {deleteDeck(id)}
            },
            {
                text: "No way!",
                style: "cancel"
            }
        ])
    }

    // delete vocab deck
    const deleteDeck = (idToDelete) => {
        axios.delete('http://localhost:8080/vocabulary', {
            data: { id: `${idToDelete}` }
        })
        .then(_res => {
            getDecks();
            setSelectedDeckData(null);
            setEditStatus(false);
        })
        .catch(err => console.log(err));
    }

    // toggle background music
    const toggleMusic = async(status) => {
        if (status) {
            await backgroundMusic.pauseAsync();
            await backgroundMusic.unloadAsync();
            setMusicStatus(false);
        } else {
            setMusicStatus(true);
            await backgroundMusic.loadAsync(require('../assets/sounds/calimba.mp3'));
            await backgroundMusic.replayAsync();
            await backgroundMusic.setVolumeAsync(0.3);
            await backgroundMusic.setIsLoopingAsync(true);
        }
    }

    // say word when settings are adjusted - but not on first render
    const firstRender = useRef(true);
    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false;
            return;
        }
        sayWord('Spellbee');
        }, [voicePitch, voiceRate]);
    
    // say word
    const sayWord = (word) => {
        Speech.speak(word, { pitch: voicePitch, rate: voiceRate });
    }

    // voice pitch setting
    const newPitch = (pitch) => {
        setVoicePitch(pitch);
    }

    // voice rate setting
    const newRate = (rate) => {
        setVoiceRate(rate);
    }

    // search for vocab deck
    const searchDeck = (deck) => {
        // show all decks if search bar is empty
        if (deck === '') {
            setSearchedDecks(decks);
        } else {
            // show deck that contains the search value
            const searchedDeck = decks.filter(item => item.deck.toLowerCase().includes(deck.toLowerCase()));
            searchedDeck ? setSearchedDecks(searchedDeck) : null;
        }
    }

    // toggle switch for screentime reminder
    const toggleSwitch = () => {
        setIsEnabled(!isEnabled);
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.pageContainer}>
            {/* modal for adding/editing vocab decks */}
            <Modal animationType='slide' visible={modalOpen}>
                {
                    // if edit button clicked and select data is ready, render ModalEdit
                    !editStatus && selectedDeckData === null ? 
                    <ModalForm setModalOpen={setModalOpen} getDecks={getDecks} setEditStatus={setEditStatus} setSelectedDeckData={setSelectedDeckData} userId={userId}/> 
                    : <ModalEdit setSelectedDeckData={setSelectedDeckData} selectedDeckData={selectedDeckData} setModalOpen={setModalOpen} getDecks={getDecks} setEditStatus={setEditStatus} userId={userId}/>
                }
            </Modal>
            {/* modal for game settings  */}
            <Modal animationType='slide' visible={settingsModalOpen}>
                <ModalSettings 
                    toggleMusic={toggleMusic} 
                    musicStatus={musicStatus} 
                    setMusicStatus={setMusicStatus} 
                    setSettingsModalOpen={setSettingsModalOpen} 
                    soundEffectsStatus={soundEffectsStatus} 
                    setSoundEffectsStatus={setSoundEffectsStatus} 
                    sayWord={sayWord} 
                    newRate={newRate} 
                    newPitch={newPitch}
                    voiceRate={voiceRate}
                    voicePitch={voicePitch}
                    toggleSwitch={toggleSwitch}
                    isEnabled={isEnabled}
                />
            </Modal>
            <View style={styles.iconContainer}>
                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={(text) => searchDeck(text)} />
                <Icon style={styles.addIcon} name='ios-add-circle' type='ionicon' color='#F2822D' onPress={() => {setModalOpen(!modalOpen); setEditStatus(false)}} />
                <Icon style={styles.settingsIcon} name='ios-settings' type='ionicon' color='#F2822D' onPress={() => setSettingsModalOpen(!settingsModalOpen)}/>
            </View>
            <Animatable.View animation='bounceIn'>
                <FlatList   
                    showsVerticalScrollIndicator={false} 
                    numColumns={2}
                    data={searchedDecks}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={() => navigation.navigate('Play', {item, soundEffectsStatus: soundEffectsStatus, voicePitch: voicePitch, voiceRate: voiceRate})}
                            onLongPress={() => {
                                setSelectedDeck(item.id);
                                setEditStatus(!editStatus);
                                setSelectedDeckData(item);
                        }}>
                                <Deck>
                                    <Text style={globalStyles.text}>{item.deck}</Text>
                                    {/* if the deckImg starts with 'file', use the user uploaded image - else use default */}
                                    {
                                        item.deckImg.slice(0,4) === 'file' ? <Image style={globalStyles.images} source={{uri: item.deckImg}} />
                                        : <Image style={globalStyles.images} source={defaultImages[item.deckImg] || animalImages[item.deckImg] || fruitsAndVegImages[item.deckImg] || coloursImages[item.deckImg]} />
                                    }
                                    {
                                        // show additional options to edit and delete on longpress
                                        item.id === selectedDeck && editStatus ? 
                                        <DeckOptions 
                                            toEditDeck={selectedDeck} 
                                            confirmDeleteDeck={confirmDeleteDeck} 
                                            setSelectedDeckData={setSelectedDeckData}
                                            setModalOpen={setModalOpen}
                                            modalOpen={modalOpen}
                                            setEditStatus={setEditStatus}
                                            editStatus={editStatus}
                                        /> : null
                                    }
                                </Deck>
                        </TouchableOpacity>
                    )}
                />
            </Animatable.View>
        </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F2E155'
    },
    iconContainer: {
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchInput: {
        padding: 10,
        marginRight: 20,
        fontSize: 18,
        color: '#333',
        backgroundColor: 'rgba(245,245,245, 0.8)',
        borderRadius: 10,
        width: '70%',
        textAlign: 'center'
    },
    addIcon: {
        marginRight: 10
    }
})