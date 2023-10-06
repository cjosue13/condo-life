import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  FlatList,
  Platform,
} from 'react-native';
import {Button, Card, Text} from 'react-native-paper';
import {CheckBox} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import {size, map} from 'lodash';
import moment from 'moment';
import GuestList from '../../components/ui/Guests/owner/GuestList';
import AuthContext from '../../context/autentication/authContext';
import BookingsContext from '../../context/bookings/bookingsContext';
import FieldError from '../../components/ui/errors/FieldError';
import Loading from '../../components/ui/partials/Loading';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Toast from 'react-native-easy-toast';
import {useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const screenWidth = Dimensions.get('window').width;

const PreviewBooking = ({
  navigation,
  bookable_area,
  start,
  end,
  formData,
  guest,
}) => {
  const [check, setCheck] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // authContext
  const authContext = useContext(AuthContext);
  const {selectedFilial} = authContext;

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  const {errors, createBooking, created, clear, loadingCreate, error} =
    bookingsContext;

  //focus screen
  // const isFocused = useIsFocused();

  //use Effect
  useEffect(() => {
    if (created) {
      navigation.navigate('bookings');
    }
    if (errors != undefined) {
      setIsLoading(false);
    }
    /*if (!isFocused) {
      clearErrors();
    } */
    // clearErrors();
  }, [created, errors]);

  /* useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]); */

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
  }, [error]);

  //get data for send api
  const getData = () => {
    const object = new Object();
    object.status = 'Pendiente';
    object.area_id = bookable_area.id;
    (object.start = start), (object.end = end), (object.note = 'N/A');
    object.guests = JSON.stringify(guest);
    return object;
  };

  const handleSubmit = () => {
    if (moment(start, 'YYYY-MM-DD H:mm').isAfter(moment())) {
      const data = getData();
      createBooking(data);
      setIsLoading(true);
    } else {
      messageView(
        'La hora de inicio de la reserva es anterior a la hora actual, por favor selecciona otra hora de reserva.',
        'warning',
        3000,
      );
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.header}>Resumen</Text>

      <View style={styles.container}>
        <ScrollView style={{height: '50%'}}>
          <Card style={styles.cardStyle}>
            <Card.Content>
              <Text style={styles.title}>{bookable_area.name}</Text>
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
            </Card.Content>
          </Card>

          <Loading isVisible={isLoading} text="Creando reserva" />
        </ScrollView>

        {/* Errors */}
        {errors != undefined && FieldError(errors, 'wrong_dates')}
        {errors != undefined && FieldError(errors, 'space')}
        {errors != undefined && FieldError(errors, 'minimum_days')}
        {errors != undefined && FieldError(errors, 'maximum_days')}
        {errors != undefined && FieldError(errors, 'max_per_filial_per_day')}
        {errors != undefined && FieldError(errors, 'max_per_filial_per_week')}
        {errors != undefined && FieldError(errors, 'max_per_filial_per_month')}
        {errors != undefined && FieldError(errors, 'max_per_filial_per_year')}
        {errors != undefined && FieldError(errors, 'max_per_area_per_day')}
        {errors != undefined && FieldError(errors, 'max_per_area_per_week')}
        {errors != undefined && FieldError(errors, 'max_per_area_per_month')}
        {errors != undefined && FieldError(errors, 'max_per_area_per_year')}
        {errors != undefined && FieldError(errors, 'max_time')}
        {errors != undefined && FieldError(errors, 'holidays')}
        {errors != undefined && FieldError(errors, 'schedules_per_day')}
        {errors != undefined && FieldError(errors, 'shift_schedule')}
        {errors != undefined && FieldError(errors, 'same_days')}
      </View>

      <Button
        style={styles.boton}
        mode="contained"
        underlineColor={theme.colors.primary}
        theme={theme}
        // disabled={disabled}
        onPress={() => handleSubmit()}>
        Confirmar reserva
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  cardStyle: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    margin: '2.5%',
  },
  container: {
    flex: 1,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 10,
    textAlign: 'center',
  },
  main: {
    height: '80%',
    margin: '2.5%',
  },
  text: {
    color: colors.white,
    fontSize: RFValue(18),
    fontWeight: 'normal',
  },
  textPreview: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
    textAlign: 'center',
  },
});

export default PreviewBooking;
