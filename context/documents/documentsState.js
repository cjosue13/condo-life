import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import DocumentsContext from './documentsContext';
import DocumentsReducer from './documentsReducer';
import {
  DOCUMENTS_CLEAR,
  LOAD_DOCUMENTS_CATEGORIES_ERROR,
  LOAD_DOCUMENTS_CATEGORIES_SUCCESS,
  LOAD_DOCUMENTS_ERRORS,
  LOAD_DOCUMENTS_SUCCESS,
  LOAD_LINKS_ERROR,
  LOAD_LINKS_SUCCESS,
} from '../../types';

const documentsState = props => {
  const initialState = {
    documents: [],
    links: [],
    loading: true,
    errors: [],
    message: null,
    error: null,
    documentCategories: [],
  };

  const [state, dispatch] = useReducer(DocumentsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  const loadCategories = async () => {
    try {
      const res = await Request.get('/owner/documents/categories', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const data = res.data.data || [];
      data.push({name: 'Sin clasificar', id: -1});

      dispatch({
        type: LOAD_DOCUMENTS_CATEGORIES_SUCCESS,
        payload: res.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_DOCUMENTS_CATEGORIES_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const showDocuments = async id => {
    try {
      const res = await Request.get('/owner/documents/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_DOCUMENTS_SUCCESS,
        payload: res.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_DOCUMENTS_ERRORS,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load documents from user
  const loadDocuments = async categorie => {
    try {
      const res = await Request.get('/owner/documents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const data = res.data.data || [];

      const filter =
        categorie.id !== -1
          ? data.filter(item => item.categorie_id === categorie.id)
          : data.filter(item => item.categorie_id === null);

      dispatch({
        type: LOAD_DOCUMENTS_SUCCESS,
        payload: filter,
      });
    } catch (error) {
      dispatch({
        type: LOAD_DOCUMENTS_ERRORS,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadLinks = async () => {
    try {
      const res = await Request.get('/owner/links', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_LINKS_SUCCESS,
        payload: res.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_LINKS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  const clear = () => {
    dispatch({
      type: DOCUMENTS_CLEAR,
      payload: [],
    });
  };

  return (
    <DocumentsContext.Provider
      value={{
        documents: state.documents,
        links: state.links,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        documentCategories: state.documentCategories,
        loadDocuments,
        loadLinks,
        loadCategories,
        clear,
        showDocuments,
      }}>
      {props.children}
    </DocumentsContext.Provider>
  );
};

export default documentsState;
