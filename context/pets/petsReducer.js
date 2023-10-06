import {
  LOAD_PETS_SUCESS,
  LOAD_PETS_ERROR,
  CREATE_PET_ERROR,
  CREATE_PET_SUCCESS,
  CLEAR_PET_ERRORS,
  UPDATE_PET_SUCCESS,
  UPDATE_PET_ERROR,
  DELETE_PET_SUCCESS,
  CREATE_ALERT_PET_SUCESS,
  CREATE_ALERT_PET_ERROR,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_PETS_SUCESS:
      return {
        ...state,
        pets: action.payload,
        loading: false,
      };
    case LOAD_PETS_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener las mascotas',
        message: null,
      };

    case CLEAR_PET_ERRORS:
      return {
        ...state,
        errors: action.payload,
        created: false,
        edited: false,
        deleted: false,
        message: null,
        error: null,
      };

    case CREATE_PET_SUCCESS:
      return {
        ...state,
        pets: [...state.pets.data, action.payload],
        created: true,
        loading: true,
        message: 'Se ha guardado la mascota con éxito.',
      };
    case CREATE_PET_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'Ha ocurrido un error guardando.',
        message: null,
        created: false,
        edited: false,
      };

    case UPDATE_PET_SUCCESS:
      return {
        ...state,
        loading: true,
        edited: true,
        created: false,
        message: 'Se ha actualizado la mascota con éxito.',
        pets:
          state.pets.data != undefined
            ? state.pets.data.map(pet =>
                pet.id === action.payload.id ? action.payload : pet,
              )
            : [],
      };

    case UPDATE_PET_ERROR:
      return {
        ...state,
        loading: false,
        created: false,
        edited: false,
        errors: action.payload,
        error: 'Ha ocurrido un error actualizando.',
        message: null,
      };

    // case DELETE_PET_ERROR :
    case DELETE_PET_SUCCESS:
      return {
        ...state,
        pets: state.pets.data.filter(pet => pet.id !== action.payload),
        loading: true,
        deleted: true,
        message: 'Se ha eliminado la mascota exitosamente.',
      };

    case CREATE_ALERT_PET_SUCESS:
      return {
        ...state,
        message: 'Se ha enviado la alerta exitosamente.',
      };

    case CREATE_ALERT_PET_ERROR:
      return {
        ...state,
        message: 'No se ha podido enviar la alerta.',
      };

    default:
      break;
  }
};
