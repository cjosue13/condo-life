import React, {useReducer, useState, useEffect, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import ContactsContext from './contactsContext';
import ContacsReducer from './contactsReducer';
import {
  LOAD_CONTACT_SUCCESS,
  LOAD_CONTACT_ERROR,
  LOAD_PETS_SUCESS,
  LOAD_PETS_ERROR,
  CLEAR_PET_ERRORS,
} from '../../types';

const ContactsState = props => {
  const initialState = {
    contacts: [],
    loading: true,
    errors: [],
    message: null,
  };

  const [state, dispatch] = useReducer(ContacsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  //load pets from user
  const loadContacts = async () => {
    try {
      const res = await Request.get('/owner/contacts', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_CONTACT_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_CONTACT_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  const clearErrors = () => {
    dispatch({
      type: CLEAR_PET_ERRORS,
      payload: [],
    });
  };

  return (
    <ContactsContext.Provider
      value={{
        contacts: state.contacts,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        loadContacts,
        clearErrors,
      }}>
      {props.children}
    </ContactsContext.Provider>
  );
};

export default ContactsState;
