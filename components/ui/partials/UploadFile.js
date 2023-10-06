/* eslint-disable react-native/no-color-literals */
import React from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image,
  Platform,
} from 'react-native';
import {map, filter} from 'lodash';
import PropTypes from 'prop-types';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import DocumentPicker from 'react-native-document-picker';
import {Text} from 'react-native-paper';
import {useEffect} from 'react';
import {configFonts, theme} from '../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';

const UploadFile = ({filesSelected, setFilesSelected, open, setOpen}) => {
  useEffect(() => {
    if (open) {
      handleChooseFile();
    }
  }, [open]); //function to open gallery oh phone
  const handleChooseFile = async () => {
    //Opening Document Picker for selection of multiple file
    try {
      const results = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        //There can me more options as well find above
      });

      //Setting the state to show multiple file attributes
      setFilesSelected(results);
    } catch (err) {
      //Handling any exception (If any)
      if (!DocumentPicker.isCancel(err)) {
        //If user canceled the document selection
        alert('Unknown Error: ' + JSON.stringify(err));
      }
    }
    setOpen(false);
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
              <IconFontAwesome
                name="file-alt"
                color={theme.colors.primary}
                size={RFValue(60)}
                onPress={() => handleChooseFile()}
              />
              <Text theme={theme} style={styles.text}>
                {file.name.length > 15
                  ? '...' +
                    file.name.substr(file.name.length - 15, file.name.length)
                  : file.name}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  containerFile: {
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: '#e3e3e3',
    borderRadius: 5,
    borderWidth: 3,
    height: RFValue(90),
    width: RFValue(150),
  },
  miniatureStyle: {
    alignItems: 'center',
    borderRadius: 5,
    height: RFValue(90),
    width: RFValue(150),
  },
  text: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(11),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 5,
  },
  viewImages: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    marginBottom: -30,
  },
});

UploadFile.propTypes = {
  filesSelected: PropTypes.array.isRequired,
  setFilesSelected: PropTypes.func.isRequired,
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired,
};

export default UploadFile;
