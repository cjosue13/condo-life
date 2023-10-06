/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-raw-text */
import React, {useEffect, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  Platform,
} from 'react-native';
import {Text, Subheading, Button, FAB, IconButton} from 'react-native-paper';
//import globalStyles from '../styles/global';
import globalStyles, {configFonts, theme} from '../../styles/global';
import PetsContext from '../../context/pets/petsContext';
import ImageView from '../../components/ui/partials/ImagesViews/ImageView';
import PropTypes from 'prop-types';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const widthWindow = Dimensions.get('window').width;
const DetailsPets = ({navigation, route}) => {
  //context
  const petsContext = useContext(PetsContext);
  const {deletePet, deleted, clearErrors, sendAlert, error, message} =
    petsContext;
  const {name, breed, description, id, image_url} = route.params.item;

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
    clearErrors();
  }, [error, message]);

  const handleConfirmation = () => {
    Alert.alert(
      '¿Desea eliminar la mascota? Esta acción es irreversible.',
      'Una mascota eliminada no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deletePet(id)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const confirmAlert = () => {
    Alert.alert(
      'Información de alerta',
      `¿Confirma el envío de alerta de mascota en la filial?`,
      [
        {text: 'Si, confirmar', onPress: () => sendAlert(route.params.item)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  useEffect(() => {
    //render for state
    if (deleted) {
      navigation.navigate('pets');
    }
    clearErrors();
  }, [deleted]);

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.view}>
        <View style={styles.infoContent}>
          <View style={{justifyContent: 'center'}}>
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.title}>
              {name.substr(0, 60)}
              {name.length > 60 && '...'}
            </Text>
          </View>
        </View>

        <ImageView imageUrl={image_url} noImage={'Dog.png'} />

        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Raza :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {breed}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Descripción :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {description}
          </Subheading>
        </Text>
      </View>

      <View style={globalStyles.rowOptions}>
        <IconButton
          onPress={() => confirmAlert()}
          icon={({size, color}) => (
            <MaterialCommunityIcons
              name="alert"
              size={size}
              color={color}
              backgroundColor={theme.colors.primary}
            />
          )}
          size={RFValue(32)}
          color={colors.before}
        />
        <IconButton
          size={RFValue(32)}
          color={colors.primary}
          onPress={() =>
            navigation.navigate('newpet', {
              pet: route.params.item,
              edit: true,
            })
          }
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
          onPress={() => handleConfirmation()}
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

DetailsPets.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  alertContent: {
    alignItems: 'flex-end',
    flex: 1,
    marginTop: 5,
  },
  boton: {
    backgroundColor: 'red',
    color: 'white',
  },
  infoContent: {
    flexDirection: 'row',
  },
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
  },
});

export default DetailsPets;
