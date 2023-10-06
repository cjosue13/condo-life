import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  Text,
  FlatList,
  View,
  StyleSheet,
  Dimensions,
  ScrollView,
  Platform,
} from 'react-native';
import {Calendar, LocaleConfig} from 'react-native-calendars';
import {ActivityIndicator, Button} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import BookingsContext from '../../context/bookings/bookingsContext';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import CardView from 'react-native-cardview';
import SlotList from './SlotList';

//config for calendar
LocaleConfig.locales['es'] = {
  monthNames: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  monthNamesShort: [
    'Ene.',
    'Febr.',
    'Marz.',
    'Abr.',
    'May.',
    'Jun.',
    'Jul.',
    'Agost.',
    'Sept.',
    'Oct.',
    'Nov.',
    'Dec.',
  ],
  dayNames: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
  dayNamesShort: ['Dom', 'Lun', 'Mar', 'Miér', 'Jue', 'Vier', 'Sáb'],
  today: 'Hoy',
};

LocaleConfig.defaultLocale = 'es';

const {width, height} = Dimensions.get('window');

const CalendarBookings = ({navigation, route}) => {
  const [disabledList, setDisabledList] = useState({});
  const [selected, setSelected] = useState('');
  const [imageView, setImageView] = useState(false);

  const [info, setInfo] = useState(null);

  const showImage = () => {
    setImageView(true);
  };

  const hideImage = () => {
    setImageView(false);
  };
  const handleInfo = value => {
    setInfo(value);
  };
  //get bookable area for params
  const {bookableArea} = route.params;

  const isFocused = useIsFocused();

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  //state of conxtext
  const {loading, bookingsArea, loadBookingsForArea, clear} = bookingsContext;

  //use Effect
  useEffect(() => {
    if (isFocused) {
      loadBookingsForArea(bookableArea.id);
      unselectDays();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (bookingsArea.length > 0) {
      unselectDays();
      // setDisabledList(getFullDays());
    } else {
      // console.log(bookingsArea);
    }
  }, [bookingsArea]);

  //redirect to list hours
  const onDayPress = day => {
    setSelected(day);

    //navigation.navigate('slots', {day: day, bookableArea: bookableArea});
    //setDisabledList({});
  };

  const unselectDays = dateString => {
    const daysOfWeek = [
      'lunes',
      'martes',
      'miercoles',
      'jueves',
      'viernes',
      'sabado',
      'domingo',
    ];
    //horarios del area reservable
    const schedule = JSON.parse(bookableArea.schedule);

    //reservaciones del area reservable desde el dia actual
    var bookings = bookingsArea.filter(event => event.status === 'Aprobada');

    var unableDays = [];
    var unableDatesArray = [];
    var fullDatesArray = [];

    //validacion del horario por turnos o por horario de apertura.
    if (schedule.schedules_per_day.enable) {
      ///  debugger
      daysOfWeek.map(day => {
        !schedule.schedules_per_day[`${day}`].enable
          ? unableDays.push(day)
          : null;
      });

      const todayMon = dateString
        ? moment(dateString, 'YYYY-MM-DD').toDate()
        : new Date();
      const yearMon = todayMon.getFullYear();
      const numberMon = String(todayMon.getMonth() + 1).padStart(2, '0');

      const daysmonth = weekDays(parseInt(numberMon), yearMon);

      // console.log('DAYSMONT ', daysmonth);

      daysmonth.map(item => {
        if (
          unableDays.includes(
            moment(item)
              .locale('es')
              .format('dddd')
              .normalize('NFD')
              .replace(
                /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
                '$1',
              )
              .normalize()
              .toLowerCase(),
          )
        ) {
          unableDatesArray.push(moment(item).format('YYYY-MM-DD'));
        }
      });

      bookings.map((booking, ind, arr) => {
        var date = moment(booking.start).format('YYYY-MM-DD');
        var bookingsQuantity = arr.filter(
          element => moment(element.start).format('YYYY-MM-DD') === date,
        ); //Dates filter by booking generate

        var bookedDay = moment(booking.end)
          .locale('es')
          .format('dddd')
          .normalize('NFD')
          .replace(
            /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
            '$1',
          )
          .normalize();
        var hours = [];

        const clearHoursDay = [
          ...bookingsQuantity
            .reduce(
              (map, obj) => map.set(moment(obj.start).format('H'), obj),
              new Map(),
            )
            .values(),
        ];

        if (clearHoursDay.length > 1) {
          clearHoursDay.map(e =>
            hours.push(
              parseInt(moment(e.end).format('H')) -
                parseInt(moment(e.start).format('H')),
            ),
          );
          var resultValueBooking = hours.reduce((v, i) => v + i);
          var resultScheduleBooking =
            parseInt(
              schedule.schedules_per_day[`${bookedDay}`].fin.substring(0, 2),
            ) -
            parseInt(
              schedule.schedules_per_day[`${bookedDay}`].inicio.substring(0, 2),
            );

          if (resultScheduleBooking === resultValueBooking) {
            fullDatesArray.push(date);
          }
        } else {
          const startHourBooking = parseInt(moment(booking.start).format('H'));
          const finishHourBooking = parseInt(moment(booking.end).format('H'));
          const resultHourBooking = finishHourBooking - startHourBooking;
          var resultScheduleBooking =
            parseInt(
              schedule.schedules_per_day[`${bookedDay}`].fin.substring(0, 2),
            ) -
            parseInt(
              schedule.schedules_per_day[`${bookedDay}`].inicio.substring(0, 2),
            );
          if (resultScheduleBooking === resultHourBooking)
            fullDatesArray.push(date);
        }
      });
    } else {
      daysOfWeek.map(day => {
        !schedule.shift_schedule[`${day}`].enable ? unableDays.push(day) : null;
      });

      const todayMon = dateString
        ? moment(dateString, 'YYYY-MM-DD').toDate()
        : new Date();
      const yearMon = todayMon.getFullYear();
      const numberMon = String(todayMon.getMonth() + 1).padStart(2, '0');

      const daysmonth = weekDays(parseInt(numberMon), yearMon);

      daysmonth.map(item => {
        if (
          unableDays.includes(
            moment(item)
              .locale('es')
              .format('dddd')
              .normalize('NFD')
              .replace(
                /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
                '$1',
              )
              .normalize()
              .toLowerCase(),
          )
        ) {
          unableDatesArray.push(moment(item).format('YYYY-MM-DD'));
        }
      });

      // console.log('UNABLE  ', unableDatesArray);

      bookings.map((booking, ind, arr) => {
        var bookedDay = moment(booking.end)
          .locale('es')
          .format('dddd')
          .normalize('NFD')
          .replace(
            /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
            '$1',
          )
          .normalize();
        var date = moment(booking.start).format('YYYY-MM-DD');
        //dinamic item
        const quantityHoursAvailable =
          schedule.shift_schedule[`${bookedDay}`].shifts.length;
        var bookingsQuantity = arr.filter(
          element => moment(element.start).format('YYYY-MM-DD') === date,
        );
        const clearHours = [
          ...bookingsQuantity
            .reduce(
              (map, obj) => map.set(moment(obj.start).format('H'), obj),
              new Map(),
            )
            .values(),
        ];

        if (clearHours.length === quantityHoursAvailable)
          fullDatesArray.push(date);
      });
    }
    //Delete repeated items into the array
    fullDatesArray = removeDuplicates(fullDatesArray);
    fullDatesArray = [...fullDatesArray, ...unableDatesArray];

    let mark = {};
    fullDatesArray.forEach(day => {
      if (moment().isBefore(day) || day === moment().format('YYYY-MM-DD')) {
        mark[day] = {
          selected: true,
          selectedColor: colors.after,
          disabled: true,
          disableTouchEvent: true,
        };
      }
    });

    setDisabledList(mark);
  };

  const removeDuplicates = arr => {
    var obj = {};
    var ret_arr = [];
    for (var i = 0; i < arr.length; i++) {
      obj[arr[i]] = true;
    }
    for (var key in obj) {
      ret_arr.push(key);
    }

    return ret_arr;
  };

  const weekDays = (month, year) => {
    const daysInMonth = moment(
      `${year}-${month}-01`,
      'YYYY-MM-DD',
    ).daysInMonth();
    const names = [];
    for (let i = 1; i <= daysInMonth; i++) {
      let date = moment(`${year}-${month}-${i}`, 'YYYY-MM-DD');
      //  let dayName = date.format('dddd')
      names.push(date.format('YYYY-MM-DD'));
    }

    return names;
  };

  //get first day of the month
  const getMinDay = () => {
    const begin = moment().format('YYYY-MM-DD');
    return begin;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView>
        <Calendar
          minDate={getMinDay()}
          markedDates={{
            ...disabledList,
            [selected.dateString]: {
              selected: true,
              disableTouchEvent: true,
            },
          }}
          onDayPress={day => onDayPress(day)}
          onMonthChange={month => {
            unselectDays(month.dateString);
          }}
          disableAllTouchEventsForDisabledDays={true}
          hideExtraDays
          theme={{
            selectedDayBackgroundColor: colors.primary,
            selectedDotColor: colors.primary,
            todayTextColor: colors.secondary,
            arrowColor: theme.colors.primary,
            backgroundColor: colors.white,
          }}
        />
        {selected !== '' && (
          <SlotList
            day={selected}
            bookableArea={bookableArea}
            navigation={navigation}
            info={info}
            imageView={imageView}
            hideImage={hideImage}
            handleInfo={handleInfo}
          />
        )}
      </ScrollView>

      {info && (
        <View style={styles.containerButton}>
          <Button
            style={styles.boton}
            mode="contained"
            underlineColor={theme.colors.primary}
            theme={theme}
            onPress={() => showImage()}>
            Realizar reserva
          </Button>
        </View>
      )}
    </View>
  );
};

export default CalendarBookings;
const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
    marginHorizontal: '2.5%',
  },
  containerButton: {
    backgroundColor: colors.white,
    marginVertical: '2.5%',
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
