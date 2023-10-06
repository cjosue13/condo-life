import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';

import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import {MIX_AWS_URL} from '../../Config/environment';
import colors from '../../styles/colors';
import {configFonts} from '../../styles/global';

const item = ({item, navigation}) => {
  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('detailsVehicles', {item})}
      style={styles.iosArrow}>
      <View style={styles.listItem}>
        <View>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              item.file
                ? {uri: MIX_AWS_URL + item.file}
                : require('../../assets/images/Car.png')
            }
            style={item.file ? styles.image : styles.defaultImage}
          />
        </View>

        <View style={styles.padding}>
          {item.model_brand !== '' && (
            <Text style={styles.title}>{item.model_brand}</Text>
          )}
          <Text style={styles.item}>Placa : {item.plate}</Text>
          {item.model_brand !== '' && (
            <Text style={styles.item}>Color : {item.color}</Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultImage: {
    borderRadius: 20,
    height: RFValue(80),
    marginTop: '2.5%',
    resizeMode: 'contain',
    width: '100%',
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    width: '100%',
  },
  iosArrow: {
    justifyContent: 'center',
  },
  item: {
    color: colors.white,
    fontSize: RFValue(10),
    margin: 2,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    margin: '2.5%',
    width: '100%',
  },
  padding: {
    padding: '2.5%',
  },

  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 1,
  },
});

export default item;
