import {
  LOAD_CONTACT_SUCCESS,
  LOAD_CONTACT_ERROR,
  CLEAR_PET_ERRORS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_CONTACT_SUCCESS:
      return {
        ...state,
        contacts: action.payload,
        loading: false,
      };
    case LOAD_CONTACT_ERROR:
      return {
        ...state,
        message: 'No se ha podido obtener los contactos',
      };

    case CLEAR_PET_ERRORS:
      return {
        ...state,
        errors: action.payload,
        created: false,
        edited: false,
        deleted: false,
      };

    default:
      break;
  }
};
