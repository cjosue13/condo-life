import React, {useContext} from 'react';
import {StyleSheet, View, Alert, Platform} from 'react-native';
import {Avatar} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/es';
import {ActivityIndicator, IconButton, Text} from 'react-native-paper';
import IncidentContext from '../../../../context/incidents/IncidentContext';
import AuthContext from '../../../../context/autentication/authContext';
import {MIX_AWS_URL} from '../../../../Config/environment';
import {configFonts, theme} from '../../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../../styles/colors';

//change languae of moment js
moment.locale('es');

const Comment = props => {
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
      '¿Desea eliminar el comentario? Esta acción es irreversible.',
      'Una comentario eliminado no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deleteComment(id)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  if (loadComments) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            props.comment.user.avatar
              ? {uri: MIX_AWS_URL + props.comment.user.avatar}
              : require('../../../../assets/images/Profile.png')
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text theme={theme} style={styles.reviewTitle}>
          {created_by}
        </Text>
        <Text theme={theme} style={styles.reviewText}>
          {comment}
        </Text>
        <Text theme={theme} style={styles.reviewText}>
          {moment(created_at, 'YYYY-MM-DD hh:mm:ss').locale('es').fromNow()}
        </Text>
        {/* user.id === user_id && (
          <IconButton
            style={styles.deleteComment}
            labelStyle={styles.iconButton}
            color="red"
            mode="text"
            icon="delete"
            onPress={() => handleConfirmation()}
          />
        )*/}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    color: colors.white,
    fontSize: RFValue(10),
    marginBottom: 5,
    paddingTop: 2,
  },
  reviewTitle: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
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
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'row',
    marginVertical: '1.25%',
    padding: 10,
  },
});

export default Comment;
