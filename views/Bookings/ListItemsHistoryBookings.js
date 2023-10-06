import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Linking,
  Alert,
  Platform,
} from 'react-native';
import {Image} from 'react-native-elements';
import {MIX_AWS_URL} from '../../Config/environment';
import FeatherIcon from 'react-native-vector-icons/Feather';
import BookingsContext from '../../context/bookings/bookingsContext';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import moment from 'moment';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {haveRestrictions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';
import {ActivityIndicator, IconButton, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const itemHistory = ({item, navigation}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  //props
  const {id, status} = item;

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  const {cancelBooking} = bookingsContext;

  //return color for status
  const getColor = () => {
    if (item.status === 'Aprobada') {
      return colors.into;
    } else if (item.status === 'Pendiente') {
      return colors.before;
    } else if (item.status === 'Rechazada' || item.status === 'Cancelada') {
      return colors.after;
    }
  };

  const getIcon = () => {
    if (item.status === 'Aprobada') {
      return 'check-bold';
    } else if (item.status === 'Pendiente') {
      return 'alert-circle';
    } else if (item.status === 'Rechazada' || item.status === 'Cancelada') {
      return 'cancel';
    }
  };

  //show alert for cancel bookinh
  const handleConfirmation = () => {
    Alert.alert(
      '¿Desea cancelar la reserva? Esta acción es irreversible.',
      'Una reserva cancelada no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => cancelBooking(id)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const content = () => (
    <>
      {item?.bookable_area?.images?.length > 0 ? (
        <View style={styles.bookableAreaImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={{uri: MIX_AWS_URL + item.bookable_area.images[0].image_url}}
            style={styles.image}
          />
        </View>
      ) : (
        <View style={styles.bookableAreaDefaultImage}>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={require('../../assets/images/Booking.png')}
            style={styles.defaultImage}
          />
        </View>
      )}

      <View style={globalStyles.rowDirection}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text style={styles.title}>
            {item?.bookable_area?.name.substr(0, 20)}
          </Text>

          <Text style={styles.item}>
            {`Inicio : `}
            {moment(item?.start).isValid()
              ? moment(item?.start).format('lll')
              : 'Fecha inválida'}
          </Text>
          <Text style={styles.item}>
            {`Final : `}
            {moment(item?.end).isValid()
              ? moment(item?.end).format('lll')
              : 'Fecha inválida'}
          </Text>

          <View style={styles.status}>
            <Text style={styles.title}>{item.status}</Text>
            <MaterialCommunityIcons
              style={styles.iosArrow}
              name={getIcon()}
              size={RFValue(16)}
              color={getColor()}
            />
          </View>
        </View>
        {status !== 'Cancelada' &&
          moment(item?.start, 'YYYY-MM-DD H:mm').isValid() &&
          moment(item?.start, 'YYYY-MM-DD H:mm').isAfter(moment()) && (
            <View style={styles.viewButtons}>
              {!haveRestrictions('Eliminar reserva', user.restrictions) && (
                <IconButton
                  icon={() => (
                    <MaterialCommunityIcons
                      style={styles.iosArrow}
                      name="delete"
                      size={RFValue(25)}
                      color={colors.warning}
                    />
                  )}
                  size={RFValue(25)}
                  onPress={() => handleConfirmation()}
                />
              )}
            </View>
          )}
      </View>
    </>
  );

  return status !== 'Cancelada' &&
    moment(item?.start, 'YYYY-MM-DD H:mm').isValid() &&
    moment(item?.start, 'YYYY-MM-DD H:mm').isAfter(moment()) &&
    !haveRestrictions('Actualizar reserva', user.restrictions) ? (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() =>
        navigation.navigate('BookingOwner', {item, history: true})
      }>
      {content()}
    </TouchableOpacity>
  ) : (
    <View style={styles.listItem}>{content()}</View>
  );
};

const styles = StyleSheet.create({
  bookableAreaDefaultImage: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
  },
  bookableAreaImage: {
    justifyContent: 'center',
  },
  defaultImage: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    resizeMode: 'contain',
    width: '100%',
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    width: '100%',
  },
  iosArrow: {
    justifyContent: 'center',
  },
  item: {
    color: colors.white,
    fontSize: RFValue(12),
    margin: 2,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    margin: '2.5%',
    width: '100%',
  },
  status: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(13),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 1,
  },
  viewButtons: {
    justifyContent: 'center',
  },
});

export default itemHistory;
