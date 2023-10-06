import React, {useState, useContext} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/es';
import {Button} from 'react-native-paper';
import IncidentContext from '../../../../context/incidents/IncidentContext';
import AuthContext from '../../../../context/autentication/authContext';
import {MIX_AWS_URL} from '../../../../Config/environment';
import {configFonts} from '../../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';

//change languae of moment js
moment.locale('es');

const GuestList = props => {
  // incident context
  const incidentContext = useContext(IncidentContext);
  const {deleteComment, loadComments} = incidentContext;

  // auth context
  const authContext = useContext(AuthContext);
  const {user} = authContext;

  //props
  const {id, created_by, created_at, comment, user_id} = props.comment;

  const handleConfirmation = () => {
    Alert.alert(
      '¿Desea eliminar el invitado de la reserva? Esta acción es irreversible.',
      'Una invitado eliminado no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deleteComment(id)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  return <View style={styles.viewReview}></View>;
};

const styles = StyleSheet.create({
  deleteComment: {
    bottom: 0,
    marginTop: 5,
    position: 'absolute',
    right: 0,
  },
  iconButton: {
    fontSize: RFValue(25),
  },
  imageAvatarUser: {
    height: 50,
    width: 50,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  reviewText: {
    color: 'grey',
    marginBottom: 5,
    paddingTop: 2,
  },
  reviewTitle: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
  viewImageAvatar: {
    marginRight: 15,
  },
  viewInfo: {
    alignItems: 'flex-start',
    flex: 1,
  },
  viewReview: {
    borderBottomColor: '#e3e3e3',
    borderBottomWidth: 1,
    flexDirection: 'row',
    padding: 10,
    paddingBottom: 20,
  },
});

export default GuestList;
