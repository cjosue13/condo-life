import React, {useContext, useReducer} from 'react';
import {
  CLEAR_NOTIFICATIONS,
  LOAD_SUBSCRIPTION_ERROR,
  LOAD_SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_ERROR,
  SUBSCRIPTION_SUCCESS,
  UNSUBSCRIPTION_ERROR,
  UNSUBSCRIPTION_SUCCESS,
} from '../../types';
import authContext from '../autentication/authContext';
import NotificationsContext from './notificationsContext';
import NotificationsReducer from './notificationsReducer';
import Request from '../../Config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getFcmToken} from '../..';

const notificationsState = props => {
  const initialState = {
    loading: true,
    message: null,
    error: null,
    subscription: null,
    success: false,
  };

  const [state, dispatch] = useReducer(NotificationsReducer, initialState);
  // authContext
  const auth = useContext(authContext);
  const {token} = auth;

  const subscribe = async () => {
    // const FCMToken = await AsyncStorage.getItem('firebase_token');

    try {
      const FCMToken = await getFcmToken();
      await Request.post(
        `/owner/native-notifications/subscribe`,
        {auth_token: FCMToken},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        },
      );

      dispatch({
        type: SUBSCRIPTION_SUCCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: SUBSCRIPTION_ERROR,
        payload: null,
      });
    }
  };

  const unsubscribe = async () => {
    try {
      const FCMToken = await getFcmToken();
      // const FCMToken = await AsyncStorage.getItem('firebase_token');
      await Request.delete(
        `/owner/native-notifications/unsubscribe/` + FCMToken,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          timeout: 30000,
        },
      );

      dispatch({
        type: UNSUBSCRIPTION_SUCCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: UNSUBSCRIPTION_ERROR,
        payload: null,
      });
    }
  };

  const loadSubscription = async () => {
    try {
      const FCMToken = await getFcmToken();
      const res = await Request.get('/owner/native-notifications/' + FCMToken, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_SUBSCRIPTION_SUCCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_SUBSCRIPTION_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const clear = () => {
    dispatch({type: CLEAR_NOTIFICATIONS, payload: null});
  };

  return (
    <NotificationsContext.Provider
      value={{
        message: state.message,
        loading: state.loading,
        error: state.error,
        subscription: state.subscription,
        success: state.success,
        loadSubscription,
        subscribe,
        unsubscribe,
        clear,
      }}>
      {props.children}
    </NotificationsContext.Provider>
  );
};

export default notificationsState;
