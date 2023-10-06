import React, {useReducer, useState, useEffect, useContext} from 'react';
import Request from '../../Config/axios';
import AuthContext from '../autentication/authContext';
import LettersContext from './lettersContext';
import LettersReducer from './lettersReducer';
import {
  CLEAR_LETTERS,
  CLEAR_LETTERS_OPTIONS,
  CREATE_LETTERS_ERROR,
  CREATE_LETTERS_SUCCESS,
  CREATE_REPLY_ERROR,
  CREATE_REPLY_SUCCESS,
  LOAD_ADMINS_ERROR,
  LOAD_ADMINS_SUCCESS,
  LOAD_LETTERS_ERROR,
  LOAD_LETTERS_SENT_SUCCESS,
  LOAD_LETTERS_SUCCESS,
  LOAD_LETTER_SUCCESS,
  LOAD_MESSAGES_SUCCESS,
} from '../../types';
import RNFetchBlob from 'rn-fetch-blob';
import {BACKEND_URL} from '../../Config/environment';
import {Platform} from 'react-native';

const LettersState = props => {
  const initialState = {
    letters: [],
    letter: null,
    loading: true,
    errors: [],
    created: false,
    edited: false,
    message: null,
    error: null,
    lettersCategories: [],
    fromLetters: [],
    ready: [],
    admins: [],
    reponsesLetter: [],
    messages: [],
  };

  const [state, dispatch] = useReducer(LettersReducer, initialState);
  // authContext
  const authContext = useContext(AuthContext);
  const {token, user} = authContext;

  const load = async () => {
    RNFetchBlob.fetch('GET', BACKEND_URL + '/owner/categories', {
      Authorization: `Bearer ${token}`,
    })
      .then(res => {
        const data = JSON.parse(res.data);

        const categories = data?.data?.map(categorie => ({
          name: categorie.name,
          id: categorie.id,
          count: categorie.quantity,
          sent: false,
        }));

        categories.push({
          name: 'Enviados',
          count: 0,
          id: -1,
          sent: true,
        });

        dispatch({
          type: LOAD_LETTERS_SUCCESS,
          payload: categories,
        });
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // console.log(errorMessage, statusCode);
      });
  };

  const loadAdmins = async () => {
    try {
      const resp = await Request.get('/owner/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        timeout: 30000,
      });
      dispatch({
        type: LOAD_ADMINS_SUCCESS,
        payload: resp.data.data || [],
      });
    } catch (error) {
      dispatch({
        type: LOAD_ADMINS_ERROR,
        payload:
          error?.response?.data?.message ||
          error?.message ||
          'Ha ocurrido un error, si el problema persiste, contactar a administración.',
      });
    }
  };

  const show = async id => {
    await RNFetchBlob.fetch('GET', BACKEND_URL + '/owner/subjects/' + id, {
      Authorization: `Bearer ${token}`,
    })
      .then(res => {
        const data = JSON.parse(res.data);
        const letters = data.data || [];

        const filterData = letters.map((item, index) => {
          const random = Math.floor(Math.random() * 100000) + 1;
          return {...item, key: index + ' letter ' + random};
        });

        dispatch({
          type: LOAD_LETTERS_SENT_SUCCESS,
          payload: filterData,
        });
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // console.log(errorMessage, statusCode);
      });
  };

  const showSents = async id => {
    await RNFetchBlob.fetch(
      'GET',
      BACKEND_URL + '/owner/letters/showSents/' + id,
      {
        Authorization: `Bearer ${token}`,
      },
    )
      .then(res => {
        const data = JSON.parse(res.data);
        const dataLetter = data.data || [];

        const letters = dataLetter.map((letter, index) => {
          const random = Math.floor(Math.random() * 100000) + 1;
          return {...letter, key: index + ' letter ' + random};
        });

        dispatch({
          type: LOAD_LETTERS_SENT_SUCCESS,
          payload: letters,
        });
      })
      // Something went wrong:
      .catch((errorMessage, statusCode) => {
        // console.log(errorMessage, statusCode);
      });
  };

  const showLetter = async id => {
    await RNFetchBlob.fetch('GET', BACKEND_URL + '/owner/letters/show/' + id, {
      Authorization: `Bearer ${token}`,
    })
      .then(res => {
        const data = JSON.parse(res.data);
        const letter = data.data || [];

        let replys = letter.comments;

        dispatch({
          type: LOAD_LETTER_SUCCESS,
          payload: {
            letter: letter,
            reponsesLetter: replys,
            ready: data.ready,
          },
        });
      })
      .catch((errorMessage, statusCode) => {
        // console.log(errorMessage, statusCode);
      });
  };

  const showMessages = async id => {
    await RNFetchBlob.fetch('GET', BACKEND_URL + '/owner/replys/' + id, {
      Authorization: `Bearer ${token}`,
    })
      .then(res => {
        const data = JSON.parse(res.data);
        const message = data.data || [];

        const messages = message
          .filter(
            message => message.to_id === user.id || message.user_id === user.id,
          )
          .sort(function (a, b) {
            return a.created_at - b.created_at;
          });

        dispatch({
          type: LOAD_MESSAGES_SUCCESS,
          payload: messages.filter(letter => letter.file_url != null),
        });
      })
      .catch((errorMessage, statusCode) => {
        // console.log(errorMessage, statusCode);
      });
  };

  const createLetter = async data => {
    const formData = [
      {name: 'content', data: data.content},
      {name: 'subject', data: data.subject},
      {name: 'emails', data: data.emails},
    ];

    if (data?.file) {
      data.file.forEach(file =>
        formData.push({
          name: 'file[]',
          filename: file.name,
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
      BACKEND_URL + '/owner/letters',
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
            type: CREATE_LETTERS_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: CREATE_LETTERS_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_LETTERS_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const createReply = async data => {
    const formData = [
      {name: 'to_id', data: data.to_id},
      {name: 'file_url', data: data.file_url},
      {name: 'reply_id', data: data.reply_id},
      {name: 'comment', data: data?.file ? data.file[0].name : data.comment},
    ];

    if (data?.file) {
      formData.push({
        name: 'file',
        filename: data.file[0].name,
        type: data.file[0].type,
        data:
          Platform.OS === 'ios'
            ? 'RNFetchBlob-file://' +
              decodeURI(
                data.file[0].uri.replace('file:///', '').replace('file://', ''),
              )
            : RNFetchBlob.wrap(data.file[0].uri),
      });
    }

    await RNFetchBlob.fetch(
      'POST',
      BACKEND_URL + '/owner/replys',
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
            type: CREATE_REPLY_SUCCESS,
            payload: data.data || {},
          });
        } else {
          dispatch({
            type: CREATE_REPLY_ERROR,
            payload: errors,
          });
        }
      })
      .catch(err => {
        dispatch({
          type: CREATE_LETTERS_ERROR,
          payload: err?.response?.data?.errors || [],
        });
      });
  };

  const clear = () => {
    dispatch({
      type: CLEAR_LETTERS,
      payload: [],
    });
  };

  const clearOptions = () => {
    dispatch({
      type: CLEAR_LETTERS_OPTIONS,
      payload: [],
    });
  };

  return (
    <LettersContext.Provider
      value={{
        letters: state.letters,
        lettersCategories: state.lettersCategories,
        fromLetters: state.fromLetters,
        ready: state.ready,
        loading: state.loading,
        errors: state.errors,
        error: state.error,
        message: state.message,
        admins: state.admins,
        created: state.created,
        edited: state.edited,
        letter: state.letter,
        reponsesLetter: state.reponsesLetter,
        messages: state.messages,
        showLetter,
        showMessages,
        loadAdmins,
        load,
        clear,
        clearOptions,
        createLetter,
        show,
        showSents,
        createReply,
      }}>
      {props.children}
    </LettersContext.Provider>
  );
};

export default LettersState;
