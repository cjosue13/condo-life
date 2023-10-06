import React from 'react';
import {View, StyleSheet, Alert, ScrollView, Platform} from 'react-native';
import {
  Headline,
  Text,
  Subheading,
  Button,
  FAB,
  IconButton,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import ImageView from '../../components/ui/partials/ImagesViews/ImageView';
import {useContext} from 'react';
import VehiclesContext from '../../context/vehicles/vehiclesContext';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../styles/colors';

const DetailsPets = ({navigation, route}) => {
  const {plate, model_brand, color, id, file} = route.params.item;
  const vehicleContext = useContext(VehiclesContext);
  const {vehicles, updateFilial, clearErrors} = vehicleContext;

  const showConfirmation = () => {
    Alert.alert(
      '¿Deseas eliminar este vehículo?',
      'Una vehículo eliminada no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deletePet()},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const deletePet = async () => {
    try {
      const data = vehicles.filter(vehicle => vehicle.plate !== plate);
      await updateFilial({vehicles: data});
      // Redireccionar
      navigation.navigate('vehicles');
    } catch (error) {
      // console.log(error.message);
    }
    //validar cual es la plataforma
  };

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.view}>
        <ImageView imageUrl={file} noImage={'Car.png'} />
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.title}>
          {model_brand.substr(0, 60)}
          {model_brand.length > 60 && '...'}
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Placa :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {plate}
          </Subheading>
        </Text>

        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Color :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {color}
          </Subheading>
        </Text>
      </View>
      <View style={globalStyles.rowOptions}>
        <IconButton
          size={RFValue(32)}
          color={colors.primary}
          onPress={() => {
            clearErrors();
            navigation.navigate('newVehicle', {
              vehicle: route.params.item,
            });
          }}
          icon={({size, color}) => (
            <MaterialCommunityIcons
              name="home-edit"
              size={size}
              color={color}
              backgroundColor={theme.colors.primary}
            />
          )}
        />
        <IconButton
          size={RFValue(32)}
          color={colors.warning}
          onPress={() => showConfirmation()}
          icon={({size, color}) => (
            <MaterialCommunityIcons
              name="delete"
              size={size}
              color={color}
              backgroundColor={theme.colors.primary}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subInfo: {
    color: colors.white,
    fontSize: RFValue(12),
  },
  text: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(24),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    justifyContent: 'center',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default DetailsPets;
