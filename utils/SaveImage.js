import {Alert, PermissionsAndroid, Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';

export const saveImage = async image => {
  const {base64, fs} = RNFetchBlob;
  const date = new Date();

  let RootDir =
    Platform.OS === 'ios' ? fs.dirs.DocumentDir : fs.dirs.PictureDir;

  const save = async () => {
    const Base64Code = image.split('data:image/png;base64,');

    await fs
      .writeFile(
        RootDir +
          '/qrCode_' +
          Math.floor(date.getTime() + date.getSeconds() / 2) +
          '.png',
        Base64Code[1],
        'base64',
      )
      .then(() => {
        Alert.alert(
          'Información de almacenamiento',
          'Archivo almacenado exitosamente',
          [{text: 'Cerrar', style: 'cancel'}],
        );
      })
      .catch(error => {
        Alert.alert(
          'Información de almacenamiento',
          'Ha ocurrido un error almacenando el código QR.',
          [{text: 'Cerrar', style: 'cancel'}],
        );
      });
  };

  if (Platform.OS === 'ios') {
    await save();
  } else {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'Permisos de almacenamiento',
        message:
          'La aplicación desea acceder a tu almacenamiento ' +
          'para poder realizar descargas.',
        buttonNeutral: 'Preguntar más tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'De acuerdo',
      },
    );

    const grantedRead = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
      {
        title: 'Permisos de almacenamiento',
        message:
          'La aplicación desea acceder a tu almacenamiento ' +
          'para poder realizar descargas.',
        buttonNeutral: 'Preguntar más tarde',
        buttonNegative: 'Cancelar',
        buttonPositive: 'De acuerdo',
      },
    );

    if (
      granted === PermissionsAndroid.RESULTS.GRANTED &&
      grantedRead === PermissionsAndroid.RESULTS.GRANTED
    ) {
      await save();
    } else {
      Alert.alert('Información de descarga', 'Permiso de descarga denegado.', [
        {text: 'Cerrar', style: 'cancel'},
      ]);
    }
  }
};
