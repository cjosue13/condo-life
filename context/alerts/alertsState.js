import React, {useReducer, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import AlertsContext from './alertsContext';
import AlertsReducer from './alertsReducer';
import {
  CLEAR_ALERTS,
  CREATE_ALERT_ERROR,
  CREATE_ALERT_SUCESS,
} from '../../types';

const alertsState = props => {
  const initialState = {
    errors: [],
    message: null,
    error: null,
  };

  const [state, dispatch] = useReducer(AlertsReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token} = authContext;

  //load letters from user
  const createAlert = async data => {
    try {
      await Request.post('/owner/alerts', data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      dispatch({
        type: CREATE_ALERT_SUCESS,
        payload: null,
      });
    } catch (error) {
      dispatch({
        type: CREATE_ALERT_ERROR,
        payload: error.response.data.message || [],
      });
    }
  };

  //clearErrors for state
  const clear = () => {
    dispatch({
      type: CLEAR_ALERTS,
      payload: [],
    });
  };

  return (
    <AlertsContext.Provider
      value={{
        errors: state.errors,
        message: state.message,
        error: state.error,
        createAlert,
        clear,
      }}>
      {props.children}
    </AlertsContext.Provider>
  );
};

export default alertsState;
