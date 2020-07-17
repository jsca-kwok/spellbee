import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Text, View, FlatList, TouchableOpacity, Modal, Image, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
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

    // seed vocab decks
    useEffect(() => {getDecks()}, []);
    const getDecks = () => {
        axios.get('http://localhost:8080/vocabulary')
        .then(res => setDecks(res.data))
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
            setEditStatus(!editStatus);
        })
        .catch(err => console.log(err));
    }
    
    return (
        <View style={globalStyles.container}>
            <Modal animationType='slide'visible={modalOpen}>
                {
                    // if edit button clicked and select data is ready, render ModalEdit
                    !editStatus && selectedDeckData === null ? 
                    <ModalForm setModalOpen={setModalOpen} modalStatus={modalOpen} getDecks={getDecks} editStatus={editStatus} setEditStatus={setEditStatus} setSelectedDeckData={setSelectedDeckData} /> 
                    : <ModalEdit setSelectedDeckData={setSelectedDeckData} selectedDeckData={selectedDeckData} setModalOpen={setModalOpen} modalStatus={modalOpen} getDecks={getDecks} editStatus={editStatus} setEditStatus={setEditStatus}/>
                }
            </Modal>
            <Icon name='ios-add-circle' type='ionicon' color='#F2822D' onPress={() => {setModalOpen(!modalOpen); setEditStatus(false)}} />
            <FlatList 
                data={decks}
                renderItem={({ item }) => (
                    <ScrollView>
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
                                    <Image style={globalStyles.images} source={defaultImages[item.deckImg] || animalImages[item.deckImg] || fruitsAndVegImages[item.deckImg] || coloursImages[item.deckImg]} />
                                    {
                                        // show additional options to edit and delete on longpress
                                        item.id === selectedDeck && editStatus ? 
                                        <DeckOptions 
                                            toEditDeck={selectedDeck} 
                                            confirmDeleteDeck={confirmDeleteDeck} 
                                            setSelectedDeck={setSelectedDeck}
                                            setModalOpen={setModalOpen}
                                            modalOpen={modalOpen}
                                            setEditStatus={setEditStatus}
                                            editStatus={editStatus}
                                        />
                                        : null
                                    }
                                </Deck>
                        </TouchableOpacity>
                    </ScrollView>
                )}
            />
        </View>
    );
}
