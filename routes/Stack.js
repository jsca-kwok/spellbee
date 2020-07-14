import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import Home from '../screens/Home';
import Decks from '../screens/Decks';
import Play from '../screens/Play';

// configure screens in stack
const screens = {
    Home: {
        screen: Home,
        navigationOptions: {
            title: 'Play Game',
        }
    },
    Decks: {
        screen: Decks,
        navigationOptions: {
            title: 'Vocabulary Decks',
        }
    },
    Play: {
        screen: Play,
        navigationOptions: {
            title: 'Play',
        }
    }
}

const Stack = createStackNavigator(screens, {
    defaultNavigationOptions: {
        headerTintColor: '#444',
        headerStyle: { backgroundColor: '#eee' }
    }
});

export default createAppContainer(Stack);
