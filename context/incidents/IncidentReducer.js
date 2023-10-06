import {
  LOAD_INCIDENTS_SUCESS,
  LOAD_INCIDENTS_ERROR,
  CREATE_INCIDENT_ERROR,
  CREATE_INCIDENT_SUCCESS,
  CLEAR_INCIDENT_ERRORS,
  SHOW_INCIDENT_SUCCESS,
  SHOW_INCIDENT_ERROR,
  CREATE_COMMENT_SUCESS,
  CREATE_PET_ERROR,
  DELETE_PET_SUCCESS,
  DELETE_COMMENT_ERROR,
  CREATE_COMMENT_ERROR,
  DELETE_COMMENT_SUCESS,
  UPDATE_INCIDENT_SUCCESS,
  UPDATE_INCIDENT_ERROR,
  CLEAR_INCIDENTS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_INCIDENTS_SUCESS:
      return {
        ...state,
        incidents: action.payload,
        loading: false,
      };
    case LOAD_INCIDENTS_ERROR:
      return {
        ...state,
      };

    case CREATE_INCIDENT_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'No se ha podido crear la incidencia.',
      };

    case SHOW_INCIDENT_SUCCESS: {
      return {
        ...state,
        incident: action.payload,
        loadComments: false,
      };
    }

    case SHOW_INCIDENT_ERROR: {
      return {
        ...state,
        message: action.payload,
        loadComments: false,
      };
    }

    case CREATE_COMMENT_SUCESS: {
      return {
        ...state,
        createdComment: true,
        loadComments: true,
        message: 'Se ha creado el comentario exitosamente.',
      };
    }

    case CREATE_COMMENT_ERROR: {
      return {
        ...state,
        message: action.payload,
        createdComment: false,
      };
    }

    case DELETE_COMMENT_SUCESS: {
      return {
        ...state,
        message: 'Se ha eliminado el comentario exitosamente.',
        loadComments: true,
      };
    }

    case DELETE_COMMENT_ERROR: {
      return {
        ...state,
        message: action.payload,
        loadComments: false,
      };
    }

    case CLEAR_INCIDENT_ERRORS:
      return {
        ...state,
        errors: action.payload,
        createdComment: false,
        created: false,
        message: '',
      };

    case CREATE_INCIDENT_SUCCESS:
      return {
        ...state,
        incidents: [...state.incidents.data, action.payload],
        created: true,
        loading: true,
        message: 'Se ha creado la incidencia exitosamente.',
      };

    case UPDATE_INCIDENT_SUCCESS: {
      return {
        ...state,
        incident: action.payload,
        message: 'Se ha enviado la calificación correctamente.',
        loadComments: true,
      };
    }

    case UPDATE_INCIDENT_ERROR: {
      return {
        ...state,
        message: action.payload,
        loadComments: false,
      };
    }

    case CLEAR_INCIDENTS:
      return {
        ...state, 
        incidents: null,
        // incident: null,
        loading: true,
        created: false,
        error: null,
        errors: [],
        message: null,
        createdComment: false,
        loadComments: true,
      };

    default:
      break;
  }
};
