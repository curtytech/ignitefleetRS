import 'react-native-get-random-values';
import { ThemeProvider } from 'styled-components/native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

import theme from './src/theme';

import { SignIn } from './src/screens/SignIn';
import { Loading } from './src/components/Loading';
import { StatusBar } from 'react-native';

import { AppProvider, RealmProvider, UserProvider } from '@realm/react';
import { REALM_APP_DB } from '@env';
import { Routes } from './src/routes';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function App() {

  const [fontsLoaded] = useFonts({
    Roboto_400Regular,
    Roboto_700Bold
  })

  if (!fontsLoaded) {
    return (
      <Loading />
    )
  }

  return (

    <AppProvider id={REALM_APP_DB}>
      <ThemeProvider theme={theme}>
      <SafeAreaProvider style={{ backgroundColor: theme.COLORS.GRAY_800 }}>
        
          <StatusBar
            barStyle="light-content"
            backgroundColor="transparent"
            translucent
          />
          <UserProvider fallback={SignIn}>
            <RealmProvider>
              <Routes />
            </RealmProvider>
          </UserProvider>
        </SafeAreaProvider>
      </ThemeProvider>
    </AppProvider>
  );
}