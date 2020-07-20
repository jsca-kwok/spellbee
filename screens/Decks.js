import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, View, FlatList, TouchableOpacity, Modal, Image, Alert, StyleSheet, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { Audio } from 'expo-av';
import * as Animatable from 'react-native-animatable';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';
import ModalForm from '../components/ModalForm';
import ModalEdit from '../components/ModalEdit';
import DeckOptions from '../components/DeckOptions';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState('');
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const [selectedDeckData, setSelectedDeckData] = useState(null);
    const [musicStatus, setMusicStatus] = useState(false);
    const [starCount, setStarCount] = useState(0);
    const [searchedDecks, setSearchedDecks] = useState('');

    // seed vocab decks
    useEffect(() => {getDecks()}, []);
    const getDecks = () => {
        axios.get('http://localhost:8080/vocabulary')
        .then(res => {setDecks(res.data); setSearchedDecks(res.data)})
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

    // background music
    // const backgroundMusic = new Audio.Sound();
    // const playMusic = async(status) => {
    //     setMusicStatus(status);
    //     console.log(musicStatus);
    //     if (status === true) {
    //         await backgroundMusic.loadAsync(
    //             require('../assets/sounds/calimba.mp3')
    //         );
    //         backgroundMusic.setVolumeAsync(0.3);
    //         backgroundMusic.setIsLoopingAsync(true);
    //         backgroundMusic.playAsync();
    //     } else {
    //         await backgroundMusic.loadAsync(
    //             require('../assets/sounds/calimba.mp3')
    //         );
    //         backgroundMusic.stopAsync();
    //     }
    // }

    // search for vocab deck
    const searchDeck = (deck) => {
        // show all decks if search bar is empty
        if (deck === '') {
            setSearchedDecks(decks);
        } else {
            // show deck that contains the search value
            const searchedDeck = decks.filter(item => item.deck.toLowerCase().includes(deck.toLowerCase())).pop();
            searchedDeck ? setSearchedDecks([searchedDeck]) : null;
        }
    }
    
    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={styles.pageContainer}>
            <Modal animationType='slide'visible={modalOpen}>
                {
                    // if edit button clicked and select data is ready, render ModalEdit
                    !editStatus && selectedDeckData === null ? 
                    <ModalForm setModalOpen={setModalOpen} getDecks={getDecks} setEditStatus={setEditStatus} setSelectedDeckData={setSelectedDeckData} /> 
                    : <ModalEdit setSelectedDeckData={setSelectedDeckData} selectedDeckData={selectedDeckData} setModalOpen={setModalOpen} getDecks={getDecks} setEditStatus={setEditStatus}/>
                }
            </Modal>
            <View style={styles.iconContainer}>
                <Icon style={styles.addIcon} name='ios-add-circle' type='ionicon' color='#F2822D' onPress={() => {setModalOpen(!modalOpen); setEditStatus(false)}} />
                <TextInput style={styles.searchInput} placeholder='Search' onChangeText={(text) => searchDeck(text)} />
                {/* <Icon style={styles.musicIcon} name='ios-musical-notes' type='ionicon' color='#F2822D' onPress={() => {playMusic(!musicStatus)}}/> */}
            </View>
            <Animatable.View animation='bounceIn'>
                <FlatList   
                    showsVerticalScrollIndicator={false} 
                    numColumns={2}
                    data={searchedDecks}
                    renderItem={({ item }) => (
                        <TouchableOpacity 
                            key={item.id}
                            onPress={() => navigation.navigate('Play', item)}
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
        backgroundColor: '#F2E155',
        paddingTop: 50
    },
    iconContainer: {
        paddingBottom: 15,
        flexDirection: 'row',
        alignItems: 'center'
    },
    searchInput: {
        padding: 10,
        marginLeft: 20,
        fontSize: 18,
        color: '#333',
        backgroundColor: 'rgba(245,245,245, 0.8)',
        borderRadius: 10,
        width: '80%',
        textAlign: 'center'
    }
    // addIcon: {
    //     marginRight: 120
    // }
})