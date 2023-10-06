/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import LettersContext from '../../context/letters/lettersContext';
import PropTypes from 'prop-types';
import {Text} from 'react-native-paper';
import {configFonts} from '../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';

const LetterItem = ({item, navigation}) => {
  const letterContext = useContext(LettersContext);
  const {clear} = letterContext;
  return (
    <TouchableOpacity
      onPress={() => {
        clear();
        navigation.navigate('detailsLetter', {
          item: item,
        });
      }}>
      <View style={styles.listItem}>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text
            style={
              item.ready !== 1
                ? {
                    fontFamily: configFonts.default.medium.fontFamily,
                    fontWeight: Platform.select({
                      ios: 'bold',
                      android: undefined,
                    }),
                    margin: 1,
                    fontSize: RFValue(12),
                    color: colors.white,
                  }
                : {margin: 1, fontSize: RFValue(12), color: colors.white}
            }>
            {item.subject}
          </Text>
        </View>
        <View style={{alignItems: 'flex-start', flex: 1}}>
          <Text style={{margin: 1, color: colors.white, fontSize: RFValue(12)}}>
            {item.created_at}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

LetterItem.propTypes = {
  navigation: PropTypes.object.isRequired,
  item: PropTypes.object.isRequired,
};

export default LetterItem;
