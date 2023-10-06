import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  Image,
  ImageBackground,
} from 'react-native';
import {color} from 'react-native-elements/dist/helpers';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {theme} from '../../styles/global';
import ForgetPassword from './ForgetPassword';
import LoginForm from './LoginForm';

const AuthView = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <ImageBackground
      source={require('../../assets/images/background.png')}
      style={styles.image}>
      <View style={styles.container}>
        <StatusBar
          backgroundColor={theme.colors.primary}
          barStyle="light-content"
        />
        <Image
          style={styles.logo}
          source={require('../../assets/images/vikingoz-negro.png')}
        />

        <KeyboardAwareScrollView>
          {isLogin ? (
            <LoginForm setIsLogin={setIsLogin} />
          ) : (
            <ForgetPassword setIsLogin={setIsLogin} />
          )}
        </KeyboardAwareScrollView>
      </View>
    </ImageBackground>
  );
};

export default AuthView;

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.transparent,
  },
  image: {
    alignContent: 'center',
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  logo: {
    height: '20%',
    marginVertical: '2.5%',
    resizeMode: 'contain',
    width: '100%',
  },
});
