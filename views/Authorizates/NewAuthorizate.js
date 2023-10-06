/* eslint-disable react-native/no-inline-styles */
import React, {useState, useEffect, Fragment} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {
  TextInput,
  Button as PaperButton,
  Text,
  Checkbox,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Icon from 'react-native-vector-icons/FontAwesome5';
import UploadPhoto from '../../components/ui/partials/UploadPhoto';
import moment from 'moment';
import {useIsFocused} from '@react-navigation/native';
import AutorizationsContext from '../../context/autorizations/autorizationsContext';
import {useContext} from 'react';
import {useRef} from 'react';
import PropTypes from 'prop-types';
import Loading from '../../components/ui/partials/Loading';
import Toast from 'react-native-easy-toast';
import FieldError from '../../components/ui/errors/FieldError';
import RequiredField from '../../components/ui/forms/RequiredField';
import {Dropdown} from 'sharingan-rn-modal-dropdown';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {MIX_AWS_URL} from '../../Config/environment';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';
import CardView from 'react-native-cardview';

const documentTypesToSelect = [
  {label: 'Cédula', value: 'Cédula'},
  {label: 'Extranjeros', value: 'Extranjeros'},
];

const authorizatesTypesToSelect = [
  {label: 'Permanente', value: 'Permanente'},
  {label: 'Temporal', value: 'Temporal'},
  {label: 'Servicios', value: 'Servicios'},
];

const defaultValue = {
  description: '',
  name: '',
  lastname: '',
  document_id: '',
  document_type: '',
  avatar: '',
  datetime_of_entry: '',
  datetime_of_departure: '',
  allow_holidays: false,
  file: '',
  allowed_days: {
    lunes: true,
    martes: true,
    miercoles: true,
    jueves: true,
    viernes: true,
    sabado: true,
    domingo: true,
  },
};

const getValues = item => {
  const allowed_days = JSON.parse(item.allowed_days);
  return {
    ...item,
    allowed_days,
    allow_holidays: item.allow_holidays !== 0,
    datetime_of_entry:
      item.datetime_of_entry !== '0000-00-00 00:00:00'
        ? moment(item.datetime_of_entry).format('YYYY-MM-DD HH:mm')
        : '',
    datetime_of_departure:
      item.datetime_of_departure !== '0000-00-00 00:00:00'
        ? moment(item.datetime_of_departure).format('YYYY-MM-DD HH:mm')
        : '',
  };
};
const NewAuthorizate = ({navigation, route}) => {
  //get function of other components
  const isFocused = useIsFocused();
  const autorizate = route.params?.item ? route.params.item : null;

  //campos formulario
  const [formData, setFormData] = useState(
    autorizate ? getValues(autorizate) : defaultValue,
  );

  const [imagesSelected, setImagesSelected] = useState(
    formData.avatar &&
      formData.avatar !== 'undefined' &&
      formData.avatar !== null
      ? [{uri: MIX_AWS_URL + formData.avatar}]
      : [],
  );

  const [isDatePickerVisibleEntry, setDatePickerVisibilityEntry] =
    useState(false);
  const [isDatePickerVisibleDeparture, setDatePickerVisibilityDeparture] =
    useState(false);

  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState(
    autorizate ? autorizate.document_type : 'Cédula',
  );

  const displayDatesRange = () => {
    const data = autorizate;

    let schedule = '';

    if (data.autorization_type) {
      schedule = `${data.autorization_type}`;
    } else {
      if (data.datetime_of_entry === '0000-00-00 00:00:00') {
        schedule = 'Permanente';
      } else {
        schedule = `Temporal`;
      }
    }

    return schedule;
  };

  const [authorizateType, setAuthorizateType] = useState(
    autorizate ? displayDatesRange() : 'Temporal',
  );

  const autorizationContext = useContext(AutorizationsContext);

  const {
    error,
    errors,
    created,
    edited,
    createAuthorizate,
    updateAuthorizate,
    clear,
  } = autorizationContext;

  //detectar cuando se esta editando o no
  useEffect(() => {
    if (created || edited) {
      navigation.navigate('authorizates');
    }
  }, [created, edited]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      // clear();
    }
  }, [error]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]);

  const handleConfirmEntry = date => {
    const selectDate = moment(date).format('YYYY-MM-DD HH:mm');
    setFormData({
      ...formData,
      datetime_of_entry: selectDate,
    });

    hideDatePickerEntry();
  };

  const handleConfirmDeparture = date => {
    const selectDate = moment(date).format('YYYY-MM-DD HH:mm');
    setFormData({
      ...formData,
      datetime_of_departure: selectDate,
    });

    hideDatePickerDeparture();
  };

  //Muestra u oculta el Time Picker
  const showDatePickerEntry = () => {
    setDatePickerVisibilityEntry(true);
  };

  const hideDatePickerEntry = () => {
    setDatePickerVisibilityEntry(false);
  };

  const showDatePickerDeparture = () => {
    setDatePickerVisibilityDeparture(true);
  };

  const hideDatePickerDeparture = () => {
    setDatePickerVisibilityDeparture(false);
  };

  const handleFormSubmit = async () => {
    try {
      const data = {
        ...formData,
        autorization_type: authorizateType,
        document_type: documentType,
        document_id:
          formData.document_id.trim() !== ''
            ? formData.document_id.trim()
            : '0',
        file: imagesSelected.length > 0 ? imagesSelected[0] : null,
      };

      if (formData.id) {
        await updateAuthorizate(data, formData.id);
      } else {
        await createAuthorizate(data);
      }
    } catch (errorMessage) {
      messageView(errorMessage, 'danger', 3000);
    }
    setLoading(false);
  };

  //Onchange for field texts
  const onChange = (e, type, dayOfWeek) => {
    if (dayOfWeek !== undefined) {
      setFormData({
        ...formData,
        allowed_days: {
          ...formData.allowed_days,
          [type]: dayOfWeek,
        },
      });
    } else {
      setFormData({
        ...formData,
        [type]: e.nativeEvent.text,
      });
    }
  };

  return (
    <CardView
      style={styles.listItem}
      cardElevation={7}
      cardMaxElevation={2}
      cornerRadius={10}>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
          <Text style={styles.header}>Información personal</Text>
          <View style={styles.viewImages}>
            <UploadPhoto
              imagesSelected={imagesSelected}
              setImagesSelected={setImagesSelected}
            />
            <Text style={styles.field}>
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
          <RequiredField field={'Número de identificación'} required={false} />
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
          <RequiredField field={'Descripción'} required={false} />

          <TextInput
            label="Descripción"
            multiline
            numberOfLines={4}
            style={styles.input}
            onChange={e => onChange(e, 'description')}
            value={formData.description}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'description')}

          <View style={styles.space} />

          <RequiredField field={'Tipo de autorizado'} />
          <Dropdown
            label="Tipo de autorizado"
            data={authorizatesTypesToSelect}
            primaryColor={theme.colors.primary}
            textInputStyle={styles.input}
            value={authorizateType}
            onChange={setAuthorizateType}
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

          <RequiredField field={'Fecha y hora de entrada'} required={false} />

          <TextInput
            pointerEvents="none"
            value={formData.datetime_of_entry}
            label="Fecha y hora de entrada"
            editable={false}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    name={'calendar-day'}
                    color={theme.colors.primary}
                    iconStyle={{color: theme.colors.primary}}
                    size={RFValue(15)}
                  />
                )}
                onPress={() => showDatePickerEntry()}
              />
            }
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'datetime_of_entry')}

          <RequiredField field={'Fecha y hora de salida'} required={false} />

          <TextInput
            pointerEvents="none"
            value={formData.datetime_of_departure}
            label="Fecha y hora de salida"
            style={styles.input}
            editable={false}
            right={
              <TextInput.Icon
                name={() => (
                  <Icon
                    name={'calendar-day'}
                    color={theme.colors.primary}
                    iconStyle={{color: theme.colors.primary}}
                    size={RFValue(15)}
                  />
                )}
                onPress={() => showDatePickerDeparture()}
              />
            }
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'datetime_of_departure')}
          <View style={styles.space} />

          <View>
            <DateTimePickerModal
              isVisible={isDatePickerVisibleEntry}
              mode="datetime"
              onConfirm={handleConfirmEntry}
              onCancel={hideDatePickerEntry}
              locale="es_Es"
              cancelTextIOS="Cancelar"
              confirmTextIOS="Confirmar"
              headerTextIOS="Elige un elemento"
            />

            <DateTimePickerModal
              isVisible={isDatePickerVisibleDeparture}
              mode="datetime"
              onConfirm={handleConfirmDeparture}
              onCancel={hideDatePickerDeparture}
              locale="es_Es"
              cancelTextIOS="Cancelar"
              confirmTextIOS="Confirmar"
              headerTextIOS="Elige un elemento"
            />
          </View>

          <Text style={styles.header}>Días autorizados</Text>
          <View style={styles.space} />

          <View>
            <Text style={styles.authorizateWeek}>
              ¿Desea permitir el ingreso en días feriados?
            </Text>
            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allow_holidays ? 'checked' : 'unchecked'}
                onPress={() => {
                  setFormData({
                    ...formData,
                    allow_holidays: !formData.allow_holidays,
                  });
                }}
                color={theme.colors.primary}
                underlineColor={theme.colors.primary}
                theme={theme}
              />
              <Text style={styles.weekText}>Permitir días feriados</Text>
            </View>
          </View>

          <View style={styles.checkView}>
            <Text style={styles.authorizateWeek}>
              Seleccione los días de entrada del autorizado a la filial:
            </Text>
            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.lunes ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'lunes', !formData.allowed_days.lunes);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Lunes</Text>
            </View>
            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.martes ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'martes', !formData.allowed_days.martes);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Martes</Text>
            </View>

            <View style={styles.checkElement}>
              <Checkbox.Android
                status={
                  formData.allowed_days.miercoles ? 'checked' : 'unchecked'
                }
                onPress={() => {
                  onChange(null, 'miercoles', !formData.allowed_days.miercoles);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Miércoles</Text>
            </View>

            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.jueves ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'jueves', !formData.allowed_days.jueves);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Jueves</Text>
            </View>

            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.viernes ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'viernes', !formData.allowed_days.viernes);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Viernes</Text>
            </View>

            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.sabado ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'sabado', !formData.allowed_days.sabado);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Sábado</Text>
            </View>

            <View style={styles.checkElement}>
              <Checkbox.Android
                status={formData.allowed_days.domingo ? 'checked' : 'unchecked'}
                onPress={() => {
                  onChange(null, 'domingo', !formData.allowed_days.domingo);
                }}
                underlineColor={theme.colors.primary}
                theme={theme}
                color={theme.colors.primary}
              />
              <Text style={styles.weekText}>Domingo</Text>
            </View>
          </View>
        </View>
        <Loading isVisible={loading} text="Guardando Autorizado" />
      </KeyboardAwareScrollView>

      <View style={styles.viewButton}>
        <PaperButton
          mode="contained"
          style={styles.boton}
          underlineColor={theme.colors.primary}
          theme={theme}
          onPress={() => setLoading(true)}>
          Guardar
        </PaperButton>
      </View>
    </CardView>
  );
};

const styles = StyleSheet.create({
  authorizateWeek: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(15),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginBottom: 10,
    marginLeft: 5,
    marginTop: 10,
  },
  boton: {
    backgroundColor: theme.colors.primary,
  },

  checkElement: {
    flexDirection: 'row',
  },
  checkView: {
    flexDirection: 'column',
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
    marginBottom: 20,
  },
  listItem: {
    backgroundColor: colors.white,
    justifyContent: 'center',
    margin: '2.5%',
    maxHeight: '80%',
    minHeight: '80%',
    padding: '2.5%',
  },

  space: {
    marginBottom: 20,
  },

  viewButton: {
    backgroundColor: colors.white,
    padding: 12,
  },
  viewImages: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  weekText: {
    fontSize: RFValue(15),
    marginTop: 5,
  },
});

NewAuthorizate.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default NewAuthorizate;
