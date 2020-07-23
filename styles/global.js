import { StyleSheet } from 'react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

export const globalStyles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        alignItems: 'center',
        backgroundColor: '#F2E155'
    },
    text: {
        fontFamily: 'Varela',
        fontSize: wp('5%'),
        margin: hp('1%')
    },
    images: {
        resizeMode: 'contain',
        width: wp('25%'),
        height: hp('15%'),
    },
    input: {
        padding: hp('2%'),
        margin: hp('3%'),
        fontSize: hp('3%'),
        color: '#333',
        backgroundColor: 'rgba(245,245,245, 0.8)',
        borderRadius: 10,
        width: '90%',
        textAlign: 'center',
        shadowColor: 'black',
        shadowRadius: 2,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25
    }
})