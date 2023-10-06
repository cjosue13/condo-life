/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-color-literals */
import React, {useRef} from 'react';
import {useContext} from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  FAB,
  ActivityIndicator,
  Portal,
  Modal,
  TextInput,
  Button as PaperButton,
  Text,
} from 'react-native-paper';
import {Avatar} from 'react-native-elements';
import {MIX_AWS_URL} from '../../Config/environment';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {useIsFocused} from '@react-navigation/native';
import {ScrollView} from 'react-native-gesture-handler';
import {useState} from 'react';
import PropTypes from 'prop-types';
import AutorizationsContext from '../../context/autorizations/autorizationsContext';
import Toast from 'react-native-easy-toast';
import {useEffect} from 'react';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {v4 as uuidv4} from 'uuid';
import Loading from '../../components/ui/partials/Loading';
import {haveRestrictions} from '../../utils/auth';
import authContext from '../../context/autentication/authContext';
import QRCode from 'react-native-qrcode-svg';
import moment from 'moment';
import Share from 'react-native-share';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {messageView} from '../../utils/message';
import {randomString} from '../../utils/helpers';
import CardView from 'react-native-cardview';

const windowWidth = Dimensions.get('window').width;

const DetailsAuthorizate = ({navigation, route}) => {
  const {item, previous} = route.params;

  const autorizationContext = useContext(AutorizationsContext);
  const {
    deleteAutorizate,
    error,
    deleted,
    clear,
    loadSubsidiarys,
    subsidiarys,
    sendQR,
    message,
    send,
    createCode,
    clearMessages,
    code,
  } = autorizationContext;

  const auth = useContext(authContext);
  const {user} = auth;

  const [state, setState] = useState({open: false});
  const isFocused = useIsFocused();
  const [imageURL, setImageURL] = useState('');
  const [base64, setBase64] = useState('');
  const [mail, setMail] = useState('');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submit, setSubmit] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false);
    setMail('');
  };

  const saveQRCode = codeQR => {
    codeQR?.toDataURL(callBack);
  };

  const callBack = dataURL => {
    setBase64(`data:image/png;base64,${dataURL}`);
  };

  useEffect(() => {
    if (!isFocused) {
      clear();
    } else {
      loadSubsidiarys();
    }
  }, [isFocused]);

  useEffect(() => {
    if (send) {
      hideModal();
    }
  }, [send]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  useEffect(() => {
    if (error && isFocused) {
      messageView(error, 'danger', 3000);
      clearMessages();
    } else if (deleted) {
      navigation.navigate('authorizates');
    } else if (message) {
      messageView(message, 'success', 3000);
      clearMessages();
    }
  }, [error, deleted, message]);

  useEffect(() => {
    if (submit) {
      formSend();
    }
  }, [submit]);

  const formSend = async () => {
    setSubmit(true);
    try {
      await createCode(getDataCode());
    } catch (error) {
      messageView('Ha ocurrido un error generando el código', 'danger', 3000);
    }
    setSubmit(false);
  };

  const onStateChange = ({open}) => setState({open});

  const deleteItem = async () => {
    try {
      await deleteAutorizate(item.id);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
  };

  const shareImage = async () => {
    try {
      // get the data
      // await saveImage(base64);

      let shareOptions = {
        title: 'Código',
        url: base64,
        message: 'Hola, este es el código QR para poder entrar al condominio',
        subject: 'Autorizado de condominio',
      };

      if (Platform.OS == 'ios') {
        delete shareOptions.message;
      }

      await Share.open(shareOptions)
        .then(() => {
          messageView('Acción realizada exitosamente.', 'success', 3000);
        })
        .catch(() => {
          messageView('No se ha realizado ninguna acción.', 'warning', 3000);
        });
    } catch (error) {
      messageView('No se ha podido enviar el código QR.', 'danger', 3000);
    }
  };

  const shareCode = async () => {
    try {
      let shareOptions = {
        title: 'Código',
        message: code.code,
        subject: 'Autorizado de condominio',
      };

      await Share.open(shareOptions)
        .then(() => {
          messageView('Acción realizada exitosamente.', 'success', 3000);
        })
        .catch(() => {
          messageView('No se ha realizado ninguna acción.', 'warning', 3000);
        });
    } catch (error) {
      messageView('No se ha podido enviar el código QR.', 'danger', 3000);
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (mail.trim() !== '') {
        await sendQR({file: base64, mail});
      } else {
        messageView(
          'El correo electrónico es un campo requerido.',
          'warning',
          3000,
        );
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  const confirmCode = () => {
    Alert.alert(
      'Información de código',
      '¿Estás seguro de que deseas generar un nuevo código para este autorizado?',
      [
        {text: 'Si, crear', onPress: () => setSubmit(true)},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const confirmQR = () => {
    Alert.alert(
      'Información de código QR',
      '¿Estás seguro de que deseas generar un nuevo código QR para este autorizado?',
      [
        {text: 'Si, crear', onPress: () => generateQR()},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const showConfirmation = () => {
    Alert.alert(
      '¿Deseas eliminar este autorizado?',
      'Un autorizado eliminado no se puede recuperar',
      [
        {text: 'Si, Eliminar', onPress: () => deleteItem()},
        {text: 'Cancelar', style: 'cancel'},
      ],
    );
  };

  const generateQR = async () => {
    try {
      // get the data
      let data = getData();

      setImageURL(JSON.stringify(data));
      messageView('Código QR generado correctamente.', 'success', 3000);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
  };

  const getData = () => {
    let authorizedObject = new Object();
    const authorized = item;

    const filial = getSelectFilial(authorized.filial_id, authorized.user_id);
    authorizedObject.uuid = uuidv4();
    authorizedObject.id = authorized.id;
    authorizedObject.name = authorized.name;
    authorizedObject.lastname = authorized.lastname;
    authorizedObject.filial_id = authorized.filial_id;
    authorizedObject.document_type = authorized.document_type;
    authorizedObject.document_id = authorized.document_id;
    authorizedObject.filial = filial;

    return authorizedObject;
  };

  const getDataCode = () => {
    let authorizedObject = new Object();
    const authorized = item;
    const filial = getSelectFilial(authorized.filial_id, authorized.user_id);

    authorizedObject.code = randomString(6);
    authorizedObject.authorized_id = authorized.id;
    authorizedObject.name = authorized.name;
    authorizedObject.lastname = authorized.lastname;
    authorizedObject.label = filial[0].label;
    authorizedObject.filial_id = authorized.filial_id;
    authorizedObject.document_type = authorized.document_type;
    authorizedObject.document_id = authorized.document_id;
    authorizedObject.used = 0;

    return authorizedObject;
  };

  const getSelectFilial = (filialId, userId) => {
    const filials = displayFiliales();

    let filial = filials.filter(
      item => item.value === filialId && item.user_id === userId,
    );

    return filial;
  };

  const displayFiliales = () => {
    const opts = [];
    subsidiarys.map(filial => {
      if (filial.users.length > 0)
        return filial.users.map(user => {
          opts.push({
            label: `${filial.name} - ${user.fullname}`,
            value: filial.id,
            user_id: user.pivot.user_id,
          });
        });
      else
        opts.push({
          label: filial.name,
          value: filial.id,
        });
    });

    return opts;
  };

  const {open} = state;

  const allowed_days = JSON.parse(item.allowed_days);

  const actionsData = previous
    ? [
        {
          icon: 'delete',
          style: styles.fabStyle,
          label: 'Eliminar',
          onPress: () => showConfirmation(),
        },
        {
          icon: 'lead-pencil',
          label: 'Editar',
          style: styles.fabStyle,
          onPress: () => navigation.navigate('newAuthorizate', {item}),
        },
      ]
    : [
        {
          icon: 'delete',
          style: styles.fabStyle,
          label: 'Eliminar',
          onPress: () => showConfirmation(),
        },
        {
          icon: 'lock-open-check',
          style: styles.fabStyle,
          label: 'Código',
          onPress: () => confirmCode(),
        },
        {
          icon: 'qrcode-plus',
          style: styles.fabStyle,
          label: 'Código QR',
          onPress: () => confirmQR(),
        },
        {
          icon: 'lead-pencil',
          label: 'Editar',
          style: styles.fabStyle,
          onPress: () => navigation.navigate('newAuthorizate', {item}),
        },
      ];

  let actions = actionsData.filter(item => {
    if (!haveRestrictions('Eliminar autorizado', user.restrictions)) {
      return item;
    } else if (item.icon !== 'delete') {
      return item;
    }
  });

  actions = actions.filter(item => {
    if (!haveRestrictions('Actualizar autorizado', user.restrictions)) {
      return item;
    } else if (item.icon !== 'lead-pencil') {
      return item;
    }
  });

  const displayDatesRange = () => {
    const data = item;

    let entry = moment(data.datetime_of_entry);
    let departure = moment(data.datetime_of_departure);

    let schedule = '';

    if (data.autorization_type) {
      schedule = ` ${data.autorization_type} `;
      if (data.datetime_of_entry !== '0000-00-00 00:00:00') {
        schedule += ` ${entry.format(
          'YYYY-MM-DD HH:mm:ss a',
        )} - ${departure.format('YYYY-MM-DD HH:mm:ss a')}`;
      }
    } else {
      if (data.datetime_of_entry === '0000-00-00 00:00:00') {
        schedule = ' Permanente';
      } else {
        schedule = ` Temporal ${entry.format(
          'YYYY-MM-DD HH:mm:ss a',
        )} - ${departure.format('YYYY-MM-DD HH:mm:ss a')}`;
      }
    }

    return schedule;
  };

  return (
    <View style={styles.item}>
      <Loading text={'Generando código'} isVisible={submit} />
      <CardView
        style={styles.listItem}
        cardElevation={7}
        cardMaxElevation={2}
        cornerRadius={10}>
        <Avatar
          rounded
          PlaceholderContent={<ActivityIndicator color="fff" />}
          source={
            item.avatar !== 'undefined' && item.avatar !== null
              ? {uri: MIX_AWS_URL + item.avatar}
              : require('../../assets/images/Profile.png')
          }
          size={RFValue(80)}
          containerStyle={styles.centerContainer}
        />
        <Text style={styles.namesText}>{item?.fullname}</Text>
        <ScrollView>
          <View style={styles.centerContainer}>
            {item.description !== 'N/A' && (
              <View style={globalStyles.containerItem}>
                <Text style={globalStyles.itemText}>{item.description}</Text>
              </View>
            )}
          </View>
          <View>
            {item.document_id !== '0' && (
              <View style={globalStyles.containerItem}>
                <MaterialCommunityIcons
                  style={styles.iconStyles}
                  color={colors.white}
                  name="card-account-details"
                />
                <Text
                  style={globalStyles.itemText}>{` ${item.document_id}`}</Text>
              </View>
            )}
            <Text style={styles.subtitle}>
              Tipo de autorizado:
              <Text style={styles.itemText}>{displayDatesRange()}</Text>
            </Text>

            <Text style={styles.subtitle}>Días disponibles:</Text>
            {allowed_days.lunes && (
              <Text style={styles.itemText}>{` · Lunes`}</Text>
            )}
            {allowed_days.martes && (
              <Text style={styles.itemText}>{` · Martes`}</Text>
            )}
            {allowed_days.miercoles && (
              <Text style={styles.itemText}>{` · Miércoles`}</Text>
            )}
            {allowed_days.jueves && (
              <Text style={styles.itemText}>{` · Jueves`}</Text>
            )}
            {allowed_days.viernes && (
              <Text style={styles.itemText}>{` · Viernes`}</Text>
            )}
            {allowed_days.sabado && (
              <Text style={styles.itemText}>{` · Sábado`}</Text>
            )}
            {allowed_days.domingo && (
              <Text style={styles.itemText}>{` · Domingo`}</Text>
            )}
          </View>
        </ScrollView>
      </CardView>

      {imageURL.trim() !== '' && (
        <TouchableOpacity onPress={() => showModal()}>
          <View style={styles.results}>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={colors.black}
              name="qrcode"
            />
            <Text style={styles.title}>Ver código QR</Text>
          </View>
        </TouchableOpacity>
      )}
      {code && (
        <TouchableOpacity onPress={() => shareCode()}>
          <View style={styles.results}>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={colors.black}
              name="lock-open-check"
            />
            <Text style={styles.title}>{code.code}</Text>
          </View>
        </TouchableOpacity>
      )}

      <Portal>
        <Modal
          visible={visible}
          onDismiss={hideModal}
          contentContainerStyle={styles.containerStyle}>
          <ScrollView>
            <Text style={styles.header}>Toca el código para compartirlo</Text>
            <View style={styles.center}>
              {imageURL.trim() !== '' && (
                <TouchableOpacity
                  onPress={() => {
                    shareImage();
                  }}>
                  <QRCode
                    value={imageURL}
                    quietZone={10}
                    getRef={c => {
                      saveQRCode(c);
                    }}
                    size={RFValue(200)}
                  />
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </Modal>
      </Portal>

      {actions.length > 0 && (
        <Portal>
          <FAB.Group
            style={styles.fabGroup}
            fabStyle={styles.fabStyle}
            visible={isFocused && !visible}
            open={open}
            icon={open ? 'close' : 'plus'}
            actions={actions}
            onStateChange={onStateChange}
            onPress={() => {
              if (open) {
                // do something if the speed dial is open
              }
            }}
          />
        </Portal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  centerContainer: {
    marginLeft: 'auto',
    marginRight: 'auto',
    marginTop: '2.5%',
  },
  containerStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    margin: 20,
    padding: 20,
  },
  fabGroup: {paddingBottom: 80, paddingRight: 20, position: 'absolute'},
  fabStyle: {
    backgroundColor: colors.cancelButton,
    color: colors.white,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  iconStyles: {
    fontSize: RFValue(20),
    textDecorationStyle: 'solid',
  },
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  itemText: {
    color: colors.white,
    fontSize: RFValue(10),
    fontWeight: 'normal',
    margin: 10,
  },
  listItem: {
    backgroundColor: colors.primary,
    margin: 20,
    maxHeight: '60%',
    minHeight: '60%',
    padding: 2,
    width: '100%',
  },
  namesText: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 10,
    textAlign: 'center',
  },
  results: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },

  subtitle: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(10),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
  },
  title: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(14),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 10,
  },
});

DetailsAuthorizate.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default DetailsAuthorizate;
