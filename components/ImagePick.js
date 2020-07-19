import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';

export default function ImagePick({ defaultDeckImg, deckImg, setDeckImg }) {

    const selectPicture = async() => {
        // confirm permission before opening gallery
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({ aspect: 1, allowsEditing: true });
        if (cancelled) {
            Alert.alert('Oops!', 'Requires access to gallery to choose your own image', [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ])
        }
        setDeckImg(uri);
    }

    // const takePicture = async() => {
    //     await Permissions.askAsync(Permissions.CAMERA);
    //     const { cancelled, uri } = await ImagePicker.launchCameraAsync({ allowsEditing: true });
    //     if (!cancelled) {
    //         setImage({ image: uri });
    //     }
    // }

    return(
        <TouchableOpacity onPress={selectPicture}>
            {/* set deckImage, use default if none are selected */}
            {
                deckImg && deckImg.slice(0,4) === 'file' ? <Image style={styles.deckImg} source={{uri: deckImg}} />
                : <Image style={styles.deckImg} source={defaultImages[defaultDeckImg] || animalImages[defaultDeckImg] || fruitsAndVegImages[defaultDeckImg] || coloursImages[defaultDeckImg]} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    deckImg: {
        resizeMode: 'contain',
        width: 100,
        margin: 0,
        flex: 1
    }
})