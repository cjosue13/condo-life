import {
  LOAD_OWNERS_SUCCESS,
  LOAD_OWNERS_ERROR,
  CLEAR_OWNERS,
  CREATE_OWNERS_ERROR,
  CREATE_OWNERS_SUCCESS,
  CLEAR_OWNERS_ERRORS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_OWNERS_SUCCESS:
      return {
        ...state,
        owners: action.payload,
        loading: false,
      };
    case LOAD_OWNERS_ERROR:
      return {
        ...state,
        message: 'No se ha podido obtener los propietarios',
      };

    case CREATE_OWNERS_SUCCESS:
      return {
        ...state,
        owners: [...state.owners, action.payload],
        loading: true,
        created: true,
        errors: [],
        edited: false,
        deleted: false,
        error: null,
        message: 'Solicitud enviada con éxito',
      };

    case CREATE_OWNERS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido crear el propietario',
        message: null,
      };
    case CLEAR_OWNERS:
      return {
        owners: [],
        loading: true,
        created: false,
        errors: [],
        edited: false,
        deleted: false,
        message: null,
        error: null,
      };

    case CLEAR_OWNERS_ERRORS:
      return {
        ...state,
        error: null,
        message: null,
      };

    default:
      break;
  }
};
