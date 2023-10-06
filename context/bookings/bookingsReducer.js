import {
  LOAD_BOOKINGS_SUCCESS,
  LOAD_BOOKABLE_AREAS_SUCCESS,
  LOAD_BOOKABLE_AREAS_ERROR,
  LOAD_BOOKINGS_AREA_SUCESS,
  LOAD_BOOKINGS_AREA_ERROR,
  LOAD_BOOKABLE_ALL_AREAS_SUCCESS,
  LOAD_BOOKABLE_ALL_AREAS_ERROR,
  GENERATE_RANGE_HOURS,
  CREATE_BOOKING_SUCCESS,
  CREATE_BOOKING_ERROR,
  CLEAR_BOOKING_ERRORS,
  SHOW_BOOKING_SUCESS,
  SHOW_BOOKING_ERROR,
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
  LOAD_BOOKINGS_ERROR,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_BOOKINGS_SUCCESS:
      return {
        ...state,
        bookings: action.payload,
        loading: false,
      };

    case LOAD_BOOKINGS_ERROR:
      return {
        ...state,
        message: 'Ha ocurrido un error.',
        loading: false,
      };

    case LOAD_BOOKABLE_AREAS_SUCCESS: {
      return {
        ...state,
        bookablesArea: action.payload,
        loadingBookableAreas: false,
      };
    }

    case LOAD_BOOKINGS_AREA_SUCESS: {
      return {
        ...state,
        loading: false,
        created: false,
        edited: false,
        deleted: false,
        bookingsArea: action.payload,
      };
    }

    case CREATE_BOOKING_SUCCESS: {
      return {
        ...state,
        loading: true,
        created: true,
        message: 'Se ha creado la reserva exitosamente.',
      };
    }
    case CREATE_BOOKING_ERROR: {
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido realizar la reserva',
        created: false,
      };
    }

    case LOAD_BOOKINGS_AREA_ERROR: {
      return {
        ...state,
        loading: false,
        created: false,
        edited: false,
        deleted: false,
      };
    }

    case CLEAR_BOOKING_ERRORS: {
      return {
        ...state,
        created: false,
        message: null,
        deletedGuest: false,
        edited: false,
        error: null,
        loadingHours: true,
      };
    }

    case CLEAR_BOOKING:
      return {
        bookings: [],
        loading: true,
        created: false,
        deleted: false,
        errors: [],
        edited: false,
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

    case LOAD_BOOKABLE_ALL_AREAS_SUCCESS: {
      return {
        ...state,
        allBookings: action.payload,
        loadingHours: false,
      };
    }

    case LOAD_BOOKABLE_ALL_AREAS_ERROR: {
      return {
        ...state,
        loadingHours: false,
      };
    }

    case SHOW_BOOKING_SUCESS: {
      return {
        ...state,
        booking: action.payload,
        loadBooking: false,
        guests: state.guests.length > 0 ? state.guests : action.payload.guests,
      };
    }

    case SHOW_BOOKING_ERROR: {
      return {
        ...state,
        message: action.payload,
        loadBooking: false,
      };
    }

    case REMOVE_GUEST_SUCCESS: {
      return {
        ...state,
        // guests: state.guests.filter(guests => guests.id !== action.payload),
        message: 'Se ha eliminado el autorizado exitosamente.',
        deleted: true,
        loadBooking: true,
        deletedGuest: true,
      };
    }

    case DELETE_SUCCESS_LIST: {
      return {
        ...state,
        guests: state.guests.filter(guests => guests.id !== action.payload),
      };
    }

    case UPDATE_GUEST_LIST: {
      return {
        ...state,
        guests: state.guests.concat(action.payload),
        //message: 'Se ha actualizado el registro exitosamente',
      };
    }

    case UPDATE_BOOKING_SUCCESS: {
      return {
        ...state,
        loading: true,
        edited: true,
        message: 'Se ha actualizado el registro exitosamente.',
      };
    }
    case UPDATE_BOOKING_ERROR: {
      return {
        ...state,
        message: 'No se ha  podido actualizar el registro.',
      };
    }

    case REMOVE_GUEST_ERROR: {
      return {
        ...state,
        message: 'No se ha podido eliminar el registro.',
      };
    }

    case GENERATE_RANGE_HOURS: {
      return {
        ...state,
        rangeHours: action.payload,
      };
    }

    case LOAD_HISTORY_SUCCESS: {
      return {
        ...state,
        history: action.payload,
        loading: false,
      };
    }
    case LOAD_HISTORY_ERROR: {
      return {
        ...state,
        loading: false,
      };
    }
    case CANCEL_BOOKING_SUCESS: {
      return {
        ...state,
        message: 'Se ha cancelado la reserva exitosamente.',
        loading: true,
        deleted: true,
      };
    }
    case CANCEL_BOOKING_ERROR: {
      return {
        ...state,
        message: 'No se ha podido cancelar la reserva.',
        loading: true,
      };
    }

    default:
      break;
  }
};
