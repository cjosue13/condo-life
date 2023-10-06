import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';
import {Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

import Icon from 'react-native-vector-icons/MaterialIcons';
import colors from '../../styles/colors';
import {configFonts, theme} from '../../styles/global';

const item = ({item, navigation, saveGetApi}) => {
  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('detailsEntrances', {item, saveGetApi})
      }
      style={styles.iosArrow}>
      <View
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.listItem}>
        <View
          underlineColor={theme.colors.primary}
          theme={theme}
          style={{alignItems: 'flex-start', flex: 1}}>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={{
              fontFamily: configFonts.default.medium.fontFamily,
              fontWeight: Platform.select({ios: 'bold', android: undefined}),
              margin: 1,
              fontSize: RFValue(12),
              color: colors.white,
            }}>
            {item.entrancename} {item.lastname}
          </Text>

          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.item}>
            {' '}
            Ingreso : {item.datetime_of_entry}
          </Text>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.item}>
            {' '}
            Salida : {item.datetime_of_departure}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  iosArrow: {
    justifyContent: 'center',
  },
  item: {
    color: colors.white,
    fontSize: RFValue(10),
    margin: '1.25%',
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    width: '100%',
  },
});

export default item;
