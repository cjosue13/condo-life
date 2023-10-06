import React from 'react';
import {Dimensions, StyleSheet, TouchableOpacity, View} from 'react-native';
import colors from '../../../styles/colors';

const {height} = Dimensions.get('window');

export const Col = ({numRows, children, view, navigation, press = null}) => {
  return (
    <TouchableOpacity
      onPress={!press ? () => navigation.navigate(view) : press}
      style={styles[`${numRows}col`]}>
      {children}
    </TouchableOpacity>
  );
};

export const Row = ({children}) => <View style={styles.row}>{children}</View>;

const styles = StyleSheet.create({
  '1col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 2,
  },
  '2col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 2,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 2,
  },
  '3col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 3,
    justifyContent: 'center',
    marginHorizontal: '1.25%',
    padding: 5,
  },
  '4col': {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 10,
    flex: 4,
    justifyContent: 'center',
    padding: 2,
  },
  row: {
    flexDirection: 'row',
    height: height / 6,
    marginVertical: '1.25%',
  },
});
