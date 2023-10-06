import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';
import {Avatar} from 'react-native-elements';
import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MIX_AWS_URL} from '../../Config/environment';
import colors from '../../styles/colors';
import globalStyles, {configFonts, theme} from '../../styles/global';

const item = ({item, navigation}) => {
  const cellphones = JSON.parse(item.cellphones);
  const telephones = JSON.parse(item.telephones);
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate(
          'detailsTenants',
          {item},
          {
            title: 'Editar',
          },
        )
      }>
      <View style={styles.listItem}>
        <View>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              item.avatar
                ? {uri: MIX_AWS_URL + item.image_url}
                : require('../../assets/images/Profile.png')
            }
            style={item.avatar ? styles.image : styles.defaultImage}
          />
        </View>

        <View style={styles.padding}>
          <Text style={styles.namesText}>
            {item.name} {item.lastname}
          </Text>

          <TouchableOpacity
            style={globalStyles.containerItem}
            onPress={() => Linking.openURL(`mailto:${item.email}`)}>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={colors.white}
              name="email"
            />
            <Text style={globalStyles.itemText}>{item.email}</Text>
          </TouchableOpacity>

          {cellphones.length > 0 && (
            <TouchableOpacity
              style={globalStyles.containerItem}
              onPress={() => Linking.openURL(`tel:${cellphones}`)}>
              <MaterialCommunityIcons
                style={styles.iconStyles}
                color={colors.white}
                name="cellphone"
              />
              <Text style={globalStyles.itemText}>{cellphones}</Text>
            </TouchableOpacity>
          )}

          {telephones.length > 0 && (
            <TouchableOpacity
              style={globalStyles.containerItem}
              onPress={() => Linking.openURL(`tel:${item.telephones}`)}>
              <MaterialCommunityIcons
                style={styles.iconStyles}
                color={colors.white}
                name="phone"
              />
              <Text style={globalStyles.itemText}>{telephones}</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  defaultImage: {
    height: RFValue(80),
    marginTop: '2.5%',
    resizeMode: 'contain',
    width: '100%',
  },
  iconStyles: {
    color: colors.white,
    fontSize: RFValue(20),
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    width: '100%',
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    margin: 5,
    padding: 10,
    width: '100%',
  },
  namesText: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },

  padding: {
    padding: '2.5%',
  },
});

export default item;
