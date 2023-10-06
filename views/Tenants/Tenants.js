import React, {useEffect, useContext, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import TenantsContext from '../../context/tenants/tenantsContext';
import Item from './ListItems';
import Toast from 'react-native-easy-toast';
import {useIsFocused} from '@react-navigation/native';
import NoItems from '../../components/ui/partials/NoItems';
import {havePermissions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';
import {messageView} from '../../utils/message';

const Tenants = ({navigation}) => {
  //owners context

  const auth = useContext(authContext);
  const {user} = auth;
  const tenantsContext = useContext(TenantsContext);
  const {loading, tenants, message, error, loadTenants, clear} = tenantsContext;

  //focus screen
  const isFocused = useIsFocused();

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    loadTenants();
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
      {tenants.length > 0 ? (
        <FlatList
          data={tenants}
          keyExtractor={tenant => tenant.id.toString()}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}

      {!havePermissions(['tenant'], user.roles) && (
        <FAB
          icon="plus"
          style={globalStyles.fab}
          onPress={() => {
            clear();
            navigation.navigate('newtenant');
          }}
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

export default Tenants;
