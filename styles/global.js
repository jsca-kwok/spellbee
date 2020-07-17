import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F2E155'
    },
    text: {
        fontFamily: 'Varela',
        fontSize: 18, 
    },
    images: {
        resizeMode: 'contain',
        width: 140,
        height: 140
    },
    input: {
        padding: 40,
        fontSize: 20,
        color: '#333'
    }
})