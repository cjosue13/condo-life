import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
//Stacks of navigations
import AuthorizateStack from './Authorizates/AuthorizateStack';
import BookingStack from './Bookings/BookingStack';
//import PetStack from './PetStack';
import LetterStack from './Letters/LetterStack';
import AlerstStack from './Alerts/AlertsStack';
import EntrancesStack from './Entrances/EntranceStack';
import IncidentsStack from './Incidents/IncidentsStack';
import DocumentStack from './Documents/DocumentStack';
import ContactStack from './Contacts/ContactStack';
import VotesStack from './Votes/VotesStack';
import NotificationStack from './Notifications/NotificationStack';
import OwnStack from './Own/OwnStack';
const Stack = createStackNavigator();

const Navigation = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="bookings" component={BookingStack} />

    <Stack.Screen
      name="incidents"
      options={{
        title: 'Incidencias',
      }}
      component={IncidentsStack}
    />

    <Stack.Screen
      name="letters"
      options={{
        title: 'Mensajes',
      }}
      component={LetterStack}
    />

    <Stack.Screen
      name="documents"
      options={{
        title: 'Documentos',
      }}
      component={DocumentStack}
    />
    <Stack.Screen
      name="contacts"
      options={{
        title: 'Contactos',
      }}
      component={ContactStack}
    />

    <Stack.Screen
      name="votes"
      options={{
        title: 'Votaciones',
      }}
      component={VotesStack}
    />

    <Stack.Screen
      name="alerts"
      options={{
        title: 'Alertas',
      }}
      component={AlerstStack}
    />

    <Stack.Screen
      name="summaryEntrances"
      options={{
        title: 'Ingresos',
      }}
      component={EntrancesStack}
    />

    <Stack.Screen
      name="preferences"
      options={{
        title: 'Ajustes',
      }}
      component={NotificationStack}
    />

    <Stack.Screen
      name="own"
      options={{
        title: 'Mi filial',
      }}
      component={OwnStack}
    />
  </Stack.Navigator>
);

export default Navigation;
