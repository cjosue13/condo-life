import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {Text} from 'react-native-paper';
import globalStyles, {configFonts} from '../../styles/global';
import {Col, Row} from '../../components/ui/partials/Col-Row';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import colors from '../../styles/colors';
import {RFValue} from 'react-native-responsive-fontsize';

const Own = ({navigation}) => {
  return (
    <View style={globalStyles.container}>
      <View style={styles.centerContainer}>
        <Row>
          <Col numRows={3} press={() => navigation.navigate('owners')}>
            <MaterialCommunityIcons
              name="account-multiple"
              style={styles.icon}
            />
            <Text style={styles.title}>Propietarios</Text>
          </Col>
          <Col numRows={1} press={() => navigation.navigate('tenantFilial')}>
            <MaterialCommunityIcons name="account-plus" style={styles.icon} />
            <Text style={styles.title}>Inquilinos</Text>
          </Col>
        </Row>

        <Row>
          <Col numRows={2} press={() => navigation.navigate('authorizates')}>
            <MaterialCommunityIcons name="account-group" style={styles.icon} />
            <Text style={styles.title}>Autorizados</Text>
          </Col>

          <Col numRows={2} press={() => navigation.navigate('petFilial')}>
            <MaterialCommunityIcons name="dog" style={styles.icon} />
            <Text style={styles.title}>Mascotas</Text>
          </Col>
        </Row>
        <Row>
          <Col numRows={2} press={() => navigation.navigate('vehicleFilial')}>
            <MaterialCommunityIcons name="car" style={styles.icon} />
            <Text style={styles.title}>Vehículos</Text>
          </Col>
        </Row>
      </View>
    </View>
  );
};

export default Own;

const styles = StyleSheet.create({
  centerContainer: {
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
