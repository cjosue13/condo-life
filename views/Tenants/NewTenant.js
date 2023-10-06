/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, Fragment, useContext, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {TextInput, Button as PaperButton, Text} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import tenantsContext from '../../context/tenants/tenantsContext';
import Loading from '../../components/ui/partials/Loading';
import FieldError from '../../components/ui/errors/FieldError';
import Toast from 'react-native-easy-toast';
import Feather from 'react-native-vector-icons/Feather';
import RequiredField from '../../components/ui/forms/RequiredField';
import {Dropdown} from 'sharingan-rn-modal-dropdown';
import PropTypes from 'prop-types';
import {loadOptionsSelect} from '../../utils/helpers';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const documentTypesToSelect = [
  {label: 'Cédula', value: 'Cédula'},
  {label: 'Residencia', value: 'Residencia'},
  {label: 'Pasaporte', value: 'Pasaporte'},
];

const defaultValueForm = {
  name: '',
  lastname: '',
  email: '',
  document_id: '',
  document_type: '',
  telephones: '',
  cellphones: '',
  parking_number: '',
  warehouse_number: '',
  password: '',
  password_confirmation: '',
  sendEmailNotification: true,
  role_id: 6,
};

const getObject = obj => {
  return {
    id: obj.id,
    name: obj.name,
    lastname: obj.lastname,
    email: obj.email,
    document_id: obj.document_id,
    document_type: obj.document_type,
    telephones: loadOptionsSelect(JSON.parse(obj.telephones)),
    cellphones: loadOptionsSelect(JSON.parse(obj.cellphones)),
    parking_number: loadOptionsSelect(JSON.parse(obj.parking_number)),
    warehouse_number: loadOptionsSelect(JSON.parse(obj.warehouse_number)),
    password: '',
    password_confirmation: '',
    role_id: 6,
  };
};

const NewTenant = ({navigation, route}) => {
  const tenant = route.params?.tenant ? route.params.tenant : null;

  const [formData, setFormData] = useState(
    tenant ? getObject(tenant) : defaultValueForm,
  );

  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState(
    tenant ? tenant.document_type : 'Cédula',
  );
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const tenantContext = useContext(tenantsContext);
  const {
    errors,
    created,
    createTenant,
    updateTenant,
    edited,
    error,
    message,
    clearErrors,
  } = tenantContext;

  //detectar cuando se esta editando o no
  useEffect(() => {
    if (created || edited) {
      navigation.navigate('tenants');
    }
  }, [created, edited]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearErrors();
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  const handleFormSubmit = async () => {
    try {
      const data = {
        ...formData,
        document_type: documentType,
      };

      if (data.password.trim() === '') {
        //if password dont exist, delete field of data
        delete data.password;
        delete data.password_confirmation;
      }

      if (formData.id) {
        await updateTenant(formData.id, data);
      } else {
        await createTenant(data);
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  //Onchange for field texts
  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Información personal
          </Text>
          <RequiredField field={'Nombre'} />

          <TextInput
            label="Nombre"
            onChange={e => onChange(e, 'name')}
            value={formData.name}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['name']}
          />
          {FieldError(errors, 'name')}
          <RequiredField field={'Apellidos'} />
          <TextInput
            label="Apellidos"
            onChange={e => onChange(e, 'lastname')}
            value={formData.lastname}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['lastname']}
          />

          {FieldError(errors, 'lastname')}
          <RequiredField field={'Correo'} />
          <TextInput
            label="Correo"
            onChange={e => onChange(e, 'email')}
            value={formData.email}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['email']}
          />

          {FieldError(errors, 'email')}
          <RequiredField field={'Tipo de identificación'} />
          <Dropdown
            label="Tipo de identificación"
            data={documentTypesToSelect}
            primaryColor={theme.colors.primary}
            textInputStyle={styles.input}
            value={documentType}
            onChange={setDocumentType}
            error={errors['document_type']}
            selectedItemTextStyle={{
              fontFamily: configFonts.default.medium.fontFamily,
              fontWeight: Platform.select({ios: 'bold', android: undefined}),
            }}
            itemTextStyle={{
              fontFamily: configFonts.default.regular.fontFamily,
              fontWeight: 'normal',
            }}
            disableSelectionTick
            removeLabel
            textInputPlaceholder="Selecciona un item"
            underlineColor={theme.colors.primary}
            paperTheme={theme}
          />

          <View style={styles.space} />

          {FieldError(errors, 'document_type')}
          <RequiredField field={'Número de identificación'} />
          <TextInput
            label="Número de identificación"
            onChange={e => onChange(e, 'document_id')}
            value={formData.document_id}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['document_id']}
          />
          {FieldError(errors, 'document_id')}
          <View style={styles.space} />
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Información de contacto
          </Text>
          <RequiredField field={'Teléfono'} required={false} />
          <TextInput
            label="Teléfono"
            numberOfLines={4}
            onChange={e => onChange(e, 'telephones')}
            value={formData.telephones}
            keyboardType={'numeric'}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          <RequiredField field={'Celular'} required={false} />
          <TextInput
            label="Celular"
            keyboardType={'numeric'}
            numberOfLines={4}
            onChange={e => onChange(e, 'cellphones')}
            value={formData.cellphones}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />

          <View style={styles.space} />

          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Contraseña
          </Text>
          <RequiredField field={'Contraseña'} required={false} />
          <TextInput
            label="Contraseña"
            onChange={e => onChange(e, 'password')}
            value={formData.password}
            right={
              <TextInput.Icon
                name={() => (
                  <Feather
                    name={showPassword ? 'eye-off' : 'eye'}
                    color="grey"
                    size={RFValue(15)}
                  />
                )}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            secureTextEntry={!showPassword}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['password']}
          />
          {FieldError(errors, 'password')}
          <RequiredField field={'Confirmar contraseña'} required={false} />
          <TextInput
            label="Confirmar contraseña"
            right={
              <TextInput.Icon
                name={() => (
                  <Feather
                    name={showConfirmPassword ? 'eye-off' : 'eye'}
                    color="grey"
                    size={RFValue(15)}
                  />
                )}
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
            onChange={e => onChange(e, 'password_confirmation')}
            value={formData.password_confirmation}
            secureTextEntry={!showConfirmPassword}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
            error={errors['password']}
          />
          {FieldError(errors, 'password_confirmation')}
          <View style={styles.space} />
        </View>
        <Loading isVisible={loading} text="Guardando Inquilino" />
      </KeyboardAwareScrollView>

      <View style={styles.viewButton}>
        <PaperButton
          icon="pencil-circle"
          mode="contained"
          style={styles.boton}
          underlineColor={theme.colors.primary}
          theme={theme}
          onPress={() => setLoading(true)}>
          Guardar
        </PaperButton>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
  },
  space: {
    marginBottom: 20,
  },
  viewButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
  },
});

NewTenant.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object,
};

export default NewTenant;
