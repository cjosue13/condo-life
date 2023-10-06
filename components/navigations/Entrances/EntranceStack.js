import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {View, StyleSheet, Platform, TouchableOpacity} from 'react-native';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import {DefaultTheme, IconButton} from 'react-native-paper';
import Entrances from '../../../views/Entrances/Entrances';
import DetailsEntrances from '../../../views/Entrances/DetailsEntrances';
import Ionicons from 'react-native-vector-icons/Ionicons';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import Summary from '../../../views/Entrances/Summary';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const EntranceStack = ({navigation}) => {
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
        name="entrances"
        options={{
          title: 'Ingresos',
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
        component={Entrances}
      />
      <Stack.Screen
        name="summaryEntrances"
        options={{
          title: 'Resumen',
          headerTitleAlign: 'center',

          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('entrances')}
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="car-info"
                    size={size}
                    color={color}
                    backgroundColor={theme.colors.primary}
                  />
                )}
              />
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
        component={Summary}
      />

      <Stack.Screen
        name="detailsEntrances"
        options={{
          title: 'Detalles de ingreso',
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
        component={DetailsEntrances}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  viewHeader: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  viewHeaderAwesome: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    margin: 10,
  },
});

export default EntranceStack;
