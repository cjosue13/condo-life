/* eslint-disable react-native/no-inline-styles */
import React, {useEffect, useContext, useState} from 'react';

import {useIsFocused} from '@react-navigation/native';
import {FlatList, StyleSheet, View} from 'react-native';
import EntranceContext from '../../context/entrance/entranceContext';
import Item from './ListItems';
import globalStyles, {theme} from '../../styles/global';
import NoItems from '../../components/ui/partials/NoItems';
import {ActivityIndicator, Searchbar, TextInput} from 'react-native-paper';
import Feather from 'react-native-vector-icons/Feather';

const Entrances = ({navigation}) => {
  //context
  const entranceContext = useContext(EntranceContext);
  const {loadEntrances, entrances, loading, clear} = entranceContext;
  const isFocused = useIsFocused();
  const [items, setItems] = useState([]);

  const onChange = text => {
    if (text.trim() !== '') {
      const filterData =
        entrances.filter(
          item =>
            item.entrancename
              .toUpperCase()
              .includes(text.trim().toUpperCase()) ||
            item.lastname.toUpperCase().includes(text.trim().toUpperCase()),
        ).length > 0
          ? entrances.filter(
              item =>
                item.lastname
                  .toUpperCase()
                  .includes(text.trim().toUpperCase()) ||
                item.entrancename
                  .toUpperCase()
                  .includes(text.trim().toUpperCase()),
            )
          : [];
      setItems(filterData);
    } else {
      setItems(entrances);
    }
  };

  useEffect(() => {
    setItems(entrances);
  }, [entrances]);

  useEffect(() => {
    if (isFocused) {
      loadEntrances();
    } else {
      clear();
    }
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
      <Searchbar
        onChange={e => onChange(e.nativeEvent.text)}
        placeholder="Buscar..."
        theme={theme}
      />
      {items?.length > 0 ? (
        <FlatList
          data={items}
          keyExtractor={entrance => entrance.id.toString()}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default Entrances;
