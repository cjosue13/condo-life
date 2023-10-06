// import React in our code
import React, {useContext, useRef, useState} from 'react';

// import all the components we are going to use
import {Text, View, StyleSheet, Alert, Platform} from 'react-native';
import globalStyles, {configFonts} from '../../styles/global';
import AlertsContext from '../../context/alerts/alertsContext';
import {useEffect} from 'react';
import Loading from '../../components/ui/partials/Loading';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import {Col, Row} from '../../components/ui/partials/Col-Row';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const Alerts = () => {
  const alertContext = useContext(AlertsContext);
  const {message, error, clear, createAlert} = alertContext;
  const [loading, setLoading] = useState(false);
  const isFocused = useIsFocused();

  const [type, setType] = useState({});

  useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (message) {
      messageView(message, 'success', 3000);
    }
    if (error) {
      messageView(error, 'danger', 3000);
    }
    clear();
  }, [message, error]);

  const confirmAlert = type => {
    Alert.alert(
      'Información de alerta',
      `¿Confirma el envío de alerta de ${type} en la filial?`,
      [
        {text: 'Si, confirmar', onPress: () => sendAlert(type)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const sendAlert = type => {
    setType({type});
    setLoading(true);
  };
  useEffect(() => {
    if (loading) {
      handleSubmit();
    }
  }, [loading]);

  const handleSubmit = async () => {
    try {
      await createAlert(type);
    } catch (error) {
      messageView('Ha ocurrido un error enviando la alerta.', 'danger', 3000);
    }
    setLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      <View style={styles.cardContent}>
        <Row>
          <Col numRows={3} press={() => confirmAlert('Seguridad')}>
            <MaterialCommunityIcons name="security" style={styles.icon} />
            <Text style={styles.title}>Seguridad</Text>
          </Col>
        </Row>
        <Row>
          <Col numRows={2} press={() => confirmAlert('Salud')}>
            <MaterialCommunityIcons name="medical-bag" style={styles.icon} />
            <Text style={styles.title}>Emergencia</Text>
          </Col>
          <Col numRows={2} press={() => confirmAlert('Incendio')}>
            <MaterialCommunityIcons
              name="fire-extinguisher"
              style={styles.icon}
            />
            <Text style={styles.title}>Incendio</Text>
          </Col>
        </Row>
      </View>
      <Loading isVisible={loading} text="Enviando alerta" />
    </View>
  );
};

export default Alerts;

const styles = StyleSheet.create({
  cardContent: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  icon: {
    color: colors.white,
    fontSize: RFValue(55),
    marginBottom: '2.5%',
  },

  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
});
