import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button } from 'react-native';
import { Icon } from 'react-native-elements';
import { globalStyles } from '../styles/global';
import Deck from '../components/Deck';

export default function Decks({ navigation }) {
    const [modalOpen, setModalOpen] = useState(false);
    const [decks, setDecks] = useState([
        { 
            deck: 'Animals',
            key: '1',
            words: [{
                id: 11,
                word: 'tiger',
            },
            {
                id: 12,
                word: 'lamb',
            },
            {
                id: 13,
                word: 'ostrich',
            }]
        },
        { 
            deck: 'Colours',
            key: '2',
            words: [{
                id: 21,
                word: 'blue',
            },
            {
                id: 22,
                word: 'yellow',
            },
            {
                id: 23,
                word: 'red',
            }]
        }
    ])

    return (
        <View style={globalStyles.container}>
            <Modal
                animationType='slide'
                visible={modalOpen}
            >
                <TouchableOpacity onPress={() => {setModalOpen(!modalOpen)}}>
                    <Text>SAVE</Text>
                </TouchableOpacity>
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
