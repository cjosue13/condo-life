import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import Owners from '../../../views/Owners/Owners';
import DetailsOwner from '../../../views/Owners/DetailsOwner';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import Own from '../../../views/Menu/Own';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {IconButton} from 'react-native-paper';
import PetStack from '../Pets/PetStack';
import VehiclesStack from '../Vehicles/VehiclesStack';
import TenantStack from '../Tenants/TenantsStack';
import AuthorizateStack from '../Authorizates/AuthorizateStack';
import OwnerStack from '../Owners/OwnerStack';

const Stack = createStackNavigator();

const OwnStack = ({navigation}) => {
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
        name="menuOwner"
        options={{
          title: 'Mi filial',
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
        component={Own}
      />

      <Stack.Screen
        name="owners"
        options={{
          title: 'Propietarios',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
        component={OwnerStack}
      />

      <Stack.Screen
        name="petFilial"
        options={{
          title: 'Mascotas',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
        component={PetStack}
      />
      <Stack.Screen
        name="vehicleFilial"
        options={{
          title: 'Vehículos',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
        component={VehiclesStack}
      />
      <Stack.Screen
        name="tenantFilial"
        options={{
          title: 'Inquilinos',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
        component={TenantStack}
      />
      <Stack.Screen
        name="authorizates"
        options={{
          title: 'Autorizados',
          headerTitleAlign: 'center',
          headerShown: false,
        }}
        component={AuthorizateStack}
      />
    </Stack.Navigator>
  );
};

export default OwnStack;
