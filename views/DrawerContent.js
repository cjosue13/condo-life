/* eslint-disable react-native/no-raw-text */
import React, {useContext, useEffect, useState} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Title, Caption, Drawer, IconButton, Avatar} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AuthContext from '../context/autentication/authContext';
import {MIX_AWS_URL} from '../Config/environment';
import {havePermissions} from '../utils/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {configFonts, theme} from '../styles/global';
import Loading from '../components/ui/partials/Loading';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../styles/colors';
import FontAwesome from 'react-native-vector-icons/FontAwesome5';
import ProfileContext from '../context/profile/profileContext';

const DrawerContent = ({navigation}) => {
  const authContext = useContext(AuthContext);
  const {signOut, selectedAccount, selectedFilial, user} = authContext;
  const profileContext = useContext(ProfileContext);
  const {profile} = profileContext;
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      logOut();
    }
  }, [loading]);

  const logOut = async () => {
    try {
      await signOut();
    } catch (error) {
      //console.log(error);
    }
    setLoading(false);
  };

  return (
    <View style={styles.mainContainer}>
      <DrawerContentScrollView {...navigation} theme={theme}>
        <View style={styles.topContainer}>
          {!havePermissions(['voter'], user.roles) && (
            <IconButton
              icon={({size, color}) => (
                <MaterialCommunityIcons
                  size={size}
                  color={color}
                  name="account-edit"
                />
              )}
              size={RFValue(20)}
              color={colors.primary}
              onPress={() => navigation.navigate('profile')}
            />
          )}
        </View>
        <View style={styles.imageContainer}>
          <Avatar.Image
            size={RFValue(60)}
            source={
              selectedAccount?.image
                ? {uri: MIX_AWS_URL + selectedAccount.image}
                : require('../assets/images/Profile.png')
            }
          />
        </View>
        <View style={styles.bottomContainer}>
          <Title style={styles.title}>Bienvenido</Title>
          <Caption style={styles.caption}>
            {`${profile?.name} ${profile?.lastname}`}
          </Caption>
          <Title style={styles.title}>Cuenta seleccionada</Title>
          <Caption style={styles.caption}>
            {selectedFilial != null
              ? `${selectedFilial.name} - ${selectedAccount.name} `
              : null}
          </Caption>

          {/* <Caption style={styles.caption}>LOT-01</Caption> */}
        </View>
      </DrawerContentScrollView>
      <Drawer.Section
        style={{backgroundColor: colors.primary, bottom: RFValue(-5)}}>
        <DrawerItem
          icon={({size}) => (
            <MaterialCommunityIcons
              name="logout"
              color={colors.accent}
              size={RFValue(size)}
            />
          )}
          label="Cerrar sesión"
          labelStyle={styles.label}
          onPress={() => {
            setLoading(true);
          }}
        />
      </Drawer.Section>

      <Loading isVisible={loading} text="Cerrando sesión." />
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  bottomContainer: {margin: '5%'},
  caption: {
    color: colors.black,
    fontSize: RFValue(14),
    lineHeight: RFValue(14),
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    margin: '5%',
  },
  label: {
    color: colors.accent,
    fontSize: RFValue(12),
  },
  mainContainer: {
    backgroundColor: colors.accent,
    flex: 1,
    margin: 0,
  },
  title: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 3,
  },
  topContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },
});
