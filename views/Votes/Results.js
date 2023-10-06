/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import Item from './ListItems';
import NoItems from '../../components/ui/partials/NoItems';
import {useIsFocused} from '@react-navigation/native';
import VotingsContext from '../../context/votings/votingsContext';
import Toast from 'react-native-easy-toast';
import {useRef} from 'react';
import PropTypes from 'prop-types';
import {messageView} from '../../utils/message';

const Results = ({navigation}) => {
  const voteContext = useContext(VotingsContext);

  const {loadEndsVotings, results, error, message, loading, clear} =
    voteContext;

  //focus screen
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      clear();
      loadEndsVotings();
    } else {
      clear();
    }
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
      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={vote => vote?.id?.toString()}
          style={{flex: 1, minHeight: '65%'}}
          renderItem={({item}) => (
            <Item item={item} navigation={navigation} results={true} />
          )}
        />
      ) : (
        <NoItems label={'No hay resultados disponibles en el sistema'} />
      )}
    </View>
  );
};
Results.propTypes = {
  navigation: PropTypes.object.isRequired,
};
export default Results;

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
