import React, {useState, useEffect, Fragment, useContext, useRef} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {TextInput, Button as PaperButton, Text} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import UploadPhoto from '../../components/ui/partials/UploadPhoto';
import {MIX_AWS_URL} from '../../Config/environment';
import RequiredField from '../../components/ui/forms/RequiredField';
import VehiclesContext from '../../context/vehicles/vehiclesContext';
import Loading from '../../components/ui/partials/Loading';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const defaultValueForm = {
  plate: '',
  color: '',
  model_brand: '',
  file: '',
};

const NewPet = ({navigation, route}) => {
  const vehicleContext = useContext(VehiclesContext);
  const {vehicles, errors, message, updateFilial, created, edited} =
    vehicleContext;

  // (created, edited);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState(defaultValueForm);

  const [imagesSelected, setImagesSelected] = useState([]);

  useEffect(() => {
    //check is edit
    if (route?.params?.vehicle) {
      const {plate, model_brand, color, file} = route.params.vehicle;
      navigation.setOptions({title: 'Editar Vehículo'});
      setFormData({
        plate,
        model_brand,
        color,
        file: file ? file : '',
      });

      if (file) setImagesSelected([{uri: MIX_AWS_URL + file, filename: file}]);
    } else {
      navigation.setOptions({title: 'Crear Vehículo'});
    }

    if (created || edited) {
      navigation.navigate('vehicles');
    }

    // clearErrors();
  }, [created, edited]);

  useEffect(() => {
    if (message && !created && !edited) {
      messageView(message, 'success', 3000);
    }
  }, [message]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  const handleFormSubmit = async () => {
    try {
      if (formData.plate.trim() !== '') {
        await updateFilial({
          ...formData,
          file: imagesSelected.length > 0 ? imagesSelected[0] : null,
          vehicles: route.params.vehicle
            ? validateData()
            : [
                ...vehicles,
                {
                  ...formData,
                  file:
                    imagesSelected.length > 0
                      ? imagesSelected[0].filename
                      : formData.file,
                },
              ],
        });
      } else {
        messageView('El campo placa es requerido.', 'warning', 3000);
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setLoading(false);
  };

  const onChange = (e, type) => {
    setFormData({
      ...formData,
      [type]: e.nativeEvent.text,
    });
  };

  const validateData = () => {
    const arrayVehicles = vehicles.filter(
      item => item.plate !== route.params.vehicle.plate,
    );
    return [
      ...arrayVehicles,
      {
        ...formData,
        file:
          imagesSelected.length > 0
            ? imagesSelected[0].filename
            : formData.file,
      },
    ];
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
            <Text style={styles.field}>
              {imagesSelected.length > 0
                ? 'Cambiar Fotografía'
                : 'Subir Fotografía'}
            </Text>
          </View>

          <RequiredField field={'Placa'} />
          <TextInput
            label="Placa"
            onChange={e => onChange(e, 'plate')}
            value={formData.plate}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          <RequiredField field={'Marca/Modelo'} required={false} />

          <TextInput
            label="Marca/Modelo"
            onChange={e => onChange(e, 'model_brand')}
            value={formData.model_brand}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          <RequiredField field={'Color'} required={false} />
          <TextInput
            label="Color"
            onChange={e => onChange(e, 'color')}
            value={formData.color}
            style={styles.input}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
        </View>
        <Loading isVisible={loading} text="Guardando Vehículo" />
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

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  field: {
    color: '#000000',
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

export default NewPet;
