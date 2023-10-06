import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import TenantsContext from './tenantsContext';
import TenantsReducer from './tenantsReducer';
import {
  LOAD_TENANTS_SUCCESS,
  LOAD_TENANTS_ERROR,
  CREATE_TENANTS_SUCCESS,
  CREATE_TENANTS_ERROR,
  CLEAR_TENANTS_ERRORS,
  CLEAR_TENANTS,
  DELETE_TENANTS_SUCCESS,
  DELETE_TENANTS_ERROR,
  UPDATE_TENANTS_SUCCESS,
  UPDATE_TENANTS_ERROR,
} from '../../types';
import {getValueElements} from '../../utils/helpers';

const tenantsState = props => {
  const initialState = {
    tenants: [],
    loading: true,
    created: false,
    errors: [],
    edited: false,
    deleted: false,
    message: null,
    error: null,
  };

  const [state, dispatch] = useReducer(TenantsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token, selectedFilial} = authContext;

  //create pet
  const createTenant = async data => {
    try {
      const res = await Request.post(
        '/owner/tenants',
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
        type: CREATE_TENANTS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_TENANTS_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //Update especific pet
  const updateTenant = async (id, data) => {
    try {
      const res = await Request.post(
        `/owner/tenants/${id}`,
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
        type: UPDATE_TENANTS_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_TENANTS_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //load tenants from user
  const loadTenants = async () => {
    try {
      const res = await Request.get('/owner/tenants', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_TENANTS_SUCCESS,
        payload: res.data.data[0].tenants,
      });
    } catch (error) {
      dispatch({
        type: LOAD_TENANTS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //delete pet from user
  const deleteTenant = async id => {
    try {
      await Request.delete(`/owner/tenants/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: DELETE_TENANTS_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: DELETE_TENANTS_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //clearErrors for state
  const clearErrors = () => {
    dispatch({
      type: CLEAR_TENANTS_ERRORS,
      payload: [],
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_TENANTS,
      payload: [],
    });
  };

  return (
    <TenantsContext.Provider
      value={{
        tenants: state.tenants,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        created: state.created,
        edited: state.edited,
        deleted: state.delited,
        loadTenants,
        clearErrors,
        createTenant,
        dispatch,
        clear,
        deleteTenant,
        updateTenant,
      }}>
      {props.children}
    </TenantsContext.Provider>
  );
};

export default tenantsState;
