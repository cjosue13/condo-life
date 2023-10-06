import React, {useReducer} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Request from '../../Config/axios';
import AuthContext from './authContext';
import AuthReducer from './authReducer';
import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  RETRIEVE_TOKEN,
  RETRIEVE_SELECTED_ACCOUNT,
  RETRIEVE_USER,
  RETRIEVE_SELECTED_FILIAL,
  TOOGLE_ACCOUNT_SUCCESS,
  TOOGLE_ACCOUNT_ERROR,
  NOT_LOADING,
  CLEAR,
  GET_PROFILE_SUCCESS,
  GET_PROFILE_ERROR,
  LOGIN_PERMISIONS,
  FORGET_PASWORD_ERROR,
  FORGET_PASWORD_SUCCESS,
} from '../../types';
import {havePermissions} from '../../utils/auth';

const AuthState = props => {
  const initialState = {
    message: null,
    authenticated: null,
    token: null,
    user: null,
    selectedFilial: null,
    selectedAccount: null,
    loading: true,
    error: null,
    toogleMessage: null,
    profile: null,
  };

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  //log in user in app
  const logIn = async data => {
    try {
      const res = await Request.post('/auth/login', data, {timeout: 30000});

      const roles = Object.keys(res.data).length !== 0 ? res.data.roles : {};
      if (
        (havePermissions(['owner'], roles) ||
          havePermissions(['tenant'], roles) ||
          havePermissions(['voter'], roles)) &&
        res.data.approved !== 0
      ) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: res.data,
        });
      } else {
        dispatch({
          type: LOGIN_PERMISIONS,
          payload: null,
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload:
          error?.response?.data?.message ||
          error.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };
  //logout user in app
  const signOut = async () => {
    try {
      const res = await Request.get('/auth/logout', {
        headers: {
          Authorization: `Bearer ${state.token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOGOUT,
        payload: res.data.message,
      });
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload:
          'No estás autenticado.' ||
          error.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //retrive token for storage
  const retrieve = async () => {
    let token;
    token = null;
    try {
      token = await AsyncStorage.getItem('token');
      dispatch({type: RETRIEVE_TOKEN, payload: token});
    } catch (e) {
      //console.log(e);
    }
  };
  //get user for storage
  const retrieveUser = async () => {
    let user;
    try {
      user = await AsyncStorage.getItem('user');
      dispatch({type: RETRIEVE_USER, payload: user});
    } catch (e) {
      // console.log(e);
    }
  };

  //get selectedAccount for storage
  const retrieveSelectedAccount = async () => {
    let selectedAccount;
    selectedAccount = null;
    try {
      selectedAccount = await AsyncStorage.getItem('selectedAccount');
      dispatch({type: RETRIEVE_SELECTED_ACCOUNT, payload: selectedAccount});
    } catch (e) {
      // console.log(e);
    }
  };

  //get selected filial for storage
  const retrieveSelecteFilial = async () => {
    let selectedFilial;
    selectedFilial = null;
    try {
      selectedFilial = await AsyncStorage.getItem('selectedFilial');
      dispatch({type: RETRIEVE_SELECTED_FILIAL, payload: selectedFilial});
    } catch (e) {
      // console.log(e);
    }
  };

  const getUser = async () => {
    const storageToken = await AsyncStorage.getItem('token');
    const token = JSON.parse(storageToken);
    try {
      const res = await Request.get('/owner/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });

      const roles = Object.keys(res.data).length !== 0 ? res.data.roles : {};

      if (
        havePermissions(['owner'], roles) ||
        havePermissions(['tenant'], roles) ||
        havePermissions(['voter'], roles)
      ) {
        dispatch({
          type: LOGIN_SUCCESS,
          payload: {access_token: token, ...res.data},
        });
      } else {
        dispatch({
          type: LOGIN_PERMISIONS,
          payload: null,
        });
      }
    } catch (error) {
      dispatch({
        type: LOGIN_ERROR,
        payload:
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  //handle Toogle account function
  const hangleToggleAccount = async (account, filial, ref) => {
    const object = new Object();
    try {
      object.filial = filial;
      object.account = account;
      object.ref = ref;
      object.message = 'Se ha cambiado de cuenta exitosamente.';
      await Request.post(
        '/toggle/account/' + state.user.id,
        {
          selected_account: account.id,
          selected_filial: filial.id,
        },
        {
          headers: {
            Authorization: `Bearer ${state.token}`,
          },
          timeout: 30000,
        },
      );
      dispatch({type: TOOGLE_ACCOUNT_SUCCESS, payload: object});
    } catch (error) {
      dispatch({
        type: TOOGLE_ACCOUNT_ERROR,
        payload:
          'No se ha podido cambiar de cuenta.' ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const notLoading = async () => {
    try {
      dispatch({type: NOT_LOADING, payload: false});
    } catch (e) {
      //console.log(e);
    }
  };

  const clear = async () => {
    try {
      dispatch({type: CLEAR});
    } catch (e) {
      // console.log(e);
    }
  };

  const getProfile = async id => {
    try {
      const res = await Request.get(`/owner/profile/${id}`, {
        headers: {
          Authorization: `Bearer ${state.token}`,
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

  const forgetPassword = async data => {
    try {
      const res = await Request.post('/password/email', data, {timeout: 30000});

      dispatch({
        type: FORGET_PASWORD_SUCCESS,
        payload: res.data,
      });
    } catch (error) {
      dispatch({
        type: FORGET_PASWORD_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        user: state.user,
        message: state.message,
        authenticated: state.authenticated,
        selectedFilial: state.selectedFilial,
        selectedAccount: state.selectedAccount,
        loading: state.loading,
        error: state.error,
        profile: state.profile,
        dispatch: dispatch,
        toogleMessage: state.toogleMessage,
        logIn,
        signOut,
        retrieve,
        retrieveUser,
        retrieveSelectedAccount,
        retrieveSelecteFilial,
        hangleToggleAccount,
        notLoading,
        clear,
        getProfile,
        forgetPassword,
        getUser,
      }}>
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthState;
