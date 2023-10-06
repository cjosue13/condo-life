/* eslint-disable react-native/sort-styles */
/* eslint-disable react/prop-types */
import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

//Screens
import Index from '../../../views/Bookings/Index';
import SlotList from '../../../views/Bookings/SlotList';
import BookableAreasList from '../../../views/Bookings/BookableAreaList';
import BookableArea from '../../../views/Bookings/BookableArea';
import PreviewBooking from '../../../views/Bookings/PreviewBooking';
import CalendarBooking from '../../../views/Bookings/Calendar';
import Guest from '../../../views/Bookings/Guest';
import History from '../../../views/Bookings/History';
import MenuButton from '../../ui/partials/MenuButton';
//import {MenuProvider} from 'react-native-popup-menu' ;
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import globalStyles, {configFonts, theme} from '../../../styles/global';
import DetailBooking from '../../../views/Bookings/DetailBooking';
import Menu from '../../../views/Menu/Menu';
import {RFValue} from 'react-native-responsive-fontsize';
import {IconButton} from 'react-native-paper';
import colors from '../../../styles/colors';
import DetailArea from '../../../views/Bookings/DetailArea';

const Stack = createStackNavigator();

const BookingStack = ({navigation, route}) => {
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
        name="menu"
        options={{
          title: 'Menú de inicio',
          headerTitleAlign: 'center',
          headerLeft: () => (
            <IconButton
              size={RFValue(25)}
              color={colors.white}
              onPress={() => navigation.openDrawer()}
              icon={({size, color}) => (
                <Ionicons
                  name="ios-menu"
                  size={size}
                  color={color}
                  backgroundColor={theme.colors.primary}
                />
              )}
            />
          ),
          headerRight: () => <MenuButton />,
        }}
        component={Menu}
      />
      <Stack.Screen
        name="bookings"
        options={{
          title: 'Reservas',
          headerTitleAlign: 'center',

          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              {/*<IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() => navigation.navigate('historyBooking')}
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
        name="slots"
        options={{
          title: 'Horarios disponibles',
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
        component={SlotList}
      />

      <Stack.Screen
        name="bookableAreasOwner"
        options={{
          title: 'Áreas reservables',
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
        component={BookableAreasList}
      />

      <Stack.Screen
        name="detailArea"
        options={{
          title: 'Área reservable',
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
        component={DetailArea}
      />

      <Stack.Screen
        name="bookableAreasDetailOwner"
        options={{
          headerTitleAlign: 'center',
        }}
        component={BookableArea}
      />

      <Stack.Screen
        name="previewBookingOwner"
        options={{
          title: 'Detalles',
          headerTitleAlign: 'center',
          headerRight: () => (
            <View style={globalStyles.rowDirection}>
              <IconButton
                size={RFValue(25)}
                color={colors.white}
                onPress={() =>
                  navigation.navigate('guestOwner', {create: false})
                }
                icon={({size, color}) => (
                  <MaterialCommunityIcons
                    name="account-multiple-plus"
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
        component={PreviewBooking}
      />

      <Stack.Screen
        name="calendarBookingOwner"
        options={{
          title: 'Calendario',
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
        component={CalendarBooking}
      />

      <Stack.Screen
        name="BookingOwner"
        options={{
          title: 'Detalles',
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
        component={DetailBooking}
      />

      <Stack.Screen
        name="guestOwner"
        options={{
          title: 'Invitados',
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
        component={Guest}
      />

      <Stack.Screen
        name="historyBooking"
        options={{
          title: 'Historial',
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
        component={History}
      />
    </Stack.Navigator>
  );
};

export default BookingStack;
