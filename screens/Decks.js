import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';
import ModalForm from '../components/ModalForm';

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState('');

    // seed vocab decks
    useEffect(() => {getDecks()}, []);
    getDecks = () => {
        axios.get('http://localhost:8080/vocabulary')
        .then(res => setDecks(res.data))
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
                    <TouchableOpacity onPress={() => navigation.navigate('Play', item)}>
                        <Deck>
                            <Text style={globalStyles.text}>{item.deck}</Text>
                        </Deck>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}
