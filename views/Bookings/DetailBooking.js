import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  Subheading,
  Button,
  DefaultTheme,
  TextInput,
  Card,
  Portal,
  Modal,
  Text,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import globalStyles, {configFonts, theme} from '../../styles/global';
import BookingsContext from '../../context/bookings/bookingsContext';
import {Image} from 'react-native-elements';
import axios from 'axios';
import Item from './ListItemsBookings';
import GuestList from '../../components/ui/Guests/owner/GuestList';
import {MIX_AWS_URL} from '../../Config/environment';
import {size, map} from 'lodash';
import Toast from 'react-native-easy-toast';
import CarouselComponent from '../../components/ui/partials/Carousel';
import Loading from '../../components/ui/partials/Loading';
import RequiredField from '../../components/ui/forms/RequiredField';
import Icon from 'react-native-vector-icons/FontAwesome5';
import moment from 'moment';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';
import Guest from './Guest';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Animbutton from '../../components/ui/partials/Animbutton';
import CardView from 'react-native-cardview';

const screenWidth = Dimensions.get('window').width;

const DetailBooking = ({route, navigation}) => {
  // state de la app

  const [noteUpdate, setNote] = useState('');
  const [showGuest, setShowGuest] = useState(false);

  const showModalGuest = () => {
    setShowGuest(true);
  };
  const hideGuest = () => {
    setShowGuest(false);
  };

  //focus screen
  const isFocused = useIsFocused();

  //props
  const {bookable_area, note, end, start, status, id} = route.params.item;
  const {history} = route.params;

  const [loading, setLoading] = useState(false);
  const [imageView, setImageView] = useState(false);
  const [image, setImage] = useState('');

  const showImage = url => {
    setImage(url);
    setImageView(true);
  };
  const hideImage = () => {
    setImage('');
    setImageView(false);
  };

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  const {
    message,
    loadBooking,
    showBooking,
    clearErrors,
    booking,
    deletedGuest,
    guests,
    updateBooking,
    edited,
    remo,
    removeGuest,
    removeLocalElement,
  } = bookingsContext;

  useEffect(() => {
    showBooking(id);

    if (deletedGuest) {
      messageView(message, 'success', 3000);
      clearErrors();
    }

    if (edited) {
      navigation.navigate('bookings');
      clearErrors();
    }
  }, [loadBooking, edited]);

  //onchange field function
  const onChange = (e, type) => {
    setNote({...noteUpdate, [type]: e.nativeEvent.text});
  };

  useEffect(() => {
    if (loading) {
      handleSubmit();
    }
  }, [loading]);

  //save guests in state
  const handleSubmit = async () => {
    try {
      const data = getData();
      await updateBooking(id, data);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  //delete guest from booking
  const handleDelete = item => {
    if (!item.local) {
      removeGuest(item.id);
    }
    removeLocalElement(item.id);
  };

  //get data for send api
  const getData = () => {
    const object = new Object();
    object.status = booking.status;
    object.area_id = bookable_area.id;
    object.start = booking.start;
    object.end = booking.end;
    object.note = noteUpdate.note ? noteUpdate.note : booking.note;
    object.guests = JSON.stringify(
      guests.map(item =>
        item.local ? {name: item.name, lastname: item.lastname} : item,
      ),
    );

    return object;
  };

  const handleConfirmation = item => {
    Alert.alert(
      'Información de invitado',
      `¿Desea eliminar al invitado ${item.name + ' ' + item.lastname}?`,
      [
        {
          text: 'Si, Eliminar',
          onPress: () => {
            handleDelete(item);
          },
        },
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  //return color for status
  const getColor = () => {
    if (status === 'Aprobada') {
      return colors.into;
    } else if (status === 'Pendiente') {
      return colors.before;
    } else if (status === 'Rechazada' || status === 'Cancelada') {
      return colors.after;
    }
  };

  const getIcon = () => {
    if (status === 'Aprobada') {
      return 'check-bold';
    } else if (status === 'Pendiente') {
      return 'alert-circle';
    } else if (status === 'Rechazada' || status === 'Cancelada') {
      return 'cancel';
    }
  };

  if (loadBooking) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.container}>
        <CardView
          style={styles.listItem}
          cardElevation={7}
          cardMaxElevation={2}>
          <Text style={styles.title}>{`${bookable_area.name}`}</Text>
          <View style={styles.status}>
            <Text style={styles.title}>{status}</Text>
            <MaterialCommunityIcons
              style={styles.iosArrow}
              name={getIcon()}
              size={RFValue(16)}
              color={getColor()}
            />
          </View>
          <KeyboardAwareScrollView>
            <View>
              <Text style={styles.textPreview}>
                {`Inicio : `}
                <Text style={styles.text}>
                  {moment(start, 'YYYY-MM-DD H:mm').format('lll')}
                </Text>
              </Text>
              <Text style={styles.textPreview}>
                {`Final : `}
                <Text style={styles.text}>
                  {moment(end, 'YYYY-MM-DD H:mm').format('lll')}
                </Text>
              </Text>

              <View style={{...globalStyles.containerItem, margin: 0}}>
                <IconButton
                  size={RFValue(25)}
                  color={colors.primary}
                  onPress={() => showModalGuest()}
                  icon={({size, color}) => (
                    <MaterialCommunityIcons
                      name="account-multiple-plus"
                      size={size}
                      color={color}
                      backgroundColor={theme.colors.primary}
                    />
                  )}
                />
                <TouchableOpacity onPress={() => showModalGuest()}>
                  <Text>Invitados</Text>
                </TouchableOpacity>
              </View>
              <ScrollView
                horizontal
                style={{
                  height: RFValue(50),
                }}>
                {guests?.map((item, index) => (
                  <Animbutton
                    key={index}
                    effect={'pulse'}
                    _onPress={() => handleConfirmation(item)}
                    text={`${item.name.substr(0, 1)}.${item.lastname.substr(
                      0,
                      1,
                    )}`}
                    hours={false}
                  />
                ))}
              </ScrollView>
            </View>
            <RequiredField field={'Nota'} required={false} />
            <TextInput
              label="Nota"
              onChange={e => onChange(e, 'note')}
              value={noteUpdate != '' ? noteUpdate.note : note}
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.input}
            />
          </KeyboardAwareScrollView>
        </CardView>

        <Loading isVisible={loading} text="Actualizando reserva" />
        {/*size(guests) > 0 && (
          <>
            <Text style={styles.header}>Invitados</Text>
            <FlatList
              data={guests}
              style={styles.cardStyle}
              keyExtractor={(guest, index) => index.toString()}
              renderItem={({item}) => (
                <GuestList guestItem={item} deleted={true} />
              )}
            />
          </>
              )*/}

        <Portal>
          <Modal
            visible={imageView}
            onDismiss={hideImage}
            contentContainerStyle={styles.containerImage}>
            {image.trim() !== '' && (
              <Image
                resizeMode="cover"
                PlaceholderContent={<ActivityIndicator color="fff" />}
                style={styles.viewImage}
                source={{uri: image}}
              />
            )}
          </Modal>
        </Portal>
        <Portal>
          <Modal
            visible={showGuest}
            onDismiss={hideGuest}
            contentContainerStyle={styles.containerImage}>
            <Guest update hideGuest={hideGuest} />
          </Modal>
        </Portal>
      </View>

      <Button
        style={styles.boton}
        mode="contained"
        underlineColor={theme.colors.primary}
        theme={theme}
        onPress={() => {
          setLoading(true);
        }}>
        Actualizar reserva
      </Button>
    </View>
  );
};

export default DetailBooking;

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
    margin: 10,
  },
  status: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  listItem: {
    marginTop: '2.5%',
    maxHeight: '70%',
    minHeight: '70%',
    padding: '2.5%',
    backgroundColor: colors.white,
  },
  cardStyle: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 5,
    margin: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  container: {
    flex: 1,
  },
  containerImage: {
    backgroundColor: colors.whiteDark,
    marginHorizontal: '2.5%',
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 10,
    textAlign: 'center',
  },

  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
    marginBottom: 20,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  results: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  text: {
    color: colors.black,
    fontSize: RFValue(18),
    fontWeight: 'normal',
  },

  textGuests: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
    textAlign: 'center',
  },
  textPreview: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
  },

  title: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
    textAlign: 'center',
  },
  viewImage: {
    height: 300,
    width: 300,
  },
});
