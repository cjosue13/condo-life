import React, {useContext, useReducer} from 'react';
import {
  CLEAR_PROFILE,
  GET_PROFILE_ERROR,
  GET_PROFILE_SUCCESS,
  UPDATE_PROFILE_ERROR,
  UPDATE_PROFILE_SUCCESS,
} from '../../types';
import {getValueElements} from '../../utils/helpers';
import authContext from '../autentication/authContext';
import ProfileContext from './profileContext';
import profileReducer from './profileReducer';
import Request from '../../Config/axios';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {Platform} from 'react-native';

const ProfileState = props => {
  const initialState = {
    profile: null,
    loading: true,
    errors: [],
    edited: false,
    message: null,
    error: null,
  };

  const [state, dispatch] = useReducer(profileReducer, initialState);
  // authContext
  const auth = useContext(authContext);
  const {token, selectedFilial} = auth;

  const getProfile = async id => {
    try {
      const res = await Request.get(`/owner/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: GET_PROFILE_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: GET_PROFILE_ERROR,
        payload:
          'No se ha podido obtener el usuario.' ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //Update especific pet
  const updateProfile = async (id, data) => {
    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + `/owner/profile/${id}`,
      {
        Authorization: `Bearer ${token}`,
        otherHeader: 'foo',
        'Content-Type': 'multipart/form-data',
      },
      data?.file?.data
        ? [
            {name: 'name', data: data.name},
            {name: 'lastname', data: data.lastname},
            {name: 'email', data: data.email},
            {name: 'document_id', data: data.document_id},
            {name: 'document_type', data: data.document_type},
            {
              name: data.password.trim() !== '' ? 'password' : '',
              data: data.password,
            },
            {
              name: data.password.trim() !== '' ? 'password_confirmation' : '',
              data: data.password_confirmation,
            },
            {name: 'filiales', data: JSON.stringify(selectedFilial.id)},
            {
              name: 'telephones',
              data: JSON.stringify(getValueElements(data.telephones)),
            },
            {
              name: 'cellphones',
              data: JSON.stringify(getValueElements(data.cellphones)),
            },
            {
              name: 'parking_number',
              data: JSON.stringify(getValueElements(data.parking_number)),
            },
            {
              name: 'warehouse_number',
              data: JSON.stringify(getValueElements(data.warehouse_number)),
            },
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
            {name: 'lastname', data: data.lastname},
            {name: 'email', data: data.email},
            {name: 'document_id', data: data.document_id},
            {name: 'document_type', data: data.document_type},
            {
              name: data.password.trim() !== '' ? 'password' : '',
              data: data.password,
            },
            {
              name: data.password.trim() !== '' ? 'password_confirmation' : '',
              data: data.password_confirmation,
            },
            {name: 'filiales', data: JSON.stringify(selectedFilial.id)},
            {
              name: 'telephones',
              data: JSON.stringify(getValueElements(data.telephones)),
            },
            {
              name: 'cellphones',
              data: JSON.stringify(getValueElements(data.cellphones)),
            },
            {
              name: 'parking_number',
              data: JSON.stringify(getValueElements(data.parking_number)),
            },
            {
              name: 'warehouse_number',
              data: JSON.stringify(getValueElements(data.warehouse_number)),
            },
          ],
    )
      .then(resp => {
        const newData = JSON.parse(resp.data);
        const {errors} = newData;
        if (!errors) {
          dispatch({
            type: UPDATE_PROFILE_SUCCESS,
            payload: newData.data,
          });
        } else {
          dispatch({
            type: UPDATE_PROFILE_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: UPDATE_PROFILE_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_PROFILE,
      payload: [],
    });
  };

  return (
    <ProfileContext.Provider
      value={{
        profile: state.profile,
        loading: state.loading,
        errors: state.errors,
        message: state.message,
        error: state.error,
        edited: state.edited,
        clear,
        updateProfile,
        getProfile,
      }}>
      {props.children}
    </ProfileContext.Provider>
  );
};

export default ProfileState;
