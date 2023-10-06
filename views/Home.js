import React, {useEffect, useContext} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthContext from '../context/autentication/authContext';
import DrawerNavigation from '../components/navigations/DrawerNavigation';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/ui/partials/Loading';
import AuthView from './Auth/AuthView';
import {isAuth} from '../utils/auth';
import {Platform} from 'react-native';
import FlashMessage from 'react-native-flash-message';

const Home = () => {
  const authContext = useContext(AuthContext);

  const {token, loading, notLoading, getUser} = authContext;

  useEffect(async () => {
    if (!token) {
      const tokenAuth = await AsyncStorage.getItem('token');

      const auth = await isAuth();

      if (auth && tokenAuth) {
        await getUser();
      } else {
        const asyncStorageKeys = await AsyncStorage.getAllKeys();
        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === 'android') {
            await AsyncStorage.clear();
          }
          if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
          }
        }
        notLoading();
      }
    }
  }, []);

  if (loading) {
    return (
      <>
        <Loading isVisible={loading} text="Iniciando" />
      </>
    );
  }

  return (
    <>
      {token !== null ? (
        <NavigationContainer>
          <DrawerNavigation />
        </NavigationContainer>
      ) : (
        <AuthView />
      )}
      <FlashMessage position="top" />
    </>
  );
};

export default Home;
