import React, {useEffect, useState, useContext, useRef} from 'react';
import {FlatList, View, StyleSheet, Alert} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import BookingsContext from '../../context/bookings/bookingsContext';
import {useIsFocused} from '@react-navigation/native';
import globalStyles, {theme} from '../../styles/global';
import axios from 'axios';
import Toast from 'react-native-easy-toast';
import Item from './ListItemsHistoryBookings';
import NoItems from '../../components/ui/partials/NoItems';
import {messageView} from '../../utils/message';

const History = ({navigation}) => {
  // state de la app

  //focus screen
  const isFocused = useIsFocused();

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  const {
    loadHistoryBookings,
    loading,
    history,
    message,
    clearErrors,
    clear,
    deleted,
  } = bookingsContext;

  useEffect(() => {
    if (isFocused) {
      loadHistoryBookings();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (deleted) {
      loadHistoryBookings();
    }
  }, [deleted]);

  useEffect(() => {
    if (message) {
      messageView(message, 'success', 3000);
      // clearErrors();
    }
  }, [message]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {history?.length > 0 ? (
        <FlatList
          data={history}
          keyExtractor={booking => booking.id.toString()}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems label="No existe un historial de reservas." />
      )}
    </View>
  );
};

export default History;

const styles = StyleSheet.create({
  calendar: {
    borderBottomWidth: 1,
    borderColor: '#eee',
    borderTopWidth: 1,
    height: 350,
    paddingTop: 5,
  },
  container: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
