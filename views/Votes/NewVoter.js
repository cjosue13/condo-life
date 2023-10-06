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
import Loading from '../../components/ui/partials/Loading';
import FieldError from '../../components/ui/errors/FieldError';
import Toast from 'react-native-easy-toast';
import Feather from 'react-native-vector-icons/Feather';
import RequiredField from '../../components/ui/forms/RequiredField';
import PropTypes from 'prop-types';
import VotingsContext from '../../context/votings/votingsContext';
import UploadFiles from '../../components/ui/partials/UploadFiles';
import {useIsFocused} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const defaultValueForm = {
  name: '',
  lastname: '',
  email: '',
  document_id: '',
  document_type: 'Cédula',
  authorized: false,
  password: '',
  password_confirmation: '',
  role_id: 7,
};

const NewVoter = ({navigation}) => {
  const [formData, setFormData] = useState(defaultValueForm);
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [filesSelected, setFilesSelected] = useState([]);
  const votingContext = useContext(VotingsContext);

  //focus screen
  const isFocused = useIsFocused();

  const {errors, message, error, created, createVoting, clear} = votingContext;

  useEffect(() => {
    if (created) {
      clear();
      navigation.navigate('votes');
    }
  }, [created]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      // clearErrors();
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    if (saving) {
      handleFormSubmit();
    }
  }, [saving]);

  useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]);

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  const handleFormSubmit = async () => {
    try {
      const data = {
        ...formData,
        file: filesSelected.length > 0 ? filesSelected : null,
      };
      await createVoting(data);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setSaving(false);
  };

  return (
    <Fragment>
      <ScrollView>
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
            Archivos seleccionados
          </Text>
          <UploadFiles
            filesSelected={filesSelected}
            setFilesSelected={setFilesSelected}
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
        <Loading isVisible={saving} text="Guardando Votante" />
      </ScrollView>

      <View style={styles.viewButton}>
        <PaperButton
          icon="pencil-circle"
          mode="contained"
          style={styles.boton}
          underlineColor={theme.colors.primary}
          theme={theme}
          onPress={() => setSaving(true)}>
          Guardar
        </PaperButton>
      </View>
    </Fragment>
  );
};

export default NewVoter;

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

NewVoter.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object,
};
