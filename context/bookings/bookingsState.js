/* eslint-disable no-misleading-character-class */
/* eslint-disable no-case-declarations */
import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import BookingContext from './bookingsContext';
import BookingReducer from './bookingsReducer';
import {v4 as uuidv4} from 'uuid';
import {
  LOAD_BOOKINGS_SUCCESS,
  LOAD_BOOKINGS_ERROR,
  CLEAR_BOOKING_ERRORS,
  LOAD_BOOKABLE_AREAS_SUCCESS,
  LOAD_BOOKABLE_AREAS_ERROR,
  LOAD_BOOKINGS_AREA_SUCESS,
  LOAD_BOOKINGS_AREA_ERROR,
  LOAD_BOOKABLE_ALL_AREAS_SUCCESS,
  LOAD_BOOKABLE_ALL_AREAS_ERROR,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_ERROR,
  SHOW_BOOKING_SUCESS,
  SHOW_INCIDENT_ERROR,
  UPDATE_BOOKING_SUCCESS,
  UPDATE_BOOKING_ERROR,
  REMOVE_GUEST_SUCCESS,
  REMOVE_GUEST_ERROR,
  UPDATE_GUEST_LIST,
  DELETE_SUCCESS_LIST,
  LOAD_HISTORY_SUCCESS,
  LOAD_HISTORY_ERROR,
  CANCEL_BOOKING_SUCESS,
  CANCEL_BOOKING_ERROR,
  CLEAR_BOOKING,
} from '../../types';

import moment from 'moment';

