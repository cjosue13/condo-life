import React, {useContext} from 'react';
import {StyleSheet, View, Alert, Platform} from 'react-native';
import {Avatar} from 'react-native-elements';
import moment from 'moment';
import 'moment/locale/es';
import {IconButton, Text} from 'react-native-paper';
import BookingContext from '../../../../context/bookings/bookingsContext';
import {MIX_AWS_URL} from '../../../../Config/environment';
import {configFonts, theme} from '../../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../../styles/colors';

//change languae of moment js
moment.locale('es');

const GuestList = ({guestItem, deleted, removeGuest: remove}) => {
  // auth context

  // booking context
  const bookingContext = useContext(BookingContext);
  const {removeGuest, removeLocalElement} = bookingContext;

  //props
  const {id, name, lastname, local, avatar} = guestItem;

  const handleConfirmation = () => {
    Alert.alert(
      '¿Desea eliminar el invitado de la reserva? Esta acción es irreversible.',
      'Un invitado eliminado no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => handleDelete()},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  //delete guest from booking
  const handleDelete = () => {
    if (deleted != undefined) {
      removeLocalElement(id);
      if (local) {
        removeLocalElement(id);
      } else {
        removeGuest(id);
      }
    } else {
      remove(id);
    }
  };

  return (
    <View style={styles.viewReview}>
      <View style={styles.viewImageAvatar}>
        <Avatar
          size="large"
          rounded
          containerStyle={styles.imageAvatarUser}
          source={
            avatar && avatar !== 'undefined' && avatar !== null
              ? {uri: MIX_AWS_URL + avatar}
              : require('../../../../assets/images/Profile.png')
          }
        />
      </View>
      <View style={styles.viewInfo}>
        <Text theme={theme} style={styles.reviewTitle}>
          {name} {lastname}
        </Text>

        <IconButton
          style={styles.deleteComment}
          labelStyle={styles.iconButton}
          color="red"
          mode="text"
          icon="delete"
          onPress={() => handleConfirmation()}
        />
      </View>
    </View>
  );
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
  reviewTitle: {
    color: colors.black,
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
    backgroundColor: colors.cancelButton,
    borderBottomColor: colors.accent,
    borderBottomWidth: 1,
    borderRadius: 20,
    flexDirection: 'row',
    margin: '1.25%',
    padding: 10,
  },
});

export default GuestList;
