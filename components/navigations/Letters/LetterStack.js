import React from 'react';
import {DefaultTheme, IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
//import {createDrawerNavigator} from '@react-navigation/drawer';
import {createStackNavigator} from '@react-navigation/stack';
import Letters from '../../../views/Letter/Letter';
import NewLetter from '../../../views/Letter/NewLetter';
import ListItem from '../../../views/Letter/ListItem';
import DetailsLetter from '../../../views/Letter/DetailsLetter';
import ResponseLetter from '../../../views/Letter/ResponseLetter';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const LetterStack = ({navigation}) => {
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
        name="letters"
        options={{
          title: 'Mensajes',
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
        component={Letters}
      />

      <Stack.Screen
        name="newLetter"
        options={{
          title: 'Nuevo Comunicado',
          headerTitleAlign: 'center',
        }}
        component={NewLetter}
      />

      <Stack.Screen
        name="lettersShow"
        options={{
          title: '',
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
        component={ListItem}
      />
      <Stack.Screen
        name="detailsLetter"
        options={{
          title: 'Comunicado',
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
        component={DetailsLetter}
      />
      <Stack.Screen
        name="responseLetter"
        options={{
          title: 'Chat',
          headerTitleAlign: 'center',
        }}
        component={ResponseLetter}
      />
    </Stack.Navigator>
  );
};

export default LetterStack;
