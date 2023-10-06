import React from 'react';
//imports screens drawers stacks
import PetStack from './Pets/PetStack';
import OwnerStack from './Owners/OwnerStack';
import TenantStack from './Tenants/TenantsStack';
import VehicleStack from './Vehicles/VehiclesStack';
import VotesStack from './Votes/VotesStack';
import ProfileStack from './Profile/ProfileStack';
//tabs menu
import Navigation from './Navigation';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DrawerContent from '../../views/DrawerContent';
import authContext from '../../context/autentication/authContext';
import {havePermissions} from '../../utils/auth';
import {useContext} from 'react';
import {theme} from '../../styles/global';
import EntranceStack from './Entrances/EntranceStack';
import NotificationStack from './Notifications/NotificationStack';

const Drawer = createDrawerNavigator();
const DrawerNavigation = () => {
  const auth = useContext(authContext);
  const {user} = auth;
  return (
    <Drawer.Navigator
      drawerStyle={{backgroundColor: theme.colors.primary}}
      drawerContent={props => <DrawerContent {...props} />}>
      {!havePermissions(['voter'], user.roles) ? (
        <>
          <Drawer.Screen name="tabs" component={Navigation} />
          <Drawer.Screen name="profile" component={ProfileStack} />
        </>
      ) : (
        <>
          <Drawer.Screen name="votes" component={VotesStack} />
        </>
      )}
    </Drawer.Navigator>
  );
};

export default DrawerNavigation;
