import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import defaultImages from '../assets/images/defaultImages';
import animalImages from '../assets/images/animals/animalImages';
import coloursImages from '../assets/images/colours/coloursImages';
import fruitsAndVegImages from '../assets/images/fruitsAndVeg/fruitsAndVegImages';

export default function ImagePick({ defaultWordImg, index, addImage, changeImage, currentWordImg }) {
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
        if (addImage) {
            addImage(index, uri);
        } else {
            changeImage(index, uri);
        }
    }

    return(
        <TouchableOpacity onPress={selectPicture}>
            {/* set image based on condition, use default if none are selected. invoke this function right away */}
            {
                (() => {
                    if (wordImg && wordImg.slice(0,4) === 'file') {
                    return <Image style={styles.wordImg} source={{uri: wordImg}} />
                    } else if (currentWordImg && currentWordImg.slice(0,4) === 'file') {
                        return <Image style={styles.wordImg} source={{uri: currentWordImg}} />
                    } else {
                        return <Image style={styles.wordImg} source={animalImages[currentWordImg] || coloursImages[currentWordImg] || fruitsAndVegImages[currentWordImg] || defaultImages[defaultWordImg]} />
                    }
                })()
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wordImg: {
        width: wp('15%'),
        height: hp('5%'),
        marginHorizontal: wp('5%'),
        flex: 1,
        overflow: 'hidden',
        borderRadius: 10
    }
})