import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';

export default function ImagePick({ deckImg }) {
    const [image, setImage] = useState(null);

    // const selectPicture = () => {
    //     Permissions.askAsync(Permissions.CAMERA_ROLL);
    //     const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({ aspect: 1, allowsEditing: true });
    //     setImage({ image: uri })
    // }

    const takePicture = async () => {
        await Permissions.askAsync(Permissions.CAMERA);
        const { cancelled, uri } = await ImagePicker.launchCameraAsync({ allowsEditing: true });
        setImage({ image: uri })
    }

    return(
        <TouchableOpacity onPress={takePicture}>
            <Image style={styles.deckImg} source={defaultImages[deckImg] || animalImages[deckImg] || fruitsAndVegImages[deckImg] || coloursImages[deckImg]} />
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