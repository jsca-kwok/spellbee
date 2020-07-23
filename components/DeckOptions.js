import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { globalStyles } from '../styles/global';

export default function DeckOptions({ toEditDeck, confirmDeleteDeck, setSelectedDeckData, setModalOpen, modalOpen, setEditStatus, editStatus }) {
    return(
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setModalOpen(!modalOpen)}>
                <Text style={globalStyles.text}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={(_e) => confirmDeleteDeck(toEditDeck)}>
                <Text style={globalStyles.text}>Delete</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
                setSelectedDeckData(null);
                setEditStatus(false);
            }}>
                <Text style={globalStyles.text}>Cancel</Text>
            </TouchableOpacity>  
        </View>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    button: {
        paddingVertical: hp('2%'),
        marginBottom: hp('2%'),
        width: wp('30%'),
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        alignItems: 'center'
    }
})