import React, {useEffect, useContext, useRef} from 'react';
import {FlatList, View, StyleSheet} from 'react-native';
import {ActivityIndicator, FAB} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import VehiclesContext from '../../context/vehicles/vehiclesContext';
import Item from './ListItems';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import NoItems from '../../components/ui/partials/NoItems';
import {messageView} from '../../utils/message';

const Vehicles = ({navigation}) => {
  //owners context

  const vehiclesContext = useContext(VehiclesContext);
  const {loading, vehicles, message, loadVehicles, clearErrors, error} =
    vehiclesContext;

  const isFocused = useIsFocused();
  useEffect(() => {
    loadVehicles();
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
      {vehicles.length > 0 ? (
        <FlatList
          data={vehicles}
          keyExtractor={vehicle => vehicle.plate}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}

      <FAB
        icon="plus"
        style={globalStyles.fab}
        onPress={() => {
          clearErrors();
          navigation.navigate('newVehicle', {});
        }}
      />
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

export default Vehicles;
