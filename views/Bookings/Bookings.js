import React, {useEffect, useState, useContext, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import AuthContext from '../../context/autentication/authContext';
import BookingsContext from '../../context/bookings/bookingsContext';
import globalStyles, {theme} from '../../styles/global';
import Item from './ListItemsBookings';
import Toast from 'react-native-easy-toast';
import {TOOGLE_ACCOUNT_MESSAGE} from '../../types';
import {measure} from 'react-native-reanimated';
import NoItems from '../../components/ui/partials/NoItems';
import {haveRestrictions} from '../../utils/auth';
import {messageView} from '../../utils/message';
import colors from '../../styles/colors';

const Bookings = ({navigation}) => {
  //focus screen
  const isFocused = useIsFocused();

  // auth context
  const authContext = useContext(AuthContext);
  const {selectedAccount, toogleMessage, dispatch, selectedFilial, user} =
    authContext;

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  const {
    loading,
    loadBookingsYear,
    bookings,
    message,
    clearErrors,
    clear,
    created,
    edited,
    deleted,
  } = bookingsContext;

  useEffect(() => {
    if (isFocused && !message) {
      loadBookingsYear();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (created || edited || deleted) {
      loadBookingsYear();
    }
  }, [created, edited, deleted]);

  useEffect(() => {
    if (message) {
      messageView(message, 'success', 3000);
      // clearErrors();
    }
  }, [message]);

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {bookings?.length > 0 ? (
        <FlatList
          data={bookings}
          keyExtractor={booking => booking.id.toString()}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems label="No tienes reservas vigentes." />
      )}

      {!haveRestrictions('Crear reserva', user.restrictions) && (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => navigation.navigate('bookableAreasOwner', {})}
        />
      )}
    </View>
  );
};

export default Bookings;

const styles = StyleSheet.create({
  fab: {
    backgroundColor: colors.accent,
    bottom: 20,
    left: 0,
    margin: 20,
    position: 'absolute',
  },
});
