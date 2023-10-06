import React, {useEffect, useState} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, IconButton} from 'react-native-paper';
import Incidents from '../../../views/Incidents/Incidents';
import NewIncident from '../../../views/Incidents/NewIncident';
import DetailsIncidents from '../../../views/Incidents/DetailsIncidents';
import FormComment from '../../ui/Comments/owner/Form';
import Ionicons from 'react-native-vector-icons/Ionicons';

import globalStyles, {configFonts, theme} from '../../../styles/global';
import {Platform, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Stack = createStackNavigator();

const IncidentsStack = ({navigation}) => {
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
        name="incidents"
        options={{
          title: 'Incidencias',
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
        component={Incidents}
      />

      <Stack.Screen
        name="newIncident"
        options={{
          title: 'Incidencias',
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
        component={NewIncident}
      />

      <Stack.Screen
        name="detailsIncident"
        options={{
          title: 'Detalles de incidencia',
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
        component={DetailsIncidents}
      />

      <Stack.Screen
        name="add-review-incident"
        options={{
          title: 'Nuevo comentario',
          headerTitleAlign: 'center',
        }}
        component={FormComment}
      />
    </Stack.Navigator>
  );
};

export default IncidentsStack;
