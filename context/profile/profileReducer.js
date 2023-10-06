import {
  CLEAR_PROFILE,
  GET_PROFILE_ERROR,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        loading: true,
        edited: true,
        profile: action.payload,
        error: null,
        message: 'Perfil actualizado con éxito.',
      };

    case UPDATE_PROFILE_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido actualizar el perfil',
        message: null,
        loading: false,
        edited: false,
      };
    case CLEAR_PROFILE:
      return {
        ...state,
        // profile: null,
        loading: true,
        errors: [],
        edited: false,
        message: null,
        error: null,
      };
    case GET_PROFILE_SUCCESS:
      return {...state, profile: action.payload, loading: false};
    case GET_PROFILE_ERROR:
      return {...state, error: action.payload, message: null, loading: false};
    default:
      break;
  }
};
