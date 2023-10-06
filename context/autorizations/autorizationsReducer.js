import {
  LOAD_AUTORIZATIONS_SUCCESS,
  LOAD_AUTORIZATIONS_ERRORS,
  LOAD_OLD_AUTORIZATIONS_SUCCESS,
  LOAD_OLD_AUTORIZATIONS_ERRORS,
  CLEAR_AUTORIZATIONS,
  DELETE_AUTORIZATIONS_SUCCESS,
  DELETE_AUTORIZATIONS_ERROR,
  UPDATE_AUTORIZATIONS_SUCCESS,
  UPDATE_AUTORIZATIONS_ERROR,
  CREATE_AUTORIZATIONS_SUCCESS,
  CREATE_AUTORIZATIONS_ERROR,
  LOAD_SUBSIDIARY_SUCCESS,
  LOAD_SUBSIDIARY_ERROR,
  SEND_AUTORIZATIONS_QR_SUCCESS,
  SEND_AUTORIZATIONS_QR_ERRORS,
  CREATE_CODE_SUCCESS,
  CREATE_CODE_ERROR,
  CLEAR_CODE_MESSAGES,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_AUTORIZATIONS_SUCCESS:
      return {
        ...state,
        temps: action.title === 'Temporal' ? action.payload : state.temps,
        permanents:
          action.title === 'Permanente' ? action.payload : state.permanents,
        services:
          action.title === 'Servicios' ? action.payload : state.services,
        loading: false,
      };
    case LOAD_AUTORIZATIONS_ERRORS:
      return {
        ...state,
        error: 'No se han podido obtener los autorizados.',
      };

    case LOAD_OLD_AUTORIZATIONS_SUCCESS:
      return {
        ...state,
        oldAutorizations: action.payload,
        loading: false,
      };
    case LOAD_OLD_AUTORIZATIONS_ERRORS:
      return {
        ...state,
        error: 'No se ha podido obtener los autorizados.',
      };

    case LOAD_SUBSIDIARY_SUCCESS:
      return {
        ...state,
        subsidiarys: action.payload,
        loading: false,
      };
    case LOAD_SUBSIDIARY_ERROR:
      return {
        ...state,
        error: 'No se ha podido obtener las filiales.',
      };

    case SEND_AUTORIZATIONS_QR_SUCCESS:
      return {
        ...state,
        send: true,
        message: 'Código QR enviado exitosamente.',
      };
    case SEND_AUTORIZATIONS_QR_ERRORS:
      return {
        ...state,
        error: action.payload,
        send: false,
      };

    case UPDATE_AUTORIZATIONS_SUCCESS:
      return {
        ...state,
        edited: true,
        loading: true,
        message: 'Autorizado actualizado exitosamente.',
      };
    case UPDATE_AUTORIZATIONS_ERROR:
      return {
        ...state,
        error: 'No se ha podido actualizar el autorizado.',
        errors: action.payload,
      };
    case CREATE_AUTORIZATIONS_SUCCESS:
      return {
        ...state,
        created: true,
        loading: true,
        message: 'Autorizado creado exitosamente.',
      };
    case CREATE_AUTORIZATIONS_ERROR:
      return {
        ...state,
        error: 'No se ha podido crear el autorizado.',
        errors: action.payload,
      };
    case DELETE_AUTORIZATIONS_SUCCESS:
      return {
        ...state,
        loading: true,
        deleted: true,
        message: 'Se ha eliminado el autorizado exitosamente.',
      };
    case DELETE_AUTORIZATIONS_ERROR:
      return {
        ...state,
        error: 'No se ha podido eliminar el autorizado.',
      };

    case CREATE_CODE_SUCCESS:
      return {
        ...state,
        code: action.payload,
        message: 'Código de autorizado generado exitosamente.',
      };
    case CREATE_CODE_ERROR:
      return {
        ...state,
        error: 'No se ha podido generar el código de autorizado.',
      };

    case CLEAR_AUTORIZATIONS:
      return {
        temps: [],
        permanents: [],
        services: [],
        oldAutorizations: [],
        subsidiarys: [],
        loading: true,
        errors: [],
        message: null,
        error: null,
        edited: false,
        created: false,
        deleted: false,
        send: false,
        code: null,
      };

    case CLEAR_CODE_MESSAGES:
      return {
        ...state,
        message: null,
        error: null,
      };

    default:
      break;
  }
};
