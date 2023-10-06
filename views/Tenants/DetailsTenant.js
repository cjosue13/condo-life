import React, {useContext} from 'react';
import {View, StyleSheet, Alert, ScrollView, Platform} from 'react-native';
import {Text, Subheading, Button, FAB, IconButton} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import tenantsContext from '../../context/tenants/tenantsContext';
import authContext from '../../context/autentication/authContext';
import {havePermissions} from '../../utils/auth';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const DetailsTenant = ({navigation, route}) => {
  const {
    name,
    email,
    lastname,
    id,
    document_type,
    document_id,
    telephones,
    cellphones,
  } = route.params.item;

  const tenantContext = useContext(tenantsContext);
  const {deleteTenant, error, clear} = tenantContext;

  const auth = useContext(authContext);
  const {user} = auth;
  const showConfirmation = () => {
    Alert.alert(
      '¿Deseas eliminar este inquilino?',
      'Un inquilino eliminado no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deleteItem()},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const deleteItem = async () => {
    try {
      await deleteTenant(id);
      navigation.navigate('tenants');
    } catch (error) {
      // console.log(error.message);
    }
  };

  const fullName = name + ' ' + lastname;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.view}>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.title}>
          {fullName.substr(0, 60)}
          {fullName.length > 60 && '...'}
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Nombre :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {name}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Apellidos :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {lastname}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Tipo de identificación :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {document_type}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Identificación :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {document_id}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Correo :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {email}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Teléfono :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {JSON.parse(telephones)}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Celular :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {JSON.parse(cellphones)}
          </Subheading>
        </Text>
      </View>

      <View style={globalStyles.rowOptions}>
        {!havePermissions(['tenant'], user.roles) && (
          <>
            <IconButton
              size={RFValue(32)}
              color={colors.primary}
              onPress={() => {
                clear();
                navigation.navigate('newtenant', {
                  tenant: route.params.item,
                });
              }}
              icon={({size, color}) => (
                <MaterialCommunityIcons
                  name="home-edit"
                  size={size}
                  color={color}
                  backgroundColor={theme.colors.primary}
                />
              )}
            />
            <IconButton
              size={RFValue(32)}
              color={colors.warning}
              onPress={() => showConfirmation()}
              icon={({size, color}) => (
                <MaterialCommunityIcons
                  name="delete"
                  size={size}
                  color={color}
                  backgroundColor={theme.colors.primary}
                />
              )}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: colors.warning,
    marginTop: 100,
  },
  subInfo: {
    color: colors.white,
    fontSize: RFValue(12),
  },

  text: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(24),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    justifyContent: 'center',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default DetailsTenant;
