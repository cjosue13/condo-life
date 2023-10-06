/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import {map, filter} from 'lodash';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import {Text} from 'react-native-paper';
import {configFonts, theme} from '../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';

const UploadFiles = ({filesSelected, setFilesSelected}) => {
  //function to open gallery oh phone
  const handleChooseFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pickMultiple({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well find above
      });

      const data = filesSelected.concat(results);

      //Setting the state to show multiple file attributes
      setFilesSelected(data);
    } catch (err) {
      //Handling any exception (If any)
      if (!DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
  };

  //remove image from state
  const removeFile = image => {
    Alert.alert(
      'Eliminar archivo',
      '¿Estás seguro de que quieres eliminar el archivo?',
      [
        {
          text: 'Si, Eliminar',
          onPress: () => {
            setFilesSelected(
              filter(filesSelected, imageUrl => imageUrl.uri !== image.uri),
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
        <TouchableOpacity onPress={() => handleChooseFile()}>
          <MaterialCommunityIcons
            name="folder-upload"
            color={colors.white}
            style={styles.containerIcon}
            size={30}
          />
        </TouchableOpacity>

        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.field}>
          Seleccionar archivo
        </Text>
      </View>
      <ScrollView horizontal={true}>
        {map(filesSelected, (file, index) => (
          <TouchableOpacity key={index} onPress={() => removeFile(file)}>
            {file.type.includes('image') ? (
              <Image
                key={index}
                style={styles.miniatureStyle}
                source={{uri: file.uri}}
              />
            ) : (
              <View style={styles.containerFile}>
                <MaterialCommunityIcons
                  name="file"
                  color={theme.colors.primary}
                  size={RFValue(60)}
                  onPress={() => handleChooseFile()}
                />
                <Text
                  underlineColor={theme.colors.primary}
                  theme={theme}
                  style={styles.text}>
                  {file.name.length > 15
                    ? '...' +
                      file.name.substr(file.name.length - 15, file.name.length)
                    : file.name}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default UploadFiles;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 15,
    marginTop: 15,
  },
  containerFile: {
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderColor: '#e3e3e3',
    borderRadius: 5,
    borderWidth: 1,
    height: 100,
    justifyContent: 'center',
    marginBottom: 15,
    marginRight: 10,
    width: 150,
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

UploadFiles.propTypes = {
  filesSelected: PropTypes.array.isRequired,
  setFilesSelected: PropTypes.func.isRequired,
};
