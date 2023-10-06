import React, {useReducer, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import EntranceContext from './entranceContext';
import EntranceReducer from './entranceReducer';
import {
  LOAD_ENTRANCES_SUCESS,
  LOAD_ENTRANCES_ERROR,
  CLEAR_ENTRANCES,
  LOAD_ENTRANCES_MONTH_ERROR,
  LOAD_ENTRANCES_MONTH_SUCESS,
  LOAD_ENTRANCES_WEEK_SUCESS,
  LOAD_ENTRANCES_WEEK_ERROR,
} from '../../types';

const EntranceState = props => {
  const initialState = {
    entrances: null,
    entrancesMonth: [],
    entrancesWeek: [],
    loading: true,
  };

  const [state, dispatch] = useReducer(EntranceReducer, initialState);

  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  const loadEntrances = async () => {
    //console.log(token);
    try {
      const res = await Request.get('/owner/entrances', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_ENTRANCES_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      //console.log(error);
      dispatch({
        type: LOAD_ENTRANCES_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadMonthEntrances = async () => {
    try {
      const res = await Request.get('/owner/entrances/month', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_ENTRANCES_MONTH_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_ENTRANCES_MONTH_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const loadWeekEntrances = async () => {
    try {
      const res = await Request.get('/owner/entrances/week', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      dispatch({
        type: LOAD_ENTRANCES_WEEK_SUCESS,
        payload: res.data.data,
      });
    } catch (error) {
      dispatch({
        type: LOAD_ENTRANCES_WEEK_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const clear = async () => {
    dispatch({
      type: CLEAR_ENTRANCES,
      payload: [],
    });
  };

  return (
    <EntranceContext.Provider
      value={{
        entrances: state.entrances,
        loading: state.loading,
        entrancesMonth: state.entrancesMonth,
        entrancesWeek: state.entrancesWeek,
        loadEntrances,
        loadMonthEntrances,
        loadWeekEntrances,
        clear,
      }}>
      {props.children}
    </EntranceContext.Provider>
  );
};

export default EntranceState;
