import React, {useState, useEffect, useContext, Fragment, useRef} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {
  TextInput,
  DefaultTheme,
  Button as PaperButton,
  Text,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import PetsContext from '../../context/pets/petsContext';
import FieldError from '../../components/ui/errors/FieldError';
import UploadPhoto from '../../components/ui/partials/UploadPhoto';
import PropTypes from 'prop-types';
import Toast from 'react-native-easy-toast';
import Loading from '../../components/ui/partials/Loading';
import RequiredField from '../../components/ui/forms/RequiredField';
import {MIX_AWS_URL} from '../../Config/environment';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const NewPet = ({navigation, route}) => {
  //context
  const petsContext = useContext(PetsContext);
  const {createPet, created, errors, clearErrors, updatePet, edited, error} =
    petsContext;
  const [loading, setLoading] = useState(false);
  const [imagesSelected, setImagesSelected] = useState([]);
  const [formData, setFormData] = useState(defaultValueForm());

  //detectar cuando se esta editando o no
  useEffect(() => {
    //check is edit
    if (route.params.pet) {
      const {name, breed, description, image_url, id} = route.params.pet;
      navigation.setOptions({title: 'Editar Mascota'});
      setFormData({
        name,
        breed,
        description,
        image_url,
        id,
      });

      if (image_url !== 'undefined' && image_url)
        setImagesSelected([{uri: MIX_AWS_URL + image_url}]);
    } else {
      navigation.setOptions({title: 'Crear Mascota'});
    }

    if (created || edited) {
      navigation.navigate('pets');
    }

    clearErrors();
  }, [created, edited]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      // clearErrors();
    }
  }, [error]);

  //get data for send api
  const getData = () => {
    const object = new Object();
    let data;
    if (imagesSelected.length > 0) {
      // delete imagesSelected[0].uri;
      object.name = formData.name;
      object.breed = formData.breed;
      object.description = formData.description || 'N/A';
      object.file = imagesSelected[0];
      // object.image_url = imagesSelected[0];
      data = object;
    } else {
      data = {...formData, description: formData.description || 'N/A'};
    }

    return data;
  };

  //Onchange for field texts
  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  const handleFormSubmit = async () => {
    try {
      //get data for api
      const data = getData();
      //send request to api
      if (route.params.pet) {
        await updatePet(formData.id, data);
      } else {
        await createPet(data);
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }

    setLoading(false);
  };

  return (
    <>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
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
          />
          {FieldError(errors, 'name')}

          <RequiredField field={'Raza'} />

          <TextInput
            label="Raza"
            onChange={e => onChange(e, 'breed')}
            value={formData.breed}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'breed')}

          <RequiredField field={'Descripción'} required={false} />
          <TextInput
            label="Descripción"
            multiline
            numberOfLines={4}
            onChange={e => onChange(e, 'description')}
            value={formData.description}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
        </View>
        <Loading isVisible={loading} text="Guardando Mascota" />
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
    </>
  );
};

const defaultValueForm = () => {
  return {
    name: '',
    breed: '',
    description: '',
    image_url: '',
    file: null,
  };
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
  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
  },
  viewButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
  },
  viewImages: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

NewPet.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object,
};

export default NewPet;
