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
import Loading from '../../components/ui/partials/Loading';
import FieldError from '../../components/ui/errors/FieldError';
import Toast from 'react-native-easy-toast';
import Feather from 'react-native-vector-icons/Feather';
import RequiredField from '../../components/ui/forms/RequiredField';
import {Dropdown} from 'sharingan-rn-modal-dropdown';
import PropTypes from 'prop-types';
import ProfileContext from '../../context/profile/profileContext';
import UploadPhoto from '../../components/ui/partials/UploadPhoto';
import {loadOptionsSelect} from '../../utils/helpers';
import {MIX_AWS_URL} from '../../Config/environment';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const documentTypesToSelect = [
  {label: 'Cédula', value: 'Cédula'},
  {label: 'Residencia', value: 'Residencia'},
  {label: 'Pasaporte', value: 'Pasaporte'},
];

const FormProfile = ({navigation}) => {
  const profileContext = useContext(ProfileContext);
  const {profile, errors, error, edited, updateProfile} = profileContext;
  const [formData, setFormData] = useState({
    ...profile,
    password: '',
    password_confirmation: '',
    telephones: loadOptionsSelect(JSON.parse(profile.telephones)),
    cellphones: loadOptionsSelect(JSON.parse(profile.cellphones)),
    parking_number: loadOptionsSelect(JSON.parse(profile.parking_number)),
    warehouse_number: loadOptionsSelect(JSON.parse(profile.warehouse_number)),
  });
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState(formData.document_type);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [imagesSelected, setImagesSelected] = useState(
    profile.avatar ? [{uri: MIX_AWS_URL + profile.avatar}] : [],
  );

  //Onchange for field texts
  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  //detectar cuando se esta editando o no
  useEffect(() => {
    if (edited) {
      navigation.navigate('profile');
    }
  }, [edited]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  const handleFormSubmit = async () => {
    try {
      const newProfile = {
        ...formData,
        document_type: documentType,
        file: imagesSelected.length > 0 ? imagesSelected[0] : null,
      };
      delete newProfile.avatar;
      await updateProfile(formData.id, newProfile);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  return (
    <>
      <View style={globalStyles.container}>
        <KeyboardAwareScrollView>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Información personal
          </Text>
          <View style={styles.viewImages}>
            <UploadPhoto
              imagesSelected={imagesSelected}
              setImagesSelected={setImagesSelected}
            />
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.field}>
              {imagesSelected.length > 0
                ? 'Cambiar Fotografía'
                : 'Subir Fotografía'}
            </Text>
          </View>
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
            underlineColor={theme.colors.primary}
            paperTheme={theme}
            textInputPlaceholder="Selecciona un item"
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

          {/* <TextInput
            label="Número de parqueos"
            keyboardType={'numeric'}
            numberOfLines={4}
            onChange={e => onChange(e, 'parking_number')}
            value={formData.parking_number}
            style={styles.input}
            theme={{colors: {primary: theme.colors.primary}}}
          />
          <TextInput
            label="Número de bodegas"
            keyboardType={'numeric'}
            numberOfLines={4}
            onChange={e => onChange(e, 'warehouse_number')}
            value={formData.warehouse_number}
            style={styles.input}
            theme={{colors: {primary: theme.colors.primary}}}
          />*/}
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
        </KeyboardAwareScrollView>
        <Loading isVisible={loading} text="Actualizando perfil" />
      </View>
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
    </>
  );
};
const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  field: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
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
  viewImages: {
    alignItems: 'center',
  },
});

FormProfile.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default FormProfile;
