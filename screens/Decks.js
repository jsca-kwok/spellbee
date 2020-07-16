import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';
import ModalForm from '../components/ModalForm';
import DeckOptions from '../components/DeckOptions';

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState('');
    const [selectedDeck, setSelectedDeck] = useState(null);

    // seed vocab decks
    useEffect(() => {getDecks()}, []);
    const getDecks = () => {
        axios.get('http://localhost:8080/vocabulary')
        .then(res => setDecks(res.data))
        .catch(err => console.log(err));
    }

    // delete vocab deck
    const deleteDeck = (idToDelete) => {
        axios.delete('http://localhost:8080/vocabulary', {
            data: { id: `${idToDelete}` }
        })
        .then(_res => getDecks())
        .catch(err => console.log(err));
    }
    
    return (
        <View style={globalStyles.container}>
            <Modal
                animationType='slide'
                visible={modalOpen}
            >
                <ModalForm setModalOpen={setModalOpen} modalStatus={modalOpen} getDecks={getDecks}/>
            </Modal>
            <Icon name='ios-add-circle' type='ionicon' color='#f50' onPress={() => {setModalOpen(!modalOpen)}} />
            <FlatList 
                data={decks}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        onPress={() => navigation.navigate('Play', item)}
                        onLongPress={() => setSelectedDeck(item.id)}
                    >
                        <Deck>
                            <Text style={globalStyles.text}>{item.deck}</Text>
                            {
                                // show additional options to edit and delete on longpress
                                item.id === selectedDeck ? 
                                <DeckOptions toEditDeck={selectedDeck} deleteDeck={deleteDeck} setSelectedDeck={setSelectedDeck}/>
                                : null
                            }
                        </Deck>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
