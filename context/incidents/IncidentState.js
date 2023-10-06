import React, {useReducer, useContext} from 'react';

import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import IncidentContext from './IncidentContext';

import IncidentReducer from './IncidentReducer';
import {
  CREATE_INCIDENT_ERROR,
  CREATE_INCIDENT_SUCCESS,
  LOAD_INCIDENTS_SUCESS,
  LOAD_INCIDENTS_ERROR,
  CLEAR_INCIDENT_ERRORS,
  SHOW_INCIDENT_SUCCESS,
  SHOW_INCIDENT_ERROR,
  CREATE_COMMENT_SUCESS,
  CREATE_COMMENT_ERROR,
  DELETE_COMMENT_SUCESS,
  DELETE_COMMENT_ERROR,
  UPDATE_INCIDENT_ERROR,
  UPDATE_INCIDENT_SUCCESS,
  CLEAR_INCIDENTS,
} from '../../types';
import {BACKEND_URL} from '../../Config/environment';
import RNFetchBlob from 'rn-fetch-blob';
import {Platform} from 'react-native';

const IncidentState = props => {
  const initialState = {
    incidents: null,
    incident: null,
    loading: true,
    created: false,
    errors: [],
    error: null,
    message: null,
    createdComment: false,
    loadComments: true,
  };

  const [state, dispatch] = useReducer(IncidentReducer, initialState);
  // const navigation = useNavigation();
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  const loadIncidents = async () => {
    try {
      const res = await Request.get('/owner/incidents', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_INCIDENTS_SUCESS,
        payload: res.data,
      });
    } catch (error) {
      //console.log(error);
      dispatch({
        type: LOAD_INCIDENTS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //create incident
  const createIncident = async data => {
    const formData = [
      {name: 'description', data: data.description},
      {name: 'subject', data: data.subject},
      {name: 'qualification', data: data.qualification},
    ];

    if (data?.file) {
      data.file.forEach(file =>
        formData.push({
          name: 'file[]',
          filename: file.fileName,
          type: file.type,
          data:
            Platform.OS === 'ios'
              ? 'RNFetchBlob-file://' +
                decodeURI(
                  file.uri.replace('file:///', '').replace('file://', ''),
                )
              : RNFetchBlob.wrap(file.uri),
        }),
      );
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/incidents',
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
            type: CREATE_INCIDENT_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: CREATE_INCIDENT_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_INCIDENT_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  //show incident by id
  const showIncident = async id => {
    try {
      const res = await Request.get(`/owner/incidents/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: SHOW_INCIDENT_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: SHOW_INCIDENT_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //create comment in incident
  const createComment = async formData => {
    try {
      const res = await Request.post('/owner/comments', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: CREATE_COMMENT_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: CREATE_COMMENT_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //delete comment in incident
  const deleteComment = async id => {
    try {
      await Request.delete(`/owner/comments/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: DELETE_COMMENT_SUCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: DELETE_COMMENT_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //update incident by id and with rating
  const updateIncident = async (id, data) => {
    try {
      const res = await Request.post(`/owner/incidents/${id}`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: UPDATE_INCIDENT_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: UPDATE_INCIDENT_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const clearErrors = () => {
    dispatch({
      type: CLEAR_INCIDENT_ERRORS,
      payload: [],
    });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_INCIDENTS,
      payload: [],
    });
  };

  return (
    <IncidentContext.Provider
      value={{
        incidents: state.incidents,
        incident: state.incident,
        loading: state.loading,
        error: state.error,
        errors: state.errors,
        created: state.created,
        message: state.message,
        createdComment: state.createdComment,
        loadComments: state.loadComments,
        dispatch,
        loadIncidents,
        createIncident,
        clearErrors,
        showIncident,
        createComment,
        deleteComment,
        updateIncident,
        clear,
      }}>
      {props.children}
    </IncidentContext.Provider>
  );
};

export default IncidentState;
