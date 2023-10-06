import React, {useReducer} from 'react';
import firebase from '../../firebase';
import FirebaseReducer from './firebaseReducer';
import FirebaseContext from './firebaseContext';

const FirebaseState = props => {
  
  //state inicial del app
  const initialState = {
    data: [],
  };

  const [state, dispatch] = useReducer(FirebaseReducer, initialState);

  return (
    <FirebaseContext.Provider value={{data: state.data , firebase}}>
      {props.children}
    </FirebaseContext.Provider>
  );
};

export default FirebaseState;
