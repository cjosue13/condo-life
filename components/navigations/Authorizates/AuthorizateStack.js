import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, IconButton} from 'react-native-paper';
import Index from '../../../views/Authorizates/Index';
import NewAuthorizate from '../../../views/Authorizates/NewAuthorizate';
import DetailsAuthorizate from '../../../views/Authorizates/DetailsAutorizate';
import PreviousAuthorizate from '../../../views/Authorizates/Previous';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';

const Stack = createStackNavigator();

const AuthorizateStack = ({navigation, route}) => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: colors.secondary,
        },
        headerTintColor: colors.header,
        headerTitleStyle: {
          fontFamily: configFonts.default.medium.fontFamily,
          fontWeight: Platform.select({ios: 'bold', android: undefined}),
          fontSize: RFValue(12),
        },
        headerBackTitleVisible: false,
      }}>
      <Stack.Screen
        name="authorizates"
        options={{
          title: 'Autorizados',
          headerTitleAlign: 'center',
          tabStyle: {backgroundColor: colors.primary},

          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {/*<IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('previousAuthorizatesOwner')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="history"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
                /> */}
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('menu')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="home-circle"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
              />
            </View>
          ),
        }}
        component={Index}
      />

      <Stack.Screen
        name="newAuthorizate"
        options={{
          title: 'Nuevo Autorizado',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('menu')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="home-circle"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
              />
            </View>
          ),
        }}
        component={NewAuthorizate}
      />

      <Stack.Screen
        name="detailsAuthorizate"
        options={{
          title: 'Detalles De Autorizados',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('menu')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="home-circle"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
              />
            </View>
          ),
        }}
        component={DetailsAuthorizate}
      />

      <Stack.Screen
        name="previousAuthorizatesOwner"
        options={{
          title: 'Anteriores',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('menu')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="home-circle"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
              />
            </View>
          ),
        }}
        component={PreviousAuthorizate}
      />
    </Stack.Navigator>
  );
};

export default AuthorizateStack;
