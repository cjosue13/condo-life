/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {configFonts, theme} from '../../styles/global';

const item = ({item, navigation, results = false}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!results) {
          navigation.navigate('detailsVotes', {item, voters: item.voters});
        } else {
          navigation.navigate('detailsResults', {item, voters: item.voters});
        }
      }}
      style={styles.iosArrow}>
      <View style={styles.listItem}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.text}>
            {item?.description}
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
  text: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 1,
  },
});

export default item;
