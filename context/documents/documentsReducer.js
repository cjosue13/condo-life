import {
  DOCUMENTS_CLEAR,
  LOAD_DOCUMENTS_CATEGORIES_ERROR,
  LOAD_DOCUMENTS_CATEGORIES_SUCCESS,
  LOAD_DOCUMENTS_ERRORS,
  LOAD_DOCUMENTS_SUCCESS,
  LOAD_LINKS_ERROR,
  LOAD_LINKS_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOAD_DOCUMENTS_SUCCESS:
      return {
        ...state,
        documents: action.payload,
        loading: false,
      };
    case LOAD_DOCUMENTS_ERRORS:
      return {
        ...state,
        error: 'No se han podido obtener los documentos.',
      };

    case LOAD_DOCUMENTS_CATEGORIES_SUCCESS:
      return {
        ...state,
        documentCategories: action.payload,
        loading: false,
      };
    case LOAD_DOCUMENTS_CATEGORIES_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener las categorías de documentos.',
      };
    case LOAD_LINKS_SUCCESS:
      return {
        ...state,
        links: action.payload,
        loading: false,
      };
    case LOAD_LINKS_ERROR:
      return {
        ...state,
        error: 'No se han podido obtener los documentos.',
      };
    case DOCUMENTS_CLEAR:
      return {
        documents: [],
        links: [],
        loading: true,
        errors: [],
        message: null,
        error: null,
        documentCategories: [],
      };

    default:
      break;
  }
};
