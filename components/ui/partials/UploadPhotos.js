// import React in our code
import React from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {map, filter, size} from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import {ScrollView} from 'react-native-gesture-handler';
import {Text} from 'react-native-paper';
import {configFonts, theme} from '../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';

const UploadPhotos = ({imagesSelected, setImagesSelected}) => {
  //function to open gallery oh phone
  const handleChoosePhoto = async () => {
    const options = {includeBase64: true, selectionLimit: 0};

    await launchImageLibrary(options, response => {
      if (!response.didCancel) {
        const data = imagesSelected.concat(response.assets);
        setImagesSelected(data);
      }
    });
  };

  //remove image from state
  const removeImage = image => {
    Alert.alert(
      'Eliminar Imagen',
      '¿Estás seguro de que quieres eliminar la imagen?',
      [
        {
          text: 'Si, Eliminar',
          onPress: () => {
            setImagesSelected(
              filter(imagesSelected, imageUrl => imageUrl.uri !== image.uri),
            );
          },
        },
        {
          text: 'Cancelar',
          style: 'cancel',
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <View style={styles.viewImages}>
      <View style={styles.container}>
        <TouchableOpacity onPress={() => handleChoosePhoto()}>
          <MaterialCommunityIcon
            name="file-image"
            color={colors.white}
            style={styles.containerIcon}
            size={30}
          />
        </TouchableOpacity>
        <Text theme={theme} style={styles.field}>
          Seleccionar imágenes
        </Text>
      </View>

      <ScrollView horizontal={true}>
        {map(imagesSelected, (image, index) => (
          <TouchableOpacity key={index} onPress={() => removeImage(image)}>
            <Image
              key={index}
              style={styles.miniatureStyle}
              source={{uri: image.uri}}
              //onProgress={() => removeImage(image)}
              //onPress={() => removeImage(image)}
            />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UploadPhotos;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',

    marginBottom: 15,
    marginTop: 15,
  },

  containerIcon: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'row',
    height: 90,
    justifyContent: 'center',
    marginBottom: 7,
    marginRight: 10,
    padding: 30,
    width: 90,
  },
  field: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  miniatureStyle: {
    alignItems: 'center',
    borderRadius: 5,
    height: 100,
    marginBottom: 15,
    marginRight: 10,
    width: 150,
  },
  text: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(13),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 5,
  },
  viewImages: {
    flexDirection: 'column',
  },
});
