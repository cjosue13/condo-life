import {
  LOAD_TENANTS_SUCCESS,
  LOAD_TENANTS_ERROR,
  CREATE_TENANTS_ERROR,
  CLEAR_TENANTS_ERRORS,
  CREATE_TENANTS_SUCCESS,
  CLEAR_TENANTS,
  DELETE_TENANTS_SUCCESS,
  UPDATE_TENANTS_ERROR,
  UPDATE_TENANTS_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: action.payload,
        loading: false,
      };
    case LOAD_TENANTS_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener los inquilinos',
      };

    case CREATE_TENANTS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido crear el inquilino',
        message: null,
      };

    case CLEAR_TENANTS_ERRORS:
      return {
        ...state,
        // errors: action.payload,
        error: null,
        message: null,
      };

    case CREATE_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: [...state.tenants, action.payload],
        loading: true,
        created: true,
        errors: [],
        edited: false,
        deleted: false,
        error: null,
        message: 'Inquilino guardado con éxito',
      };

    case DELETE_TENANTS_SUCCESS:
      return {
        ...state,
        tenants: state.tenants.filter(tenant => tenant.id !== action.payload),
        loading: true,
        deleted: true,
        message: 'Se ha eliminado el inquilino exitosamente.',
      };

    case UPDATE_TENANTS_SUCCESS:
      return {
        ...state,
        loading: true,
        edited: true,
        created: false,
        message: 'Inquilino actualizado con éxito',
        tenants: state.tenants
          ? state.tenants.map(tenant =>
              tenant.id === action.payload.id ? action.payload : tenant,
            )
          : [],
      };

    case UPDATE_TENANTS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido actualizar el usuario',
        message: null,
        loading: false,
        edited: false,
      };
    case CLEAR_TENANTS:
      return {
        ...state,
        loading: true,
        created: false,
        errors: [],
        edited: false,
        deleted: false,
        message: null,
        error: null,
      };

    default:
      break;
  }
};
