import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center'
    },
    text: {
        fontFamily: 'Varela',
        fontSize: 18, 
    },
    images: {
        resizeMode: 'contain',
        width: 150,
        height: 150
    }
})