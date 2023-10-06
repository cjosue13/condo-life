import React, {useContext, useState, useEffect, useRef} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  ScrollView,
  Platform,
  Alert,
  Dimensions,
} from 'react-native';

import {
  Headline,
  Button,
  ActivityIndicator,
  Text,
  Portal,
  Modal,
  IconButton,
} from 'react-native-paper';
import {useIsFocused} from '@react-navigation/native';
import globalStyles, {configFonts, theme} from '../../styles/global';
import BookingsContext from '../../context/bookings/bookingsContext';
import Animbutton from '../../components/ui/partials/Animbutton';
import moment from 'moment';
import {map, size} from 'lodash';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import Toast from 'react-native-easy-toast';
import NoItems from '../../components/ui/partials/NoItems';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';
import colors from '../../styles/colors';
import PreviewBooking from './PreviewBooking';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CardView from 'react-native-cardview';
import Guest from './Guest';

const {width, height} = Dimensions.get('window');

const SlotList = ({
  navigation,
  day,
  bookableArea,
  imageView,
  info,
  hideImage,
  handleInfo,
}) => {
  //props component

  //state for the app
  const [range, setRange] = useState([]);
  const [guest, setGuest] = useState([]);
  const [selected, setSelected] = useState([]);

  const [showGuest, setShowGuest] = useState(false);

  const showModalGuest = () => {
    setShowGuest(true);
  };
  const hideGuest = () => {
    setShowGuest(false);
  };

  //focus screen
  const isFocused = useIsFocused();

  //bookings context
  const bookingsContext = useContext(BookingsContext);
  //state of conxtext
  const {
    bookablesArea,
    loadAllsBookings,
    allBookings,
    loadingHours,
    clearErrors,
  } = bookingsContext;

  //use Effect
  useEffect(() => {
    if (loadingHours) {
      loadAllsBookings(bookableArea.id, day.dateString);
    }
  }, [loadingHours]);

  useEffect(() => {
    handleInfo(null);
    clearErrors();
    setSelected([]);
    loadAllsBookings(bookableArea.id, day.dateString);
  }, [day]);

  useEffect(() => {
    // loadAllsBookings(bookableArea.id, day.dateString);
    searchDay();
  }, [allBookings]);

  //filters avaible hours for user
  const filterHours = hours => {
    const events = allBookings.filter(
      event => event.status === 'Aprobada' || event.status === 'Pendiente',
    );

    const rangeFormat = generateRangeHours(hours);

    const data = avaibleInfo(events, rangeFormat);

    var filterData = data.filter(item => item.state === false);
    const earring = EarringsHours();

    if (earring.length > 0) {
      filterData = filterData.concat(earring);
    }

    const res = asingUuid(filterData);

    const filter = res.filter(
      item =>
        moment(
          day.dateString + ' ' + item.starthour,
          'YYYY-MM-DD H:mm',
        ).isValid() &&
        moment(
          day.dateString + ' ' + item.starthour,
          'YYYY-MM-DD H:mm',
        ).isAfter(moment()),
    );

    setRange(filter.sort((a, b) => (a.startnumber < b.startnumber ? -1 : 1)));
  };

  //asign uuid for slot elements
  const asingUuid = data => {
    const slots = [];
    data.map(item => {
      slots.push({
        endhour: item.endhour,
        endnumber: item.endnumber,
        starthour: item.starthour,
        startnumber: item.startnumber,
        state: item.state,
        id: uuidv4(),
      });
    });

    return slots;
  };

  //function for generate range in hours
  const generateRange = (start, end, interval) => {
    function getMinutes(time) {
      var a = time.split(':').map(Number);
      return a[0] * 60 + a[1];
    }

    function getTime(m) {
      var h = (m / 60) | 0;
      m %= 60;
      return h + ':' + (m < 10 ? '0' + m : m);
    }

    var r = [],
      startM = getMinutes(start),
      endM = getMinutes(end);

    while (startM + interval <= endM) {
      r.push(getTime(startM) + ' - ' + getTime(startM + interval));
      startM += interval;
    }

    filterHours(r);
  };

  //filters avaible hours for user
  const filterHoursByShifts = hours => {
    const events = allBookings.filter(
      event => event.status === 'Aprobada' || event.status === 'Pendiente',
    );

    const rangeFormat = generateRangeHoursByShifts(hours);

    const data = avaibleInfo(events, rangeFormat);

    var filterData = data.filter(item => item.state === false);
    const earring = EarringsHours();

    if (earring.length > 0) {
      filterData = filterData.concat(earring);
    }

    const res = asingUuid(filterData);

    const filter = res.filter(
      item =>
        moment(
          day.dateString + ' ' + item.starthour,
          'YYYY-MM-DD H:mm',
        ).isValid() &&
        moment(
          day.dateString + ' ' + item.starthour,
          'YYYY-MM-DD H:mm',
        ).isAfter(moment()),
    );

    setRange(filter.sort((a, b) => (a.startnumber < b.startnumber ? -1 : 1)));
  };

  //order shift by area
  const orderShifts = data => {
    const arrayHours = [];
    for (let index = 0; index < data.length; index++) {
      arrayHours.push({
        starthour: data[index].inicio,
        endhour: data[index].fin,
      });
    }

    return arrayHours;
  };

  //search schedule for select day when bookable area is for opening hours
  const searchDayByOpeningHours = (dayWeek, schedule) => {
    const interval = 60;
    switch (dayWeek) {
      case 'lunes':
        const lunesStart = schedule.schedules_per_day.lunes.enable
          ? schedule.schedules_per_day.lunes.inicio
          : '';
        const lunesEnd = schedule.schedules_per_day.lunes.enable
          ? schedule.schedules_per_day.lunes.fin
          : '';
        generateRange(lunesStart, lunesEnd, interval);

        break;
      case 'martes':
        const martesStart = schedule.schedules_per_day.martes.enable
          ? schedule.schedules_per_day.martes.inicio
          : '';
        const martesEnd = schedule.schedules_per_day.martes.enable
          ? schedule.schedules_per_day.martes.fin
          : '';
        generateRange(martesStart, martesEnd, interval);

        break;
      case 'miercoles':
        const miercolesStart = schedule.schedules_per_day.miercoles.enable
          ? schedule.schedules_per_day.miercoles.inicio
          : '';
        const miercolesEnd = schedule.schedules_per_day.miercoles.enable
          ? schedule.schedules_per_day.miercoles.fin
          : '';
        generateRange(miercolesStart, miercolesEnd, interval);

        break;
      case 'jueves':
        const juevesStart = schedule.schedules_per_day.jueves.enable
          ? schedule.schedules_per_day.jueves.inicio
          : '';
        const juevesEnd = schedule.schedules_per_day.jueves.enable
          ? schedule.schedules_per_day.jueves.fin
          : '';
        generateRange(juevesStart, juevesEnd, interval);

        break;
      case 'viernes':
        const viernesStart = schedule.schedules_per_day.viernes.enable
          ? schedule.schedules_per_day.viernes.inicio
          : '';
        const viernesEnd = schedule.schedules_per_day.viernes.enable
          ? schedule.schedules_per_day.viernes.fin
          : '';
        generateRange(viernesStart, viernesEnd, interval);

        break;
      case 'sabado':
        const sabadoStart = schedule.schedules_per_day.sabado.enable
          ? schedule.schedules_per_day.sabado.inicio
          : '';
        const sabadoEnd = schedule.schedules_per_day.sabado.enable
          ? schedule.schedules_per_day.sabado.fin
          : '';
        generateRange(sabadoStart, sabadoEnd, interval);

        break;
      case 'domingo':
        const domingoStart = schedule.schedules_per_day.domingo.enable
          ? schedule.schedules_per_day.domingo.inicio
          : '';
        const domingoEnd = schedule.schedules_per_day.domingo.enable
          ? schedule.schedules_per_day.domingo.fin
          : '';
        generateRange(domingoStart, domingoEnd, interval);

        break;

      default:
        break;
    }
  };

  //search schedule by bookable area
  const searchDay = () => {
    var daySelected = moment(day.dateString).locale('es');
    var result = {
      day: daySelected.format('dddd'),
      month: daySelected.format('MMM'),
    };
    const dayWeek = result.day
      .normalize('NFD')
      .replace(
        /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
        '$1',
      )
      .normalize();
    const schedule = JSON.parse(bookableArea.schedule);
    if (schedule.schedules_per_day.enable) {
      searchDayByOpeningHours(dayWeek, schedule);
    } else {
      searchDayShiftSchedule(dayWeek, schedule);
    }
  };

  // transform ranges in object
  const generateRangeHours = range => {
    const hours = [];
    for (let i = 0; i < range.length; i++) {
      const hour = range[i].split('-');
      const hourFormat = {
        starthour: hour[0],
        endhour: hour[1],
        startnumber: parseInt(hour[0]),
        endnumber: parseInt(hour[1]),
        state: false,
      };
      hours.push(hourFormat);
    }

    return hours;
  };

  //search schedule when bookable area selected is for shift schedule
  const searchDayShiftSchedule = (dayWeek, schedule) => {
    switch (dayWeek) {
      case 'lunes':
        const monShifts = schedule.shift_schedule.lunes.enable
          ? schedule.shift_schedule.lunes.shifts
          : [];
        const monHours = orderShifts(monShifts);
        filterHoursByShifts(monHours);

        break;
      case 'martes':
        const thueShifts = schedule.shift_schedule.martes.enable
          ? schedule.shift_schedule.martes.shifts
          : [];
        const thueHours = orderShifts(thueShifts);
        filterHoursByShifts(thueHours);
        break;
      case 'miercoles':
        const wendShifts = schedule.shift_schedule.miercoles.enable
          ? schedule.shift_schedule.miercoles.shifts
          : [];
        const wendHours = orderShifts(wendShifts);
        filterHoursByShifts(wendHours);
        break;
      case 'jueves':
        const thurstShifts = schedule.shift_schedule.jueves.enable
          ? schedule.shift_schedule.jueves.shifts
          : [];
        const thurstHours = orderShifts(thurstShifts);
        filterHoursByShifts(thurstHours);
        break;
      case 'viernes':
        const friShifts = schedule.shift_schedule.viernes.enable
          ? schedule.shift_schedule.viernes.shifts
          : [];
        const friHours = orderShifts(friShifts);
        filterHoursByShifts(friHours);
        break;
      case 'sabado':
        const satuShifts = schedule.shift_schedule.sabado.enable
          ? schedule.shift_schedule.sabado.shifts
          : [];
        const satuHours = orderShifts(satuShifts);
        filterHoursByShifts(satuHours);

        break;
      case 'domingo':
        const sundShifts = schedule.shift_schedule.domingo.enable
          ? schedule.shift_schedule.domingo.shifts
          : [];
        const sundHours = orderShifts(sundShifts);
        filterHoursByShifts(sundHours);
        break;

      default:
        break;
    }
  };

  // transform ranges in object
  const generateRangeHoursByShifts = range => {
    const hours = [];
    for (let i = 0; i < range.length; i++) {
      hours.push({
        starthour: range[i].starthour,
        endhour: range[i].endhour,
        startnumber: parseInt(range[i].starthour),
        endnumber: parseInt(range[i].endhour),
        state: false,
      });
    }

    return hours;
  };

  //show hours avaible
  const avaibleInfo = (events, rangeFormat) => {
    for (let i = 0; i < events.length; i++) {
      for (let j = 0; j < rangeFormat.length; j++) {
        const startBooking = moment(events[i].start).format('HH:mm');
        const finishBooking = moment(events[i].end).format('HH:mm');
        const startBookFormat = startBooking.split(':');
        const finishHourFormat = finishBooking.split(':');

        if (
          parseInt(startBookFormat[0]) <= rangeFormat[j].startnumber &&
          rangeFormat[j].startnumber < parseInt(finishHourFormat[0])
        ) {
          rangeFormat[j].state = true;

          if (rangeFormat[j].endnumber <= parseInt(finishHourFormat[0])) {
            rangeFormat[j].state = true;
          }
        }
      }
    }
    return rangeFormat;
  };
  //get range for slot list selected
  const getRange = data => {
    const times = [];
    if (data.length) {
      for (let index = 0; index < data.length; index++) {
        const time = data[index].split('-');
        times.push(parseInt(time[0]), parseInt(time[1]));
      }

      let maximum = Math.max(...times);
      let minimum = Math.min(...times);
      let result = [minimum, maximum];

      return result;
    } else {
      return times;
    }
  };

  //validate select range in list
  const betweenHours = (startHour, endHour) => {
    var ans = [];
    for (let i = startHour; i <= endHour; i++) {
      ans.push(i);
    }
    return ans;
  };

  const redirect = items => {
    const schedule = JSON.parse(bookableArea.schedule);
    const size = items.map(item => `${item.starthour} - ${item.endhour}`);
    const result = getRange(size);

    const select = betweenHours(result[0], result[1]);
    const maximuHours = bookableArea.maximum_hours_per_reservation;

    if (maximuHours === 0) {
      if (schedule.schedules_per_day.enable) {
        if (select.length - 1 > 0) {
          const start = result[0] + ':' + '00';
          const end = result[1] + ':' + '00';
          const startAmPm = day.dateString + ' ' + start;
          const endAmPm = day.dateString + ' ' + end;

          handleInfo({
            bookable_area: bookableArea,
            start: startAmPm,
            end: endAmPm,
          });
        } else {
          messageView('Debes elegir un elemento.', 'warning', 3000);
        }
      } else {
        if (size.length > 1) {
          messageView('Solo puedes elegir un turno.' + size, 'warning', 3000);
        } else {
          if (size.length === 1) {
            const hour = size[0].split('-');
            const start = hour[0];
            const end = hour[1];

            const startAmPm = day.dateString + ' ' + start;
            const endAmPm = day.dateString + ' ' + end;

            handleInfo({
              bookable_area: bookableArea,
              start: startAmPm,
              end: endAmPm,
            });
          } else {
            messageView('Debes elegir un elemento.', 'warning', 3000);
          }
        }
      }
    } else {
      if (maximuHours >= select.length - 1 && result.length > 0) {
        if (schedule.schedules_per_day.enable) {
          const start = result[0] + ':' + '00';
          const end = result[1] + ':' + '00';

          const startAmPm = day.dateString + ' ' + start;
          const endAmPm = day.dateString + ' ' + end;

          handleInfo({
            bookable_area: bookableArea,
            start: startAmPm,
            end: endAmPm,
          });
        } else {
          const hour = size[0].split('-');
          const start = hour[0];
          const end = hour[1];

          const startAmPm = day.dateString + ' ' + start;
          const endAmPm = day.dateString + ' ' + end;

          handleInfo({
            bookable_area: bookableArea,
            start: startAmPm,
            end: endAmPm,
          });
        }
      } else {
        if (schedule.schedules_per_day.enable) {
          messageView(
            'El maximo de horas para el área reservable es ' +
              maximuHours +
              ', seleccione el horario adecuado.',
            'warning',
            3000,
          );
        } else {
          messageView('Solo puedes elegir un turno.', 'warning', 3000);
        }
      }
    }
  };

  //update slot state selected
  const handleSlotSelected = item => {
    if (item.state !== undefined) {
      const selectedSlots = selected.filter(slot => item.id === slot.id);
      if (size(selectedSlots) === 0) {
        setSelected(selected => {
          const items = [...selected, item];
          redirect(items);
          return [...selected, item];
        });
      } else {
        setSelected(selected => {
          const data = [...selected.filter(slot => item.id != slot.id)];
          if (data.length > 0) {
            redirect(data);
          } else {
            handleInfo(null);
          }
          return data;
        });
      }
    } else {
      messageView(
        'La hora de momento no se encuentra disponible.',
        'warning',
        3000,
      );
    }
  };

  const EarringsHours = () => {
    const hours = [];
    const earring = allBookings.filter(
      event =>
        event.status === 'Pendiente' &&
        event.filial != null &&
        event.bookable_area != null,
    );
    for (let i = 0; i < earring.length; i++) {
      const startBooking = moment(earring[i].start).format('H:mm');
      const finishBooking = moment(earring[i].end).format('H:mm');
      const startBookFormat = startBooking.split(':');
      const finishHourFormat = finishBooking.split(':');
      hours.push({
        starthour: startBooking,
        endhour: finishBooking,
        startnumber: parseInt(startBookFormat[0]),
        endnumber: parseInt(finishHourFormat[0]),
      });
    }

    let result = hours.filter(
      (value, index, self) =>
        self.findIndex(m => m.startnumber === value.startnumber) === index,
    );
    return result;
  };

  if (loadingHours) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const handleConfirmation = (item, index) => {
    Alert.alert(
      'Información de invitado',
      `¿Desea eliminar al invitado ${item.name + ' ' + item.lastname}?`,
      [
        {text: 'Si, Eliminar', onPress: () => deleteGuest(index)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const deleteGuest = index =>
    setGuest(items => items.filter((item, i) => i !== index && item));

  return (
    <CardView style={styles.listItem} cardElevation={7} cardMaxElevation={2}>
      {size(range) > 0 ? (
        <>
          <View>
            <Text style={styles.header}>
              {moment(day.dateString).format('MMMM Do YYYY')}
            </Text>
          </View>

          <ScrollView horizontal style={{maxHeight: RFValue(50)}}>
            {range.map((item, index) => (
              <Animbutton
                key={index}
                onColor={'rgba(56, 193, 114, 0.32)'}
                effect={'pulse'}
                _onPress={() => handleSlotSelected(item)}
                text={`${item.starthour} - ${item.endhour}`}
                state={item.state}
              />
            ))}
          </ScrollView>
          {info && (
            <>
              <Text style={styles.header}>Información de reserva</Text>
              <Text style={styles.textPreview}>
                {`Inicio : `}
                <Text style={styles.text}>
                  {moment(info.start, 'YYYY-MM-DD H:mm').format('lll')}
                </Text>
              </Text>
              <Text style={styles.textPreview}>
                {`Final : `}
                <Text style={styles.text}>
                  {moment(info.end, 'YYYY-MM-DD H:mm').format('lll')}
                </Text>
              </Text>
            </>
          )}

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
          <ScrollView horizontal>
            {guest?.map((item, index) => (
              <Animbutton
                key={index}
                effect={'pulse'}
                _onPress={() => handleConfirmation(item, index)}
                text={`${item.name.substr(0, 1).toUpperCase()}.${item.lastname
                  .substr(0, 1)
                  .toUpperCase()}`}
                hours={false}
              />
            ))}
          </ScrollView>
        </>
      ) : (
        <Text>No hay campos disponibles para el día seleccionado.</Text>
      )}

      <Portal>
        <Modal
          visible={imageView}
          onDismiss={hideImage}
          contentContainerStyle={styles.containerImage}>
          {info && (
            <PreviewBooking
              navigation={navigation}
              start={info.start}
              end={info.end}
              bookable_area={info.bookable_area}
              guest={guest}
            />
          )}
        </Modal>
      </Portal>
      <Portal>
        <Modal
          visible={showGuest}
          onDismiss={hideGuest}
          contentContainerStyle={styles.containerImage}>
          <Guest setGuest={setGuest} hideGuest={hideGuest} />
        </Modal>
      </Portal>
    </CardView>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  containerButton: {
    backgroundColor: colors.white,
    marginTop: '2.5%',
  },
  listItem: {
    marginTop: '2.5%',
    padding: '2.5%',
    backgroundColor: colors.white,
  },
  containerImage: {
    backgroundColor: colors.whiteDark,
    marginHorizontal: '2.5%',
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),

    textAlign: 'center',
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    color: colors.black,
    fontSize: RFValue(12),
    fontWeight: 'normal',
  },
  textPreview: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
  },
});

export default SlotList;