const BookingsState = props => {
  const initialState = {
    bookings: [],
    loading: true,
    created: false,
    edited: false,
    deleted: false,
    errors: [],
    deletedGuest: false,
    message: null,
    error: null,
    bookablesArea: [],
    loadingBookableAreas: true,
    selectedArea: null,
    bookingsArea: [],
    allBookings: [],
    rangeHours: [],
    loadingHours: true,
    booking: [],
    loadBooking: true,
    guests: [],
    history: [],
    loadingHistory: true,
  };

  const [state, dispatch] = useReducer(BookingReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  const orderShifts = data => {
    const arrayHours = [];
    for (let index = 0; index < data.length; index++) {
      arrayHours.push(data[index].inicio + ' - ' + data[index].fin);
    }

    return arrayHours;
  };

  const generateRange = (start, end, interval) => {
    const getMinutes = time => {
      var a = time.split(':').map(Number);
      return a[0] * 60 + a[1];
    };

    const getTime = m => {
      var h = (m / 60) | 0;
      m %= 60;
      return h + ':' + (m < 10 ? '0' + m : m);
    };

    var r = [],
      startM = getMinutes(start),
      endM = getMinutes(end);

    while (startM + interval <= endM) {
      r.push(getTime(startM) + ' - ' + getTime(startM + interval));
      startM += interval;
    }
    return r;
  };

  const searchDay = (day, schedule) => {
    const daySelected = moment(day.dateString).locale('es');
    const result = {
      day: daySelected.format('dddd'),
      month: daySelected.format('MMM'),
    };
    const interval = 60;

    const dayWeek = result.day
      .normalize('NFD')
      .replace(
        /([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,
        '$1',
      )
      .normalize();

    let range = [];

    if (schedule.schedules_per_day.enable) {
      switch (dayWeek) {
        case 'lunes':
          const lunesStart = schedule.schedules_per_day.lunes.enable
            ? schedule.schedules_per_day.lunes.inicio
            : '';
          const lunesEnd = schedule.schedules_per_day.lunes.enable
            ? schedule.schedules_per_day.lunes.fin
            : '';
          range = generateRange(lunesStart, lunesEnd, interval);

          break;
        case 'martes':
          const martesStart = schedule.schedules_per_day.martes.enable
            ? schedule.schedules_per_day.martes.inicio
            : '';
          const martesEnd = schedule.schedules_per_day.martes.enable
            ? schedule.schedules_per_day.martes.fin
            : '';
          range = generateRange(martesStart, martesEnd, interval);

          break;
        case 'miercoles':
          const miercolesStart = schedule.schedules_per_day.miercoles.enable
            ? schedule.schedules_per_day.miercoles.inicio
            : '';
          const miercolesEnd = schedule.schedules_per_day.miercoles.enable
            ? schedule.schedules_per_day.miercoles.fin
            : '';
          range = generateRange(miercolesStart, miercolesEnd, interval);

          break;
        case 'jueves':
          const juevesStart = schedule.schedules_per_day.jueves.enable
            ? schedule.schedules_per_day.jueves.inicio
            : '';
          const juevesEnd = schedule.schedules_per_day.jueves.enable
            ? schedule.schedules_per_day.jueves.fin
            : '';
          range = generateRange(juevesStart, juevesEnd, interval);

          break;
        case 'viernes':
          const viernesStart = schedule.schedules_per_day.viernes.enable
            ? schedule.schedules_per_day.viernes.inicio
            : '';
          const viernesEnd = schedule.schedules_per_day.viernes.enable
            ? schedule.schedules_per_day.viernes.fin
            : '';
          range = generateRange(viernesStart, viernesEnd, interval);

          break;
        case 'sabado':
          const sabadoStart = schedule.schedules_per_day.sabado.enable
            ? schedule.schedules_per_day.sabado.inicio
            : '';
          const sabadoEnd = schedule.schedules_per_day.sabado.enable
            ? schedule.schedules_per_day.sabado.fin
            : '';
          range = generateRange(sabadoStart, sabadoEnd, interval);

          break;
        case 'domingo':
          const domingoStart = schedule.schedules_per_day.domingo.enable
            ? schedule.schedules_per_day.domingo.inicio
            : '';
          const domingoEnd = schedule.schedules_per_day.domingo.enable
            ? schedule.schedules_per_day.domingo.fin
            : '';
          range = generateRange(domingoStart, domingoEnd, interval);

          break;

        default:
      }
    } else {
      switch (dayWeek) {
        case 'lunes':
          const monShifts = schedule.shift_schedule.lunes.enable
            ? schedule.shift_schedule.lunes.shifts
            : [];
          range = orderShifts(monShifts);

          break;
        case 'martes':
          const thueShifts = schedule.shift_schedule.martes.enable
            ? schedule.shift_schedule.martes.shifts
            : [];
          range = orderShifts(thueShifts);

          break;
        case 'miercoles':
          const wendShifts = schedule.shift_schedule.miercoles.enable
            ? schedule.shift_schedule.miercoles.shifts
            : [];
          range = orderShifts(wendShifts);

          break;
        case 'jueves':
          const thurstShifts = schedule.shift_schedule.jueves.enable
            ? schedule.shift_schedule.jueves.shifts
            : [];
          range = orderShifts(thurstShifts);

          break;
        case 'viernes':
          const friShifts = schedule.shift_schedule.viernes.enable
            ? schedule.shift_schedule.viernes.shifts
            : [];
          range = orderShifts(friShifts);

          break;
        case 'sabado':
          const satuShifts = schedule.shift_schedule.sabado.enable
            ? schedule.shift_schedule.sabado.shifts
            : [];
          range = orderShifts(satuShifts);

          break;
        case 'domingo':
          const sundShifts = schedule.shift_schedule.domingo.enable
            ? schedule.shift_schedule.domingo.shifts
            : [];
          range = orderShifts(sundShifts);

          break;

        default:
        // console.log('.');
        // alert('Seleccione una fecha')
      }

      //console.log(schedule);
    }

    return range;
  };

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

  const rangeHours = range => {
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

  const EarringsHours = bookings => {
    const hours = [];
    const earring = bookings.filter(
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

  const filterHours = (hours, bookings) => {
    const events = bookings.filter(
      event => event.status === 'Aprobada' || event.status === 'Pendiente',
    );

    const rangeFormat = rangeHours(hours);
    const data = avaibleInfo(events, rangeFormat);

    var filterData = data.filter(item => item.state === false);
    const earring = EarringsHours(bookings);

    if (earring.length > 0) {
      filterData = filterData.concat(earring);
    }

    //console.log(filterData);

    return filterData.sort((a, b) => (a.startnumber < b.startnumber ? -1 : 1));
  };

  //load bookings from user
  const loadBookingsWeek = async () => {
    try {
      const res = await Request.get('/owner/bookings/week', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_BOOKINGS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_BOOKINGS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load bookings from user
  const loadBookingsYear = async () => {
    try {
      const res = await Request.get('/owner/bookings/year', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_BOOKINGS_SUCCESS,
        payload: res?.data?.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_BOOKINGS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load bookings from user
  const loadBookableAreas = async () => {
    try {
      const res = await Request.get('/owner/bookable-areas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_BOOKABLE_AREAS_SUCCESS,
        payload: res.data.data.filter(item => item.available === 0),
      });
    } catch (error) {
      dispatch({
        type: LOAD_BOOKABLE_AREAS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load history bookings from user
  const loadHistoryBookings = async () => {
    try {
      const res = await Request.get('/owner/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_HISTORY_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_HISTORY_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load bookings from bookable area
  const loadBookingsForArea = async id => {
    const actual = moment().toDate();
    const day = moment(actual).format('YYYY-MM-DD');

    try {
      const res = await Request.get(`/owner/bookings/full/${id}/${day}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Retry-After': 120,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_BOOKINGS_AREA_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_BOOKINGS_AREA_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load bookings from bookable area
  const loadAllsBookings = async (id, day, schedule) => {
    const dayFormat = moment(day).format('YYYY-MM-DD HH:mm:ss');
    try {
      const res = await Request.get(`/owner/bookings/all/${dayFormat}/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const data = res.data.data || [];

      const bookings = data.filter(
        booking => booking.filial != null && booking.bookable_area != null,
      );

      dispatch({
        type: LOAD_BOOKABLE_ALL_AREAS_SUCCESS,
        payload: bookings,
      });
    } catch (error) {
      dispatch({
        type: LOAD_BOOKABLE_ALL_AREAS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //create booking
  const createBooking = async data => {
    try {
      const res = await Request.post('/owner/bookings', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: CREATE_BOOKING_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_BOOKING_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //show especific booking by id

  //show incident by id
  const showBooking = async id => {
    try {
      const res = await Request.get(`/owner/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: SHOW_BOOKING_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: SHOW_INCIDENT_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  const clearErrors = () => {
    dispatch({
      type: CLEAR_BOOKING_ERRORS,
      payload: [],
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_BOOKING,
      payload: [],
    });
  };

  //Update especific pet
  const updateBooking = async (id, data) => {
    try {
      const res = await Request.post(`/owner/bookings/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: UPDATE_BOOKING_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_BOOKING_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //delete pet from user
  const cancelBooking = async id => {
    try {
      await Request.delete(`/owner/bookings/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: CANCEL_BOOKING_SUCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: CANCEL_BOOKING_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //update guest list

  const updateGuestList = async data => {
    dispatch({
      type: UPDATE_GUEST_LIST,
      payload: data,
    });
  };

  //delete pet from user
  const removeLocalElement = async id => {
    dispatch({
      type: DELETE_SUCCESS_LIST,
      payload: id,
    });
  };

  //remove guest from booking
  const removeGuest = async id => {
    try {
      await Request.delete(`/owner/authorizations/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: REMOVE_GUEST_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: REMOVE_GUEST_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  return (
    <BookingContext.Provider
      value={{
        bookings: state.bookings,
        loading: state.loading,
        errors: state.errors,
        created: state.created,
        edited: state.edited,
        deleted: state.deleted,
        deletedGuest: state.deletedGuest,
        message: state.message,
        error: state.error,
        loadingBookableAreas: state.loadingBookableAreas,
        bookablesArea: state.bookablesArea,
        selectedArea: state.selectedArea,
        bookingsArea: state.bookingsArea,
        allBookings: state.allBookings,
        loadingHours: state.loadingHours,
        booking: state.booking,
        loadBooking: state.loadBooking,
        guests: state.guests,
        history: state.history,
        loadingHistory: state.loadingHistory,
        showBooking,
        dispatch,
        loadBookingsWeek,
        loadBookingsYear,
        clearErrors,
        loadBookableAreas,
        loadBookingsForArea,
        loadAllsBookings,
        createBooking,
        removeGuest,
        updateGuestList,
        updateBooking,
        removeLocalElement,
        loadHistoryBookings,
        cancelBooking,
        clear,
      }}>
      {props.children}
    </BookingContext.Provider>
  );
};

export default BookingsState;
