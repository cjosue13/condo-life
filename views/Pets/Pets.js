import React, {useEffect, useState, useContext, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {
  List,
  Headline,
  Button,
  FAB,
  Avatar,
  DefaultTheme,
  ActivityIndicator,
} from 'react-native-paper';
import axios from 'axios';
import Item from './ListItems';
//import globalStyles from '../styles/global'
import globalStyles, {theme} from '../../styles/global';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import PetsContext from '../../context/pets/petsContext';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import NoItems from '../../components/ui/partials/NoItems';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';

const Pets = ({navigation}) => {
  const petsContext = useContext(PetsContext);
  const {loadPets, pets, loading, message, error} = petsContext;
  //focus screen
  const isFocused = useIsFocused();

  useEffect(() => {
    loadPets();
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {pets.data?.length > 0 ? (
        <FlatList
          data={pets.data}
          keyExtractor={pet => pet.id.toString()}
          style={{flex: 1}}
          onEndReachedThreshold={0.5}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}

      <FAB
        icon="plus"
        style={globalStyles.fab}
        onPress={() => navigation.navigate('newpet', {})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: 'red',
    marginTop: 100,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: '#FFF',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    width: '90%',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: RFValue(18),
    marginBottom: 20,
  },
});

export default Pets;
