import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';
import ModalForm from '../components/ModalForm';
import ModalEdit from '../components/ModalEdit';
import DeckOptions from '../components/DeckOptions';

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState('');
    const [selectedDeck, setSelectedDeck] = useState(null);
    const [editStatus, setEditStatus] = useState(false);
    const [selectedDeckData, setSelectedDeckData] = useState(null);

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
        .then(_res => {
            getDecks();
            setSelectedDeckData(null);
            setEditStatus(!editStatus);
        })
        .catch(err => console.log(err));
    }
    
    return (
        <View style={globalStyles.container}>
            <Modal
                animationType='slide'
                visible={modalOpen}
            >
                {
                    // if edit button clicked and select data is ready, render ModalEdit
                    !editStatus && selectedDeckData === null ? 
                    <ModalForm setModalOpen={setModalOpen} modalStatus={modalOpen} getDecks={getDecks} /> 
                    : <ModalEdit setSelectedDeckData={setSelectedDeckData} selectedDeckData={selectedDeckData} setModalOpen={setModalOpen} modalStatus={modalOpen} getDecks={getDecks} editStatus={editStatus} setEditStatus={setEditStatus}/>
                }
            </Modal>
            <Icon name='ios-add-circle' type='ionicon' color='#f50' onPress={() => {setModalOpen(!modalOpen)}} />
            <FlatList 
                data={decks}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        key={item.id}
                        onPress={() => navigation.navigate('Play', item)}
                        onLongPress={() => {
                            setSelectedDeck(item.id);
                            setEditStatus(!editStatus);
                            setSelectedDeckData(item);
                        }}
                    >
                        <Deck>
                            <Text style={globalStyles.text}>{item.deck}</Text>
                            {
                                // show additional options to edit and delete on longpress
                                item.id === selectedDeck && editStatus ? 
                                <DeckOptions 
                                    toEditDeck={selectedDeck} 
                                    deleteDeck={deleteDeck} 
                                    setSelectedDeck={setSelectedDeck}
                                    setModalOpen={setModalOpen}
                                    modalOpen={modalOpen}
                                />
                                : null
                            }
                        </Deck>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
