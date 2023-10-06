import React, {useReducer, useState, useEffect, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import OwnersContext from './ownersContext';
import OwnersReducer from './ownersReducer';
import {
  LOAD_OWNERS_SUCCESS,
  LOAD_OWNERS_ERROR,
  CLEAR_OWNERS,
  CREATE_OWNERS_SUCCESS,
  CREATE_OWNERS_ERROR,
  CLEAR_OWNERS_ERRORS,
} from '../../types';
import {getValueElements} from '../../utils/helpers';

const ownersState = props => {
  const initialState = {
    owners: [],
    loading: true,
    created: false,
    errors: [],
    edited: false,
    deleted: false,
    message: null,
    error: null,
  };

  const [state, dispatch] = useReducer(OwnersReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token, selectedFilial} = authContext;

  const createOwner = async data => {
    try {
      const res = await Request.post(
        '/owner/owners',
        {
          ...data,
          filiales: JSON.stringify(selectedFilial.id),
          telephones: JSON.stringify(getValueElements(data.telephones)),
          cellphones: JSON.stringify(getValueElements(data.cellphones)),
          parking_number: JSON.stringify(getValueElements(data.parking_number)),
          warehouse_number: JSON.stringify(
            getValueElements(data.warehouse_number),
          ),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        },
      );

      dispatch({
        type: CREATE_OWNERS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_OWNERS_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load pets from user
  const loadOwners = async () => {
    try {
      const res = await Request.get('/owner/owners', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_OWNERS_SUCCESS,
        payload: res.data.data[0].owners.filter(item => item.approved !== 0),
      });
    } catch (error) {
      dispatch({
        type: LOAD_OWNERS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  //clearErrors for state
  const clearErrors = () => {
    dispatch({
      type: CLEAR_OWNERS_ERRORS,
      payload: [],
    });
  };
  const clear = () => {
    dispatch({
      type: CLEAR_OWNERS,
      payload: [],
    });
  };

  return (
    <OwnersContext.Provider
      value={{
        owners: state.owners,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        created: state.created,
        edited: state.edited,
        deleted: state.delited,
        loadOwners,
        clear,
        createOwner,
        clearErrors,
      }}>
      {props.children}
    </OwnersContext.Provider>
  );
};

export default ownersState;
