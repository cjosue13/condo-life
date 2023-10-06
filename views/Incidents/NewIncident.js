/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-color-literals */
import React, {useState, useEffect, useContext, useRef} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {TextInput, Button, Text} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import IncidentContext from '../../context/incidents/IncidentContext';
import FieldError from '../../components/ui/errors/FieldError';
import Loading from '../../components/ui/partials/Loading';
import Toast from 'react-native-easy-toast';
import RequiredField from '../../components/ui/forms/RequiredField';
import UploadPhotos from '../../components/ui/partials/UploadPhotos';
import {Fragment} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import PropTypes from 'prop-types';
import {useIsFocused} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const NewIncident = ({navigation}) => {
  //context
  const incidentContext = useContext(IncidentContext);
  const {createIncident, errors, created, clear, error} = incidentContext;

  const isFocused = useIsFocused();

  const [formData, setFormData] = useState(defaultValueForm());
  const [isLoading, setIsLoading] = useState(false);
  const [imagesSelected, setImagesSelected] = useState([]);

  //const navigation = useNavigation();

  //detectar cuando se esta editando o no

  useEffect(() => {
    if (created) {
      navigation.navigate('incidents');
    }
  }, [created]);

  useEffect(() => {
    if (!isFocused) {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (isLoading) {
      handleFormSubmit();
    }
  }, [isLoading]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
  }, [error]);

  const handleFormSubmit = async () => {
    try {
      const data = getData();
      await createIncident(data);
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setIsLoading(false);
  };

  //get data for send api
  const getData = () => {
    const object = new Object();
    let data;
    if (imagesSelected.length > 0) {
      object.description = formData.description;
      object.subject = formData.subject;
      object.qualification = formData.qualification;
      object.file = imagesSelected;
      data = object;
    } else {
      data = formData;
    }

    return data;
  };

  //onchange fields value
  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
          <Text style={styles.header}>Incidencia</Text>
          <RequiredField field={'Asunto'} />
          <TextInput
            label="Asunto"
            onChange={e => onChange(e, 'subject')}
            value={formData.subject}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'subject')}

          <RequiredField field={'Descripción'} />
          <TextInput
            label="Descripción"
            onChange={e => onChange(e, 'description')}
            value={formData.description}
            multiline
            numberOfLines={4}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'description')}

          <Text style={styles.header}>Imágenes seleccionadas</Text>
          <UploadPhotos
            imagesSelected={imagesSelected}
            setImagesSelected={setImagesSelected}
          />

          <Loading isVisible={isLoading} text="Enviando incidencia" />
        </View>
      </KeyboardAwareScrollView>

      <View style={styles.viewButton}>
        <Button
          style={styles.boton}
          mode="contained"
          underlineColor={theme.colors.primary}
          theme={theme}
          onPress={() => setIsLoading(true)}>
          Enviar
        </Button>
      </View>
    </Fragment>
  );
};

const defaultValueForm = () => {
  return {
    subject: '',
    description: '',
    qualification: '0',
  };
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
  },
  viewButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
  },
});

NewIncident.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default NewIncident;
