// import React in our code
import React, {useState} from 'react';

// import all the components we are going to use
import {
  SafeAreaView,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Permission,
  Alert,
} from 'react-native';
import {Avatar} from 'react-native-paper';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {launchImageLibrary} from 'react-native-image-picker';
import {map, filter, size} from 'lodash';

const UploadImage = props => {
  const {imagesSelected, setImagesSelected} = props;

  //function to open gallery oh phone
  const handleChoosePhoto = async () => {
    const options = {
      noData: true,
    };

    launchImageLibrary(options, response => {
      if (response.assets[0].uri) {
        setImagesSelected([...imagesSelected, response.assets[0].uri]);
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
              filter(imagesSelected, imageUrl => imageUrl !== image),
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
        {size(imagesSelected) < 5 && (
          <MaterialCommunityIcon
            name="camera"
            color="#7a7a7a"
            style={styles.containerIcon}
            size={30}
            onPress={() => handleChoosePhoto()}
          />
        )}
      </View>

      {map(imagesSelected, (image, index) => (
        <TouchableOpacity key={index} onPress={() => removeImage(image)}>
          <Image
            key={index}
            style={styles.miniatureStyle}
            source={{uri: image}}
            //onProgress={() => removeImage(image)}
            //onPress={() => removeImage(image)}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default UploadImage;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
  },
  containerIcon: {
    padding: 20,
    //  margin:5 ,
    alignItems: 'center',
    marginBottom: 7,
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: '#e3e3e3',
  },
  miniatureStyle: {
    height: 70,
    marginBottom: 15,
    marginRight: 10,
    width: 70,
  },
  viewImages: {
    flexDirection: 'row',
    //marginLeft: 10,
    // marginRight: 10,
    marginTop: 30,
  },
});
