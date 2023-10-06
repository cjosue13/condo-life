import React from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Platform,
  Image,
} from 'react-native';

import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MIX_AWS_URL} from '../../Config/environment';
import globalStyles, {configFonts} from '../../styles/global';
import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';

const item = ({item}) => {
  const cellphones = JSON.parse(item.cellphones);
  const telephones = JSON.parse(item.telephones);
  const emails = JSON.parse(item.emails);

  return (
    <View style={styles.listItem}>
      <View>
        <Image
          resizeMode="cover"
          PlaceholderContent={<ActivityIndicator color="fff" />}
          source={
            item.image_url
              ? {uri: MIX_AWS_URL + item.image_url}
              : require('../../assets/images/Profile.png')
          }
          style={item.image_url ? styles.image : styles.defaultImage}
        />
      </View>

      <View style={styles.padding}>
        <Text style={styles.namesText}>
          {item.name} {item.lastname}
        </Text>

        <View style={globalStyles.containerItem}>
          <MaterialCommunityIcons
            style={styles.iconStyles}
            color={colors.white}
            name="account-tie"
          />
          <Text style={globalStyles.itemText}>{item.job}</Text>
        </View>

        {emails.length > 0 && (
          <>
            {emails.map((mail, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  style={globalStyles.containerItem}
                  onPress={() => Linking.openURL(`mailto:${mail}`)}>
                  <MaterialCommunityIcons
                    style={styles.iconStyles}
                    color={colors.white}
                    name="email"
                  />
                  <Text style={globalStyles.itemText}>{mail}</Text>
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {cellphones.length > 0 && (
          <TouchableOpacity
            style={globalStyles.containerItem}
            onPress={() => Linking.openURL(`tel:${item.cellphones}`)}>
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
            onPress={() => Linking.openURL(`tel:${telephones}`)}>
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
    margin: '2.5%',
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
