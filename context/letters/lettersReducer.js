import {
  LOAD_LETTERS_SUCCESS,
  LOAD_LETTERS_ERROR,
  LOAD_ADMINS_SUCCESS,
  LOAD_ADMINS_ERROR,
  CREATE_LETTERS_SUCCESS,
  CREATE_LETTERS_ERROR,
  CLEAR_LETTERS,
  LOAD_LETTERS_SENT_SUCCESS,
  LOAD_LETTERS_SENT_ERROR,
  LOAD_LETTER_SUCCESS,
  LOAD_LETTER_ERROR,
  LOAD_MESSAGES_SUCCESS,
  LOAD_MESSAGES_ERROR,
  CREATE_REPLY_ERROR,
  CREATE_REPLY_SUCCESS,
  CLEAR_LETTERS_OPTIONS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_LETTERS_SUCCESS:
      return {
        ...state,
        loading: false,
        letters: action.payload,
      };
    case LOAD_LETTERS_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener los comunicados',
      };
    case LOAD_LETTER_SUCCESS:
      return {
        ...state,
        loading: false,
        letter: action.payload.letter,
        reponsesLetter: action.payload.reponsesLetter,
        ready: action.payload.ready,
      };
    case LOAD_LETTER_ERROR:
      return {
        ...state,
        loading: false,
        error: 'No se han podido obtener el comunicado',
      };

    case LOAD_LETTERS_SENT_SUCCESS:
      return {
        ...state,
        loading: false,
        lettersCategories: action.payload,
      };
    case LOAD_LETTERS_SENT_ERROR:
      return {
        ...state,
        loading: false,
        error: 'No se han podido obtener los administradores',
      };
    case LOAD_ADMINS_SUCCESS:
      return {
        ...state,
        admins: action.payload,
      };
    case LOAD_ADMINS_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener los administradores',
      };
    case LOAD_MESSAGES_SUCCESS:
      return {
        ...state,
        loading: false,
        messages: action.payload,
      };
    case LOAD_MESSAGES_ERROR:
      return {
        ...state,
        loading: false,
        error: 'No se han podido obtener los mensajes',
      };

    case CREATE_LETTERS_SUCCESS:
      return {
        ...state,
        created: true,
        edited: false,
        loading: true,
        message: 'Se ha enviado el comunicado con éxito.',
      };
    case CREATE_LETTERS_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'Ha ocurrido un error enviando el comunicado.',
        message: null,
        created: false,
        edited: false,
      };

    case CREATE_REPLY_SUCCESS:
      return {
        ...state,
        created: true,
        edited: false,
        // loading: true,
        messages: [...state.messages, action.payload],
        message: 'Se ha enviado la respuesta con éxito.',
      };
    case CREATE_REPLY_ERROR:
      return {
        ...state,
        errors: action.payload,
        error: 'Ha ocurrido un error enviando la respuesta.',
        message: null,
        created: false,
        edited: false,
      };

    case CLEAR_LETTERS:
      return {
        loading: true,
        letters: [],
        errors: [],
        created: false,
        edited: false,
        message: null,
        error: null,
        lettersCategories: [],
        fromLetters: [],
        ready: [],
        admins: [],
        letter: null,
        reponsesLetter: [],
        messages: [],
      };

    case CLEAR_LETTERS_OPTIONS:
      return {
        ...state,
        created: false,
        edited: false,
        message: null,
        error: null,
        errors: [],
      };

    default:
      break;
  }
};
