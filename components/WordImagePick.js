import React, { useState } from 'react';
import { TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import defaultImages from '../assets/images/defaultImages';

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
                    if (currentWordImg && currentWordImg.slice(0,4) === 'file') {
                        return <Image style={styles.wordImg} source={{uri: currentWordImg}} />
                    } else if (wordImg && wordImg.slice(0,4) === 'file') {
                        return <Image style={styles.wordImg} source={{uri: wordImg}} />
                    } else {
                        return <Image style={styles.wordImg} source={defaultImages[defaultWordImg]} />
                    }
                })()
            }
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    wordImg: {
        resizeMode: 'contain',
        width: wp('30%'),
        height: hp('3%'),
        margin: 0,
        flex: 1
    }
})