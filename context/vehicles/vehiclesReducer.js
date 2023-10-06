import {
  LOAD_VEHICLES_SUCCESS,
  LOAD_VEHICLES_ERROR,
  UPDATE_VEHICLES_SUCCESS,
  UPDATE_VEHICLES_ERROR,
  CLEAR_VEHICLES,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_VEHICLES_SUCCESS:
      return {
        ...state,
        vehicles: action.payload,
        loading: false,
      };
    case LOAD_VEHICLES_ERROR:
      return {
        ...state,
        loading: false,
        error: 'No se ha podido obtener los vehiculos',
        message: null,
      };

    case UPDATE_VEHICLES_SUCCESS:
      return {
        ...state,
        loading: true,
        edited: true,
        created: false,
        vehicles: action.payload,
        message: 'Vehículo guardado exitosamente.',
        error: null,
      };

    case UPDATE_VEHICLES_ERROR:
      return {
        ...state,
        loading: false,
        created: false,
        edited: false,
        errors: action.payload,
        error: 'Ha ocurrido un error actualizando.',
        message: null,
      };
    case CLEAR_VEHICLES:
      return {
        ...state,
        // vehicles: [],
        loading: true,
        errors: [],
        message: null,
        error: null,
        created: false,
        edited: false,
      };
    default:
      break;
  }
};
