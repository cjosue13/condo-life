import React, {useState} from 'react';
import {StyleSheet} from 'react-native';
import * as Animatable from 'react-native-animatable';
import Loading from '../../components/ui/partials/Loading';
import {Button, Text, TextInput, useTheme} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import {useContext} from 'react';
import authContext from '../../context/autentication/authContext';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';
import colors from '../../styles/colors';

const defaultValueForm = {
  email: '',
};

const ForgetPassword = ({setIsLogin}) => {
  const {colors} = useTheme();
  const auth = useContext(authContext);
  //console.log(authContext);
  const {message, error, clear, forgetPassword} = auth;

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clear();
    }
    if (message) {
      messageView(message, 'success', 3000);
      clear();
      setFormData(defaultValueForm);
    }
  }, [error, message]);

  useEffect(() => {
    if (loading) {
      handleSubmit();
    }
  }, [loading]);

  const handleSubmit = async () => {
    if (formData.email.trim() !== '') {
      try {
        await forgetPassword(formData);
      } catch (error) {
        messageView(error, 'danger', 3000);
      }
    } else {
      messageView('Debes digitar un correo electrónico.', 'warning', 3000);
    }

    setLoading(false);
  };

  const onSubmit = () => {
    setLoading(true);
  };

  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  return (
    <>
      <Animatable.View animation="fadeInUpBig" style={[styles.footer]}>
        <TextInput
          value={formData.email}
          label="Correo electrónico"
          placeholderTextColor={colors.white}
          onChange={e => onChange(e, 'email')}
          style={styles.input}
        />
        <Button
          uppercase={false}
          onPress={() => {
            setIsLogin(true);
          }}
          style={styles.buttonSecondary}>
          <Text style={styles.label}>Inicio de sesión</Text>
        </Button>

        <Button
          uppercase={false}
          onPress={() => onSubmit()}
          style={styles.button}>
          <Text style={styles.label}>Enviar enlace</Text>
        </Button>

        <Loading isVisible={loading} text="Enviando Correo" />
      </Animatable.View>
    </>
  );
};

export default ForgetPassword;

ForgetPassword.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};
const styles = StyleSheet.create({
  button: {backgroundColor: colors.primary, marginVertical: '2.5%'},
  buttonSecondary: {
    backgroundColor: colors.cancelButton,
    marginVertical: '2.5%',
  },
  footer: {
    backgroundColor: colors.transparent,
    justifyContent: 'center',
    margin: '2.5%',
  },

  input: {
    backgroundColor: colors.white,
    color: colors.white,
    marginVertical: '2.5%',
  },
  label: {color: colors.header, fontSize: RFValue(16), fontWeight: 'bold'},
});
