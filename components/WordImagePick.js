import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import defaultImages from '../assets/images/defaultImages';

export default function ImagePick({ defaultWordImg, index, addImage }) {
    const [wordImg, setWordImg] = useState(null);

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
        setWordImg(uri);
        addImage(index, uri);
    }

    return(
        <TouchableOpacity onPress={selectPicture}>
            {/* set deckImage, use default if none are selected */}
            {
                wordImg && wordImg.slice(0,4) === 'file' ? <Image style={styles.deckImg} source={{uri: wordImg}} />
                : <Image style={styles.deckImg} source={defaultImages[defaultWordImg]} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    deckImg: {
        resizeMode: 'contain',
        width: 100,
        height: 50,
        margin: 0,
        flex: 1
    }
})