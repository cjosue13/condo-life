import React, {useEffect, useState, useContext} from 'react';
import {Text, FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import axios from 'axios';
import Item from './ListItems';
import ContactsContext from '../../context/contacts/contactsContext';
import {useIsFocused} from '@react-navigation/native';
import NoItems from '../../components/ui/partials/NoItems';

const Contacts = ({navigation}) => {
  //contacts context
  const contactsContext = useContext(ContactsContext);
  const {loading, contacts, message, clearErrors, loadContacts} =
    contactsContext;

  const isFocused = useIsFocused();

  useEffect(() => {
    loadContacts();
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {contacts.length > 0 ? (
        <FlatList
          data={contacts}
          keyExtractor={contact => contact.id.toString()}
          style={styles.list}
          renderItem={({item}) => <Item item={item} />}
        />
      ) : (
        <NoItems />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default Contacts;
