import {
  LOAD_VOTINGS_SUCCESS,
  LOAD_VOTINGS_ERRORS,
  CLEAR_VOTINGS_ERROR,
  CLEAR_VOTINGS,
  CREATE_VOTINGS_SUCCESS,
  CREATE_VOTINGS_ERROR,
  LOAD_QUESTIONS_SUCCESS,
  LOAD_QUESTIONS_ERROR,
  CREATE_ANSWERS_SUCCESS,
  CREATE_ANSWERS_ERROR,
  LOAD_RESULTS_ERROR,
  LOAD_RESULTS_SUCCESS,
  LOAD_CHARTS_SUCCESS,
  LOAD_CHARTS_ERROR,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_VOTINGS_SUCCESS:
      return {
        ...state,
        votings: action.payload,
        loading: false,
      };
    case LOAD_VOTINGS_ERRORS:
      return {
        ...state,
        error: 'No se ha podido obtener las votaciones.',
      };

    case LOAD_RESULTS_SUCCESS:
      return {
        ...state,
        results: action.payload,
        loading: false,
      };
    case LOAD_RESULTS_ERROR:
      return {
        ...state,
        error: 'No se ha podido obtener las votaciones.',
      };

    case LOAD_CHARTS_SUCCESS:
      return {
        ...state,
        charts: action.payload,
        loading: false,
      };
    case LOAD_CHARTS_ERROR:
      return {
        ...state,
        error: 'No se ha podido obtener las votaciones.',
      };

    case LOAD_QUESTIONS_SUCCESS:
      return {
        ...state,
        questions: action.payload,
        loading: false,
      };
    case LOAD_QUESTIONS_ERROR:
      return {
        ...state,
        error: 'No se ha podido obtener las preguntas.',
      };

    case CREATE_VOTINGS_SUCCESS:
      return {
        ...state,
        created: true,
        loading: true,
        message: 'Se ha creado el votante con éxito.',
      };
    case CREATE_VOTINGS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'Ha ocurrido un error guardando el votante.',
        message: null,
        created: false,
      };

    case CREATE_ANSWERS_SUCCESS:
      return {
        ...state,
        answer_created: true,
        loading: true,
        message: 'Se ha creado la respuesta con éxito.',
      };
    case CREATE_ANSWERS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'Ha ocurrido un error guardando la respuesta.',
        message: null,
        created: false,
      };

    case CLEAR_VOTINGS_ERROR:
      return {
        ...state,
        errors: [],
        error: null,
      };

    case CLEAR_VOTINGS:
      return {
        votings: [],
        questions: [],
        results: [],
        charts: [],
        loading: true,
        errors: [],
        message: null,
        error: null,
        created: false,
        answer_created: false,
      };
    default:
      break;
  }
};
