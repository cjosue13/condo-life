/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {FAB, ActivityIndicator} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import Item from './ListItems';
import NoItems from '../../components/ui/partials/NoItems';
import PropTypes from 'prop-types';
import {useIsFocused} from '@react-navigation/native';
import AutorizationsContext from '../../context/autorizations/autorizationsContext';
import Toast from 'react-native-easy-toast';
import {haveRestrictions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';
import {messageView} from '../../utils/message';

const Services = ({navigation, title}) => {
  // state de la app
  const autorizationContext = useContext(AutorizationsContext);
  const auth = useContext(authContext);
  const {user} = auth;

  const {error, message, services, loadAutorizations, clear, loading} =
    autorizationContext;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadAutorizations(title);
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
      {services.length > 0 ? (
        <FlatList
          data={services}
          keyExtractor={authorizate => authorizate.id.toString()}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}

      {!haveRestrictions('Crear autorizado', user.restrictions) && (
        <FAB
          icon="plus"
          style={globalStyles.fab}
          onPress={() => navigation.navigate('newAuthorizate')}
        />
      )}
    </View>
  );
};

Services.propTypes = {
  navigation: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});

export default Services;
