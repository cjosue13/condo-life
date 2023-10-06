import {
  Alert,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import NotificationsContext from '../../context/notifications/notificationsContext';
import {ActivityIndicator, Button, Text} from 'react-native-paper';

import Toast from 'react-native-easy-toast';
import {useIsFocused} from '@react-navigation/native';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Materialicons from 'react-native-vector-icons/MaterialIcons';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const Preferences = () => {
  const preferenceCont = useContext(NotificationsContext);
  const isFocused = useIsFocused();

  const {
    subscribe,
    unsubscribe,
    error,
    message,
    loading,
    subscription,
    clear,
    loadSubscription,
    success,
  } = preferenceCont;

  const [isSubscribe, setIsSubscribe] = useState(false);
  const [isUnSubscribe, setIsUnSubscribe] = useState(false);

  const handleSubscribe = async () => {
    try {
      await subscribe();
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setIsSubscribe(false);
  };

  useEffect(() => {
    if (success) {
      loadSubscription();
    }
  }, [success]);

  const handleUnSubscribe = async () => {
    try {
      await unsubscribe();
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setIsUnSubscribe(false);
  };

  const confirmAlert = () => {
    Alert.alert(
      'Información de preferencia',
      `¿Estás seguro que deseas ${
        subscription
          ? 'deshabilitar las notificaciones'
          : 'habilitar las notificaciones'
      }?`,
      [
        {
          text: 'Si, confirmar',
          onPress: () => {
            if (subscription) {
              setIsUnSubscribe(true);
            } else {
              setIsSubscribe(true);
            }
          },
        },
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  useEffect(() => {
    if (isFocused) {
      loadSubscription();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isSubscribe) {
      handleSubscribe();
    } else if (isUnSubscribe) {
      handleUnSubscribe();
    }
  }, [isSubscribe, isUnSubscribe]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      // clear();
    }
  }, [error, message]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.header}>
        Ajustes de aplicación
      </Text>

      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.subTitle}>
        Notificaciones:
      </Text>

      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.centerSubTitlte}>
        {`${
          subscription
            ? 'Las notificaciones se encuentran actualmente habilitadas'
            : 'Las notificaciones se encuentran actualmente deshabilitadas'
        }`}
      </Text>

      <Button
        uppercase={false}
        onPress={() => confirmAlert()}
        style={styles.button}>
        <Text style={styles.label}>
          {subscription
            ? 'Deshabilitar notificaciones'
            : 'Habilitar notificaciones'}
        </Text>
      </Button>
    </View>
  );
};

export default Preferences;

const styles = StyleSheet.create({
  button: {backgroundColor: colors.primary, margin: '2.5%'},

  centerSubTitlte: {
    // fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    // fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
    textAlign: 'center',
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  label: {color: colors.header, fontSize: RFValue(20), fontWeight: 'bold'},

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subTitle: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 10,
    marginTop: 20,
  },
});
