import React, {useEffect, useContext} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import globalStyles, {theme} from '../../styles/global';
import OwnersContext from '../../context/owners/ownersContext';
import Item from './ListItems';
import {useIsFocused} from '@react-navigation/native';
import NoItems from '../../components/ui/partials/NoItems';
import {ActivityIndicator, FAB} from 'react-native-paper';
import {havePermissions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';

const Owners = ({navigation}) => {
  //owners context
  const auth = useContext(authContext);
  const {user} = auth;

  const ownersContext = useContext(OwnersContext);
  const {loading, owners, loadOwners, clear} = ownersContext;

  const isFocused = useIsFocused();
  useEffect(() => {
    loadOwners();
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
      {owners.length > 0 ? (
        <FlatList
          data={owners}
          keyExtractor={(owner, index) => index + ' ' + owner.id.toString()}
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
            navigation.navigate('newOwner');
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

export default Owners;
