import React, {useState} from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import Navigator from './routes/Stack';

const getFonts = () => {
  return Font.loadAsync({
    'Varela': require('./assets/fonts/VarelaRound-Regular.ttf')
  })
}

export default function App() {
  const [ fontsLoaded, setFontsLoaded ] = useState(false);

  if (fontsLoaded) {
    return (
      <Navigator />
    );
  } else {
    return (
      <AppLoading startAsync={getFonts} onFinish={() => setFontsLoaded(true)} />
    )
  }
}

