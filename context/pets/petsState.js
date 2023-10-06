import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import PetsContext from './petsContext';
import PetsReducer from './petsReducer';
import {
  CREATE_PET_ERROR,
  CREATE_PET_SUCCESS,
  LOAD_PETS_SUCESS,
  LOAD_PETS_ERROR,
  CLEAR_PET_ERRORS,
  UPDATE_PET_SUCCESS,
  UPDATE_PET_ERROR,
  DELETE_PET_SUCCESS,
  DELETE_PET_ERROR,
  CREATE_ALERT_PET_ERROR,
  CREATE_ALERT_PET_SUCESS,
} from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {Platform} from 'react-native';

const PetsState = props => {
  const initialState = {
    pets: null,
    loading: true,
    created: false,
    errors: [],
    edited: false,
    deleted: false,
    message: null,
    error: null,
  };

  const [state, dispatch] = useReducer(PetsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  //load pets from user
  const loadPets = async () => {
    try {
      const res = await Request.get('/owner/pets', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_PETS_SUCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_PETS_ERROR,
        payload:
          error.response?.data?.message ||
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

  const createPet = async data => {
    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/pets',
      {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      data?.file?.data
        ? [
            {name: 'name', data: data.name},
            {name: 'breed', data: data.breed},
            {name: 'description', data: data.description},
            {
              name: 'file',
              filename: data.file?.filename,
              type: data.file?.type,
              data:
                Platform.OS === 'ios'
                  ? 'RNFetchBlob-file://' +
                    decodeURI(
                      data.file.uri
                        .replace('file:///', '')
                        .replace('file://', ''),
                    )
                  : RNFetchBlob.wrap(data.file.uri),
            },
          ]
        : [
            {name: 'name', data: data.name},
            {name: 'breed', data: data.breed},
            {name: 'description', data: data.description},
          ],
    )
      .then(resp => {
        const {errors} = JSON.parse(resp.data);
        if (!errors) {
          dispatch({
            type: CREATE_PET_SUCCESS,
            payload: resp.data,
          });
        } else {
          dispatch({
            type: CREATE_PET_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_PET_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  //Update especific pet
  const updatePet = async (id, data) => {
    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + `/owner/pets/${id}`,
      {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      data?.file?.data
        ? [
            {name: 'name', data: data.name},
            {name: 'breed', data: data.breed},
            {name: 'description', data: data.description},
            {
              name: 'file',
              filename: data.file?.filename,
              type: data.file?.type,
              data:
                Platform.OS === 'ios'
                  ? 'RNFetchBlob-file://' +
                    decodeURI(
                      data.file.uri
                        .replace('file:///', '')
                        .replace('file://', ''),
                    )
                  : RNFetchBlob.wrap(data.file.uri),
            },
          ]
        : [
            {name: 'name', data: data.name},
            {name: 'breed', data: data.breed},
            {name: 'description', data: data.description},
          ],
    )
      .then(resp => {
        const {errors} = JSON.parse(resp.data);
        if (!errors) {
          dispatch({
            type: UPDATE_PET_SUCCESS,
            payload: resp.data,
          });
        } else {
          dispatch({
            type: UPDATE_PET_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: UPDATE_PET_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  //delete pet from user
  const deletePet = async id => {
    try {
      await Request.delete(`/owner/pets/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: DELETE_PET_SUCCESS,
        payload: id,
      });
    } catch (error) {
      dispatch({
        type: DELETE_PET_ERROR,
        payload:
          error?.response?.data?.errors ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const sendAlert = async data => {
    try {
      await Request.post('/owner/pets/send-alert', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: CREATE_ALERT_PET_SUCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: CREATE_ALERT_PET_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  return (
    <PetsContext.Provider
      value={{
        pets: state.pets,
        loading: state.loading,
        errors: state.errors,
        created: state.created,
        edited: state.edited,
        deleted: state.deleted,
        message: state.message,
        error: state.error,
        dispatch,
        loadPets,
        createPet,
        clearErrors,
        updatePet,
        sendAlert,
        deletePet,
      }}>
      {props.children}
    </PetsContext.Provider>
  );
};

export default PetsState;
