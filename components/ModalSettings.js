import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av';
import { globalStyles } from '../styles/global';

export default function ModalSettings({ musicStatus, toggleMusic, setSettingsModalOpen, soundEffectsStatus, setSoundEffectsStatus, newRate, newPitch, voiceRate, voicePitch }) {

    // play sound effect
    const playSound = async() => {
        const correctFX = new Audio.Sound();
        await correctFX.loadAsync(
            require('../assets/sounds/correct.wav')
        );
        correctFX.replayAsync();
    }

    return(
        <View style={styles.pageContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.settingText}>Game Settings</Text>
            </View>
            <View style={styles.allSettingsContainer}>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Background Music</Text>
                    {
                        !musicStatus ? <Icon size={40} name='ios-volume-mute' type='ionicon' color='#F2822D' onPress={() => {toggleMusic(musicStatus)}} />
                        : <Icon size={40} name='ios-musical-notes' type='ionicon' color='#F2822D' onPress={() => {toggleMusic(musicStatus)}} />
                    }
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Sound Effects</Text>
                    {
                        !soundEffectsStatus ? <Icon size={40} name='ios-volume-mute' type='ionicon' color='#F2822D' 
                            onPress={() => {
                                setSoundEffectsStatus(true);
                                playSound();
                            }}/>
                        : <Icon size={40} name='ios-musical-notes' type='ionicon' color='#F2822D' onPress={() => {setSoundEffectsStatus(false)}} />
                    }
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Voice Pitch</Text>
                    <Slider 
                        style={{width: 100, height: 40}} 
                        maximumValue={2} 
                        minimumTrackTintColor='#F2822D' 
                        step={0.5} 
                        value={voicePitch}
                        onSlidingComplete={(value) => {newPitch(value)}}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Voice Rate</Text>
                    <Slider 
                        style={{width: 100, height: 40}} 
                        maximumValue={1.5} 
                        minimumTrackTintColor='#F2822D' 
                        step={0.5} 
                        value={voiceRate}
                        onSlidingComplete={async(value) => {newRate(value)}}/>
                </View>
            </View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity  
                    style={styles.button}
                    onPress={() => setSettingsModalOpen(false)}
                >
                    <Text style={globalStyles.text}>SAVE</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => setSettingsModalOpen(false)}
                >
                    <Text style={globalStyles.text}>CANCEL</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#F2E155',
    },
    titleContainer: {
        backgroundColor: '#F2EF9A',
        justifyContent: 'center',
        textAlign: 'center',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
        width: 240,
        height: 50,
        paddingHorizontal: 15,
        marginTop: 50,
        position: 'absolute',
        right: -10
    },
    allSettingsContainer: {
        marginTop: 120
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        marginHorizontal: 50
    },
    settingText: {
        fontSize: 20,
        fontFamily: 'Varela'
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: 15,
        flexDirection: 'row'
    },
    button: {
        paddingVertical: 15,
        marginBottom: 15,
        width: 120,
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