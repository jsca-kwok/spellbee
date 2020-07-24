import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Switch, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import Slider from '@react-native-community/slider';
import * as Animatable from 'react-native-animatable';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Audio } from 'expo-av';
import { globalStyles } from '../styles/global';

export default function ModalSettings({ musicStatus, toggleMusic, setSettingsModalOpen, soundEffectsStatus, setSoundEffectsStatus, newRate, newPitch, voiceRate, voicePitch, toggleReminder, isReminderEnabled, showTutorial, toggleTutorial }) {

    // play sound effect during voice settings
    const playSound = async() => {
        const correctFX = new Audio.Sound();
        await correctFX.loadAsync(
            require('../assets/sounds/correct.wav')
        );
        correctFX.replayAsync();
    }

    // screen time reminder
    const screenTimeReminder = (status) => {
        if (status) {
            handle = setInterval(screenAlert, 600000);
            Alert.alert('Screen Time Reminder Enabled', 'We will remind you to rest after 10 minutes of screen time', [
                {
                    text: "Got it",
                    style: "cancel"
                }
            ]);
        }
        else {
            clearInterval(handle);
        }
    }

    const screenAlert = () => {
        Alert.alert(`Time's up!`, 'Remember to rest your eyes', [
            {
                text: "Got it",
                style: "cancel"
            }
        ])
    }

    return(
        <View style={styles.pageContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.settingTitleText}>Game Settings</Text>
            </View>
            <Animatable.View animation='zoomIn' style={styles.allSettingsContainer}>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Background Music</Text>
                    {
                        !musicStatus ? <Icon size={wp('10%')} name='ios-volume-mute' type='ionicon' color='#F2822D' onPress={() => {toggleMusic(musicStatus)}} />
                        : <Icon size={wp('10%')} name='ios-musical-notes' type='ionicon' color='#F2822D' onPress={() => {toggleMusic(musicStatus)}} />
                    }
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Sound Effects</Text>
                    {
                        !soundEffectsStatus ? <Icon size={wp('10%')} name='ios-volume-mute' type='ionicon' color='#F2822D' 
                            onPress={() => {
                                setSoundEffectsStatus(true);
                                playSound();
                            }}/>
                        : <Icon size={wp('10%')} name='ios-musical-notes' type='ionicon' color='#F2822D' onPress={() => {setSoundEffectsStatus(false)}} />
                    }
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Voice Pitch</Text>
                    <Slider 
                        style={{width: wp('30%'), height: hp('6%')}} 
                        maximumValue={2} 
                        minimumTrackTintColor='#F2822D' 
                        step={0.5} 
                        value={voicePitch}
                        onSlidingComplete={(value) => {newPitch(value)}}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Voice Rate</Text>
                    <Slider 
                        style={{width: wp('30%'), height: hp('6%')}} 
                        maximumValue={1.5} 
                        minimumTrackTintColor='#F2822D' 
                        step={0.5} 
                        value={voiceRate}
                        onSlidingComplete={async(value) => {newRate(value)}}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Screentime Watch</Text>
                    <Switch 
                        style={styles.switch}
                        trackColor={{false: '#F5F5F5', true: '#F2822D'}} 
                        ios_backgroundColor='#F5F5F5' 
                        value={isReminderEnabled} 
                        onValueChange={() => {
                            toggleReminder(); 
                            screenTimeReminder(!isReminderEnabled);
                    }}/>
                </View>
                <View style={styles.settingContainer}>
                    <Text style={styles.settingText}>Tutorial</Text>
                    <Switch 
                        style={styles.switch}
                        trackColor={{false: '#F5F5F5', true: '#F2822D'}} 
                        ios_backgroundColor='#F5F5F5' 
                        value={showTutorial} 
                        onValueChange={() => {
                            toggleTutorial(); 
                    }}/>
                </View>
            </Animatable.View>
            <View style={styles.buttonContainer}>
                <TouchableOpacity  
                    style={styles.button}
                    onPress={() => setSettingsModalOpen(false)}
                >
                    <Text style={globalStyles.text}>SAVE</Text>
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
        width: wp('75%'),
        height: hp('8%'),
        paddingHorizontal: wp('5%'),
        marginTop: hp('9%'),
        position: 'absolute',
        right: -10
    },
    allSettingsContainer: {
        marginTop: hp('25%'),
        paddingVertical: hp('4%'),
        marginHorizontal: wp('6%'),
        backgroundColor: '#F2EF9A',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
    },
    settingContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: hp('0.5%'),
        marginHorizontal: wp('6%'),
        marginBottom: hp('1%')
    },
    settingTitleText: {
        fontSize: wp('6%'),
        fontFamily: 'Varela'
    },
    settingText: {
        fontSize: wp('5.5%'),
        fontFamily: 'Varela'
    },
    buttonContainer: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: hp('5%'),
        flexDirection: 'row'
    },
    button: {
        paddingVertical: hp('2.5%'),
        marginBottom: hp('2.5%'),
        width: wp('35%'),
        backgroundColor: '#f5f5f5',
        borderRadius: 10,
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        alignItems: 'center'
    }
})