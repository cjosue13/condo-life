/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {Badge, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import LettersContext from '../../context/letters/lettersContext';
import colors from '../../styles/colors';
import {configFonts, theme} from '../../styles/global';

const item = ({item, navigation}) => {
  const letterContext = useContext(LettersContext);
  const {clear} = letterContext;
  return (
    <TouchableOpacity
      onPress={() => {
        clear();
        navigation.navigate('lettersShow', {
          categorie: item,
        });
      }}>
      <View style={styles.listItem}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text style={styles.badgeStyle}>{item.name}</Text>
        </View>
        <Text size={RFValue(30)} style={styles.badgeStyle}>
          {item.count}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  badgeStyle: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 1,
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
