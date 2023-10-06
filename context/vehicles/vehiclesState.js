import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import VehiclesContext from './vehiclesContext';
import VehiclesReducer from './vehiclesReducer';
import {
  LOAD_VEHICLES_SUCCESS,
  LOAD_VEHICLES_ERROR,
  CREATE_VEHICLES_SUCCESS,
  CREATE_VEHICLES_ERROR,
  UPDATE_VEHICLES_ERROR,
  UPDATE_VEHICLES_SUCCESS,
  CLEAR_VEHICLES,
} from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {Platform} from 'react-native';

const VehiclesState = props => {
  const initialState = {
    vehicles: [],
    loading: true,
    errors: [],
    message: null,
    created: false,
    edited: false,
    error: null,
  };

  const [state, dispatch] = useReducer(VehiclesReducer, initialState);

  // authContext
  const authContext = useContext(AuthContext);
  const {token, selectedFilial} = authContext;

  //load vehicles from user
  const loadVehicles = async () => {
    try {
      const res = await Request.get('/owner/vehicles', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_VEHICLES_SUCCESS,
        payload: JSON.parse(res?.data?.data?.vehicles),
      });
    } catch (error) {
      dispatch({
        type: LOAD_VEHICLES_ERROR,
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
      type: CLEAR_VEHICLES,
      payload: [],
    });
  };

  //Update especific pet
  const updateFilial = async data => {
    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + `/owner/filiales/${selectedFilial.id}`,
      {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      data?.file?.data
        ? [
            {name: 'name', data: selectedFilial.name},
            {name: 'stage_id', data: selectedFilial.stage_id.toString()},
            {name: 'vehicles', data: JSON.stringify(data.vehicles)},
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
            {name: 'name', data: selectedFilial.name},
            {name: 'stage_id', data: selectedFilial.stage_id.toString()},
            {name: 'vehicles', data: JSON.stringify(data.vehicles)},
          ],
    )
      .then(resp => {
        const {errors, data} = JSON.parse(resp.data);
        if (!errors) {
          dispatch({
            type: UPDATE_VEHICLES_SUCCESS,
            payload: data.vehicles,
          });
        } else {
          dispatch({
            type: UPDATE_VEHICLES_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: UPDATE_VEHICLES_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  return (
    <VehiclesContext.Provider
      value={{
        vehicles: state.vehicles,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        created: state.created,
        edited: state.edited,
        error: state.error,
        loadVehicles,
        clearErrors,
        updateFilial,
      }}>
      {props.children}
    </VehiclesContext.Provider>
  );
};

export default VehiclesState;
