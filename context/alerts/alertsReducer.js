import {
  CLEAR_ALERTS,
  CREATE_ALERT_ERROR,
  CREATE_ALERT_SUCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case CREATE_ALERT_SUCESS:
      return {
        ...state,
        message: 'Alerta enviada exitosamente.',
      };
    case CREATE_ALERT_ERROR:
      return {
        ...state,
        error: 'No se ha podido enviar la alerta.',
      };

    case CLEAR_ALERTS:
      return {errors: [], message: null, error: null};

    default:
      break;
  }
};
