// import React in our code
import React from 'react';
import {View, StyleSheet, Image, TouchableOpacity, Alert} from 'react-native';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {map, filter, size} from 'lodash';
import RNFetchBlob from 'rn-fetch-blob';
import colors from '../../../styles/colors';
import {RFValue} from 'react-native-responsive-fontsize';

const UploadPhoto = props => {
  const {imagesSelected, setImagesSelected} = props;

  //function to open gallery oh phone
  const handleChoosePhoto = async () => {
    const options = {includeBase64: true};

    await launchImageLibrary(options, response => {
      if (!response.didCancel) {
        setImagesSelected([
          {
            name: response.assets[0].fileName,
            type: response.assets[0].type,
            filename: response.assets[0].fileName,
            data: RNFetchBlob.wrap(response.assets[0].uri),
            uri: response.assets[0].uri,
          },
        ]);
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
        {size(imagesSelected) < 1 && (
          <TouchableOpacity onPress={() => handleChoosePhoto()}>
            <MaterialCommunityIcon
              name="image-area"
              color={colors.white}
              style={styles.containerIcon}
              size={30}
            />
          </TouchableOpacity>
        )}
      </View>

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
    </View>
  );
};

export default UploadPhoto;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
  },
  containerIcon: {
    padding: 30,
    //  margin:5 ,
    alignItems: 'center',
    marginBottom: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
    height: 90,
    width: 90,
    backgroundColor: colors.primary,
    borderRadius: 20,
  },
  miniatureStyle: {
    borderRadius: 20,
    height: 90,
    marginBottom: 15,
    marginRight: 10,
    width: 150,
  },
  viewImages: {
    flexDirection: 'row',
    //marginLeft: 10,
    // marginRight: 10,
    marginTop: 30,
  },
});
