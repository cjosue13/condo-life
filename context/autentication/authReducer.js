import AsyncStorage from '@react-native-async-storage/async-storage';
import {Platform} from 'react-native';
import {
  LOGIN_ERROR,
  LOGIN_SUCCESS,
  LOGOUT,
  RETRIEVE_TOKEN,
  RETRIEVE_SELECTED_FILIAL,
  RETRIEVE_SELECTED_ACCOUNT,
  RETRIEVE_USER,
  TOOGLE_ACCOUNT_SUCCESS,
  TOOGLE_ACCOUNT_ERROR,
  TOOGLE_ACCOUNT_MESSAGE,
  NOT_LOADING,
  CLEAR,
  LOGIN_PERMISIONS,
  FORGET_PASWORD_ERROR,
  FORGET_PASWORD_SUCCESS,
} from '../../types';

export default (state, action) => {
  switch (action.type) {
    case LOGIN_SUCCESS:
      AsyncStorage.setItem(
        'token',
        JSON.stringify(action.payload.access_token),
      );
      AsyncStorage.setItem('isAuth', JSON.stringify(true));
      AsyncStorage.setItem('user', JSON.stringify(action.payload));
      let selectedAccount;
      let selectedFilial;
      action.payload.filiales.forEach(filial => {
        if (filial.id === action.payload.selected_filial) {
          AsyncStorage.setItem(
            'selectedAccount',
            JSON.stringify(filial.account),
          );
          AsyncStorage.setItem('selectedFilial', JSON.stringify(filial));
          selectedAccount = filial.account;
          selectedFilial = filial;
        }
      });

      return {
        ...state,
        authenticated: true,
        message: null,
        loading: false,
        error: null,
        token: action.payload.access_token,
        user: action.payload,
        selectedAccount: selectedAccount,
        selectedFilial: selectedFilial,
      };

    case LOGIN_PERMISIONS: {
      return {
        ...state,
        error:
          'Este tipo de usuario no tiene permisos necesarios para este sistema.',
      };
    }

    case FORGET_PASWORD_ERROR: {
      return {
        ...state,
        error: action.payload,
      };
    }

    case FORGET_PASWORD_SUCCESS: {
      return {
        ...state,
        message: 'Se ha enviado el enlace correctamente.',
      };
    }

    case TOOGLE_ACCOUNT_MESSAGE:
      return {
        ...state,
        toogleMessage: action.payload,
      };

    case TOOGLE_ACCOUNT_SUCCESS:
      AsyncStorage.setItem(
        'selectedAccount',
        JSON.stringify(action.payload.account),
      );
      AsyncStorage.setItem(
        'selectedFilial',
        JSON.stringify(action.payload.filial),
      );
      action.payload.ref.current.hide();
      //RNRestart.Restart();
      return {
        ...state,
        selectedAccount: action.payload.account,
        selectedFilial: action.payload.filial,
        toogleMessage: action.payload.message,
      };

    case TOOGLE_ACCOUNT_ERROR:
      return {
        ...state,
        message: action.payload,
      };

    case RETRIEVE_USER:
      return {
        ...state,
        user: JSON.parse(action.payload),
        // loading: false,
      };

    case RETRIEVE_SELECTED_ACCOUNT:
      return {
        ...state,
        selectedAccount: JSON.parse(action.payload),
        // loading: false,
      };

    case RETRIEVE_SELECTED_FILIAL:
      return {
        ...state,
        loading: true,
        selectedFilial: JSON.parse(action.payload),
        // loading: false,
      };

    case RETRIEVE_TOKEN:
      return {
        ...state,
        token: JSON.parse(action.payload),
        authenticated: true,
        message: null,
        loading: false,
        error: null,
      };

    case LOGOUT:
      AsyncStorage.getAllKeys().then(async asyncStorageKeys => {
        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === 'android') {
            await AsyncStorage.clear();
          }
          if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
          }
        }
      });

      return {
        ...state,
        token: null,
        user: null,
        authenticated: null,
        message: action.payload,
        loading: false,
        error: null,
      };

    case NOT_LOADING:
      AsyncStorage.getAllKeys().then(async asyncStorageKeys => {
        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === 'android') {
            await AsyncStorage.clear();
          }
          if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
          }
        }
      });
      return {
        ...state,
        token: null,
        user: null,
        authenticated: null,
        loading: false,
        error: null,
      };
    case LOGIN_ERROR:
      AsyncStorage.getAllKeys().then(async asyncStorageKeys => {
        if (asyncStorageKeys.length > 0) {
          if (Platform.OS === 'android') {
            await AsyncStorage.clear();
          }
          if (Platform.OS === 'ios') {
            await AsyncStorage.multiRemove(asyncStorageKeys);
          }
        }
      });
      return {
        ...state,
        token: null,
        user: null,
        authenticated: null,
        message: null,
        loading: false,
        error: action.payload,
      };

    case CLEAR:
      // AsyncStorage.clear();
      return {
        ...state,
        token: null,
        user: null,
        authenticated: null,
        message: null,
        loading: false,
        error: null,
      };

    default:
      break;
  }
};
