import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';
import defaultImages from '../assets/images/defaultImages';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export default function ImagePick({ defaultDeckImg, deckImg, setDeckImg }) {

    const selectPicture = async() => {
        // confirm permission before opening gallery
        await Permissions.askAsync(Permissions.CAMERA_ROLL);
        const { cancelled, uri } = await ImagePicker.launchImageLibraryAsync({ aspect: [4,3], quality: 1, allowsEditing: true });
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

    // take photo function - does not work on simulator
    // const takePicture = async() => {
    //     if (Constants.platform.ios) {
    //         await Permissions.askAsync(Permissions.CAMERA_ROLL);
    //         await Permissions.askAsync(Permissions.CAMERA);
    //         const { cancelled, uri } = await ImagePicker.launchCameraAsync({ allowsEditing: true });
    //         if (cancelled) {
    //             Alert.alert('Oops!', 'Requires access to camera to take your own image', [
    //                 {
    //                     text: "Got it",
    //                     style: "cancel"
    //                 }
    //             ])
    //         }
    //         setDeckImage(uri);
    //     }
    // }

    return(
        <TouchableOpacity onPress={selectPicture}>
            {/* set deckImage, use default if none are selected */}
            {
                deckImg && deckImg.slice(0,4) === 'file' ? <Image style={styles.deckImg} source={{uri: deckImg}} />
                : <Image style={styles.deckImg} source={animalImages[defaultDeckImg] || fruitsAndVegImages[defaultDeckImg] || coloursImages[defaultDeckImg] || defaultImages[defaultDeckImg]} />
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    deckImg: {
        width: wp('20%'),
        height: hp('5%'),
        marginHorizontal: wp('8%'),
        flex: 1,
        overflow: 'hidden',
        borderRadius: 10
    }
})