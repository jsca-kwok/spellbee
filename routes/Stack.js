import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import SignIn from '../screens/SignIn';
import Home from '../screens/Home';
import Decks from '../screens/Decks';
import Play from '../screens/Play';

// configure screens in stack
const screens = {
    SignIn: {
        screen: SignIn,
        navigationOptions: {
            title: 'SpellBee'
        }
    },
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'SpellBee'
        }
    },
    Decks: {
        screen: Decks,
        navigationOptions: {
            title: 'Vocabulary Decks'
        }
    },
    Play: {
        screen: Play,
        navigationOptions: {
            title: 'Play'
        }
    }
}

const Stack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle: { backgroundColor: '#f5f5f5' }
    }
});

export default createAppContainer(Stack);
