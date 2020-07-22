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
        fontSize: 14,
        margin: 5
    },
    images: {
        resizeMode: 'contain',
        width: 100,
        height: 100,
        margin: 5
    },
    input: {
        padding: 10,
        margin: 15,
        fontSize: 20,
        color: '#333',
        backgroundColor: 'rgba(245,245,245, 0.8)',
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        elevation: 5,
    }
})