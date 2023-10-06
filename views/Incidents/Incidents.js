import React, {useEffect, useContext, useState, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator, FAB, Headline} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import IncidentContext from '../../context/incidents/IncidentContext';
import globalStyles, {theme} from '../../styles/global';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/ui/partials/Loading';
import Item from './ListItems';
import NoItems from '../../components/ui/partials/NoItems';
import {haveRestrictions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';
import {messageView} from '../../utils/message';

const Indicents = ({navigation, route}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  //context
  const incidentContext = useContext(IncidentContext);
  const {loadIncidents, incidents, loading, message, clearErrors} =
    incidentContext;

  //focus screen
  const isFocused = useIsFocused();

  useEffect(() => {
    clearErrors();
    if (message) {
      messageView(message, 'success', 3000);
    }
    loadIncidents();
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
      {incidents?.data?.length > 0 ? (
        <FlatList
          data={incidents.data}
          keyExtractor={incident => incident.id.toString()}
          style={{flex: 1}}
          onEndReachedThreshold={0.5}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}
      {!haveRestrictions('Crear incidencia', user.restrictions) && (
        <FAB
          icon="plus"
          style={globalStyles.fab}
          onPress={() => navigation.navigate('newIncident')}
        />
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

export default Indicents;
