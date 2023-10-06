import 'react-native-gesture-handler';
import React from 'react';

import {Provider as PaperProvider} from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';

//Context  state
import AuthState from './context/autentication/authState';
import EntranceState from './context/entrance/entranceState';
import IncidentState from './context/incidents/IncidentState';
import PetsState from './context/pets/petsState';
import BookingsState from './context/bookings/bookingsState';
import ContactsState from './context/contacts/contactsState';
import OwnersState from './context/owners/ownersState';
import TenantsState from './context/tenants/tenantsState';
import VehiclesState from './context/vehicles/vehiclesState';
import AutorizationsState from './context/autorizations/autorizationsState';
import DocumentsState from './context/documents/documentsState';
import AlertsState from './context/alerts/alertsState';
import VotingsState from './context/votings/votingsState';
import LettersState from './context/letters/lettersState';
import NotificationState from './context/notifications/notificationsState';

import Home from './views/Home';
import ProfileState from './context/profile/profileState';
import {Platform} from 'react-native';
import {theme} from './styles/global';

const clear = async () => {
  const asyncStorageKeys = await AsyncStorage.getAllKeys();
  if (asyncStorageKeys.length > 0) {
    if (Platform.OS === 'android') {
      await AsyncStorage.clear();
    }
    if (Platform.OS === 'ios') {
      await AsyncStorage.multiRemove(asyncStorageKeys);
    }
  }
};

const App = () => {
  //clear();
  return (
    <AuthState>
      <ProfileState>
        <EntranceState>
          <IncidentState>
            <PetsState>
              <BookingsState>
                <ContactsState>
                  <OwnersState>
                    <TenantsState>
                      <VehiclesState>
                        <AutorizationsState>
                          <DocumentsState>
                            <AlertsState>
                              <VotingsState>
                                <LettersState>
                                  <NotificationState>
                                    <PaperProvider theme={theme}>
                                      <Home />
                                    </PaperProvider>
                                  </NotificationState>
                                </LettersState>
                              </VotingsState>
                            </AlertsState>
                          </DocumentsState>
                        </AutorizationsState>
                      </VehiclesState>
                    </TenantsState>
                  </OwnersState>
                </ContactsState>
              </BookingsState>
            </PetsState>
          </IncidentState>
        </EntranceState>
      </ProfileState>
    </AuthState>
  );
};

export default App;
