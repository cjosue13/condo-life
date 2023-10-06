// import React in our code
import React from 'react';
// import all the components we are going to use
import {View, StyleSheet, Dimensions} from 'react-native';
import {Image} from 'react-native-elements';
import {ActivityIndicator} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {imagesMap} from '../../../../assets/images/imagesMap';

import {MIX_AWS_URL} from '../../../../Config/environment';

const widthScreen = Dimensions.get('window').width;

const ImageView = ({imageUrl, noImage}) => {
  return (
    <View style={styles.viewPhoto}>
      <Image
        PlaceholderContent={<ActivityIndicator color="fff" />}
        source={
          imageUrl === 'undefined' || !imageUrl
            ? imagesMap[noImage]
            : {uri: MIX_AWS_URL + imageUrl}
        }
        style={styles.photo}
      />
    </View>
  );
};

export default ImageView;

const styles = StyleSheet.create({
  photo: {
    height: RFValue(200),

    resizeMode: 'contain',
    width: widthScreen - 20,
  },
  viewPhoto: {
    alignItems: 'center',
    height: RFValue(200),
    margin: RFValue(10),
  },
});
