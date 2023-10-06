import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, IconButton} from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Index from '../../../views/Tenants/Tenants';
import NewTenant from '../../../views/Tenants/NewTenant';
import DetailsTenants from '../../../views/Tenants/DetailsTenant';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const TenantStack = ({navigation}) => {
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
        name="tenants"
        options={{
          title: 'Inquilinos',
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
        component={Index}
      />

      <Stack.Screen
        name="newtenant"
        options={{
          title: 'Formulario de inquilinos',
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
        component={NewTenant}
      />

      <Stack.Screen
        name="detailsTenants"
        options={{
          title: 'Detalles del inquilino',
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
        component={DetailsTenants}
      />
    </Stack.Navigator>
  );
};

export default TenantStack;
