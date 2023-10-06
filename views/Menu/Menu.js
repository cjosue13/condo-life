/* eslint-disable react-native/no-unused-styles */
import React, {useEffect} from 'react';
import {StyleSheet, View, Platform, Image, ScrollView} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {useRef} from 'react';
import authContext from '../../context/autentication/authContext';
import {useContext} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {TOOGLE_ACCOUNT_MESSAGE} from '../../types';
import Toast from 'react-native-easy-toast';
import globalStyles, {configFonts, theme} from '../../styles/global';
import ProfileContext from '../../context/profile/profileContext';
import {havePermissions} from '../../utils/auth';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Col, Row} from '../../components/ui/partials/Col-Row';
import {messageView} from '../../utils/message';

const Menu = ({navigation}) => {
  const isFocused = useIsFocused();

  const auth = useContext(authContext);
  const {dispatch, user, toogleMessage} = auth;

  const profileContext = useContext(ProfileContext);
  const {loading, clear, getProfile} = profileContext;

  useEffect(() => {
    if (toogleMessage) {
      getProfile(user.id);
      dispatch({
        type: TOOGLE_ACCOUNT_MESSAGE,
        payload: null,
      });
      messageView(toogleMessage, 'success', 3000);
    }
  }, [toogleMessage]);

  useEffect(() => {
    if (isFocused) {
      clear();
      getProfile(user.id);
    } else {
      clear();
    }
  }, [isFocused]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../assets/images/vikingoz-negro.png')}
          style={styles.imageLogo}
        />
      </View>
      <ScrollView>
        <Row>
          <Col numRows={3} view="bookings" navigation={navigation}>
            <MaterialCommunityIcons name="calendar-plus" style={styles.icon} />
            <Text style={styles.title}>Reservas</Text>
          </Col>
        </Row>

        <Row>
          <Col numRows={1} view="letters" navigation={navigation}>
            <MaterialCommunityIcons name="message" style={styles.icon} />
            <Text style={styles.title}>Mensajes</Text>
          </Col>
          <Col numRows={2} view="own" navigation={navigation}>
            <MaterialCommunityIcons name="home-account" style={styles.icon} />
            <Text style={styles.title}>Mi filial</Text>
          </Col>
        </Row>

        <Row>
          <Col numRows={1} view="documents" navigation={navigation}>
            <MaterialCommunityIcons name="file-document" style={styles.icon} />
            <Text style={styles.title}>Documentos</Text>
          </Col>
          <Col numRows={1} view="contacts" navigation={navigation}>
            <MaterialCommunityIcons name="contacts" style={styles.icon} />
            <Text style={styles.title}>Contactos</Text>
          </Col>
          {!havePermissions(['tenant'], user.roles) && (
            <Col numRows={1} view="votes" navigation={navigation}>
              <MaterialCommunityIcons
                name="clipboard-check-multiple"
                style={styles.icon}
              />
              <Text style={styles.title}>Votaciones</Text>
            </Col>
          )}
        </Row>
        <Row>
          <Col numRows={2} view="incidents" navigation={navigation}>
            <MaterialCommunityIcons name="shield-account" style={styles.icon} />
            <Text style={styles.title}>Incidencias</Text>
          </Col>
          <Col numRows={2} view="alerts" navigation={navigation}>
            <MaterialCommunityIcons name="alert" style={styles.icon} />
            <Text style={styles.title}>Alertas</Text>
          </Col>
        </Row>

        <Row>
          <Col numRows={1} view="summaryEntrances" navigation={navigation}>
            <MaterialCommunityIcons name="car-multiple" style={styles.icon} />
            <Text style={styles.title}>Ingresos</Text>
          </Col>
          <Col numRows={3} view="preferences" navigation={navigation}>
            <MaterialCommunityIcons name="account-cog" style={styles.icon} />
            <Text style={styles.title}>Ajustes</Text>
          </Col>
        </Row>
      </ScrollView>
    </View>
  );
};

//COVI STYLES
const styles = StyleSheet.create({
  '1col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 2,
  },
  '2col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 2,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 2,
  },
  '3col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 3,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 5,
  },
  '4col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 4,
    justifyContent: 'center',
    padding: 2,
  },

  icon: {
    color: colors.white,
    fontSize: RFValue(55),
    marginBottom: '2.5%',
  },
  imageContainer: {
    backgroundColor: colors.transparent,
    marginBottom: '2.5%',
    maxHeight: '15%',
  },

  imageLogo: {
    height: '100%',
    marginTop: 5,
    resizeMode: 'contain',
    width: '100%',
  },

  infoContainer: {
    maxHeight: '100%',
  },
  listItem: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 10,
    height: '30%',
    margin: 20,
    maxHeight: '40%',
    padding: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  textCard: {
    fontSize: RFValue(8),
    margin: 5,
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
});

export default Menu;
