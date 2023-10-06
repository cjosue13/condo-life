import React, {useReducer, useState, useEffect, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import AutorizationsContext from './autorizationsContext';
import AutorizationsReducer from './autorizationsReducer';
import {
  CLEAR_AUTORIZATIONS,
  CLEAR_CODE_MESSAGES,
  CREATE_AUTORIZATIONS_ERROR,
  CREATE_AUTORIZATIONS_SUCCESS,
  CREATE_CODE_ERROR,
  CREATE_CODE_SUCCESS,
  DELETE_AUTORIZATIONS_ERROR,
  DELETE_AUTORIZATIONS_SUCCESS,
  LOAD_AUTORIZATIONS_ERRORS,
  LOAD_AUTORIZATIONS_SUCCESS,
  LOAD_OLD_AUTORIZATIONS_ERRORS,
  LOAD_OLD_AUTORIZATIONS_SUCCESS,
  LOAD_SUBSIDIARY_ERROR,
  LOAD_SUBSIDIARY_SUCCESS,
  SEND_AUTORIZATIONS_QR_ERRORS,
  SEND_AUTORIZATIONS_QR_SUCCESS,
  UPDATE_AUTORIZATIONS_ERROR,
  UPDATE_AUTORIZATIONS_SUCCESS,
} from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {Platform} from 'react-native';
import moment from 'moment';

const AutorizationsState = props => {
  const initialState = {
    temps: [],
    permanents: [],
    services: [],
    oldAutorizations: [],
    subsidiarys: [],
    loading: true,
    errors: [],
    message: null,
    error: null,
    edited: false,
    created: false,
    deleted: false,
    send: false,
    code: null,
  };

  const [state, dispatch] = useReducer(AutorizationsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  //load vehicles from user
  const loadAutorizations = async title => {
    try {
      const res = await Request.get('/owner/authorizations', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const data = res.data.data.filter(item => {
        let schedule = '';
        if (item.autorization_type) {
          schedule = `${item.autorization_type}`;
        } else {
          if (item.datetime_of_entry === '0000-00-00 00:00:00') {
            schedule = 'Permanente';
          } else {
            schedule = `Temporal`;
          }
        }
        return schedule === title && item;
      });

      dispatch({
        type: LOAD_AUTORIZATIONS_SUCCESS,
        payload: data || [],
        title,
      });
    } catch (error) {
      dispatch({
        type: LOAD_AUTORIZATIONS_ERRORS,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadOldAutorizations = async () => {
    try {
      const res = await Request.get('/owner/authorizations/old', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_OLD_AUTORIZATIONS_SUCCESS,
        payload: res.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_OLD_AUTORIZATIONS_ERRORS,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const deleteAutorizate = async id => {
    try {
      await Request.delete('/owner/authorizations/' + id, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: DELETE_AUTORIZATIONS_SUCCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: DELETE_AUTORIZATIONS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const createAuthorizate = async data => {
    const formData = [
      {
        name: 'description',
        data: data.description.trim() !== '' ? data.description : 'N/A',
      },
      {name: 'name', data: data.name},
      {name: 'lastname', data: data.lastname},
      {name: 'document_id', data: data.document_id},
      {name: 'document_type', data: data.document_type},
      {name: 'autorization_type', data: data.autorization_type},
      {name: 'allow_holidays', data: data.allow_holidays ? '1' : '0'},
      {name: 'avatar', data: data.file ? data.avatar : 'undefined'},
      {name: 'allowed_days', data: JSON.stringify({...data.allowed_days})},
    ];

    if (data?.file) {
      formData.push({
        name: 'file',
        filename: data.file.name,
        type: data.file.type,
        data:
          Platform.OS === 'ios'
            ? 'RNFetchBlob-file://' +
              decodeURI(
                data.file.uri.replace('file:///', '').replace('file://', ''),
              )
            : RNFetchBlob.wrap(data.file.uri),
      });
    }

    if (
      data.datetime_of_entry.trim() !== '' &&
      data.datetime_of_entry !== '0000-00-00 00:00:00'
    ) {
      formData.push({name: 'datetime_of_entry', data: data.datetime_of_entry});
      formData.push({
        name: 'datetime_of_departure',
        data: data.datetime_of_departure,
      });
    } else {
      formData.push({name: 'datetime_of_entry', data: 'null'});
      formData.push({
        name: 'datetime_of_departure',
        data: 'null',
      });
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/authorizations',
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
    )
      .then(resp => {
        const data = JSON.parse(resp.data);
        const {errors} = data;
        if (!errors) {
          dispatch({
            type: CREATE_AUTORIZATIONS_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: CREATE_AUTORIZATIONS_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_AUTORIZATIONS_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const updateAuthorizate = async (data, id) => {
    const formData = [
      {
        name: 'description',
        data: data.description.trim() !== '' ? data.description : 'N/A',
      },
      {name: 'name', data: data.name},
      {name: 'lastname', data: data.lastname},
      {name: 'document_id', data: data.document_id},
      {name: 'document_type', data: data.document_type},
      {name: 'autorization_type', data: data.autorization_type},
      {name: 'allow_holidays', data: data.allow_holidays ? '1' : '0'},
      {
        name: 'avatar',
        data: data.file && data.avatar !== null ? data.avatar : 'undefined',
      },
      {name: 'allowed_days', data: JSON.stringify({...data.allowed_days})},
    ];

    if (data?.file) {
      formData.push({
        name: 'file',
        filename: data.file.name,
        type: data.file.type,
        data:
          Platform.OS === 'ios'
            ? 'RNFetchBlob-file://' +
              decodeURI(
                data.file.uri.replace('file:///', '').replace('file://', ''),
              )
            : RNFetchBlob.wrap(data.file.uri),
      });
    }

    if (
      data.datetime_of_entry.trim() !== '' &&
      data.datetime_of_entry !== '0000-00-00 00:00:00'
    ) {
      formData.push({name: 'datetime_of_entry', data: data.datetime_of_entry});
      formData.push({
        name: 'datetime_of_departure',
        data: data.datetime_of_departure,
      });
    } else {
      formData.push({name: 'datetime_of_entry', data: 'null'});
      formData.push({
        name: 'datetime_of_departure',
        data: 'null',
      });
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/authorizations/' + id,
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
    )
      .then(resp => {
        const data = JSON.parse(resp.data);
        const {errors} = data;
        if (!errors) {
          dispatch({
            type: UPDATE_AUTORIZATIONS_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: UPDATE_AUTORIZATIONS_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: UPDATE_AUTORIZATIONS_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const loadSubsidiarys = async () => {
    try {
      const res = await Request.get('/owner/filiales/all/filials', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_SUBSIDIARY_SUCCESS,
        payload: res.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_SUBSIDIARY_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const sendQR = async data => {
    const formData = [
      {name: 'mail', data: data.mail},
      {
        name: 'file',
        data: data.file,
      },
    ];

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/authorizations/sendQrcode',
      {
        Authorization: `Bearer ${token}`,
      },
      formData,
    )
      .then(() => {
        dispatch({
          type: SEND_AUTORIZATIONS_QR_SUCCESS,
          payload: data.data || {},
        });
      })
      .catch(err => {
        dispatch({
          type: SEND_AUTORIZATIONS_QR_ERRORS,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const createCode = async data => {
    try {
      const res = await Request.post('/owner/codes', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: CREATE_CODE_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_CODE_ERROR,
      });
    }
  };

  const clear = () => {
    dispatch({
      type: CLEAR_AUTORIZATIONS,
      payload: [],
    });
  };

  const clearMessages = () => {
    dispatch({
      type: CLEAR_CODE_MESSAGES,
      payload: [],
    });
  };

  return (
    <AutorizationsContext.Provider
      value={{
        temps: state.temps,
        permanents: state.permanents,
        services: state.services,
        oldAutorizations: state.oldAutorizations,
        subsidiarys: state.subsidiarys,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        created: state.created,
        edited: state.edited,
        deleted: state.deleted,
        send: state.send,
        code: state.code,
        loadAutorizations,
        loadOldAutorizations,
        loadSubsidiarys,
        deleteAutorizate,
        createAuthorizate,
        sendQR,
        updateAuthorizate,
        createCode,
        clear,
        clearMessages,
      }}>
      {props.children}
    </AutorizationsContext.Provider>
  );
};

export default AutorizationsState;
