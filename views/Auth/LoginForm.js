import React, {useState, useRef, useContext, useEffect} from 'react';
import {
  View,
  TouchableOpacity,
  Platform,
  StyleSheet,
  Dimensions,
} from 'react-native';
import * as Animatable from 'react-native-animatable';
import LinearGradient from 'react-native-linear-gradient';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
//import axios from 'axios';
import {validateEmail} from '../../utils/validations';
import {isEmpty} from 'lodash';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/ui/partials/Loading';
import AuthContext from '../../context/autentication/authContext';
import {LOGIN_ERROR} from '../../types';
import {
  Button,
  IconButton,
  Text,
  TextInput,
  useTheme,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import {configFonts, theme} from '../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {messageView} from '../../utils/message';
import colors from '../../styles/colors';

const widthScreen = Dimensions.get('window').height;
const LoginForm = ({setIsLogin}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm());

  const authContext = useContext(AuthContext);
  //console.log(authContext);
  const {logIn, message, error, dispatch, clear} = authContext;

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      dispatch({
        type: LOGIN_ERROR,
        payload: null,
      });
      setLoading(false);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  const onSubmit = async () => {
    if (isEmpty(formData.email.trim()) || isEmpty(formData.password.trim())) {
      messageView('Todos los campos son obligatorios', 'warning', 3000);
    } else if (!validateEmail(formData.email.trim())) {
      messageView('El correo electrónico no es correcto', 'warning', 3000);
    } else {
      setLoading(true);
      logIn({...formData, password: formData.password.trim()});
    }
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

        <TextInput
          value={formData.password}
          label="Contraseña"
          placeholderTextColor={colors.white}
          secureTextEntry={!showPassword}
          onChange={e => onChange(e, 'password')}
          right={
            <TextInput.Icon
              name={() => (
                <Feather
                  name={showPassword ? 'eye-off' : 'eye'}
                  color={colors.black}
                  size={20}
                />
              )}
              onPress={() => setShowPassword(!showPassword)}
            />
          }
          style={styles.input}
        />

        <Button
          uppercase={false}
          onPress={() => {
            setIsLogin(false);
            clear();
          }}
          style={styles.buttonSecondary}>
          <Text style={styles.label}>¿Olvidaste tu contraseña?</Text>
        </Button>

        <Button
          uppercase={false}
          onPress={() => onSubmit()}
          style={styles.button}>
          <Text style={styles.label}>Iniciar sesión</Text>
        </Button>

        <Loading isVisible={loading} text="Iniciando sesión" />
      </Animatable.View>
    </>
  );
};

export default LoginForm;

const defaultValueForm = () => {
  return {
    email: '',
    password: '',
  };
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

LoginForm.propTypes = {
  setIsLogin: PropTypes.func.isRequired,
};
