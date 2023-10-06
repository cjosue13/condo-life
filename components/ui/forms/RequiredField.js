/* eslint-disable react-native/no-raw-text */
import React from 'react';
import {HelperText, Text} from 'react-native-paper';
import {Platform, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import {configFonts, theme} from '../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';

const RequiredField = ({field, required = true}) => {
  return (
    <Text style={styles.field} theme={theme}>
      {field}{' '}
      {required && (
        <HelperText style={styles.subInfo} type="error" visible>
          *
        </HelperText>
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  field: {
    color: 'black',
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 5,
    marginTop: 10,
  },
  subInfo: {
    fontSize: RFValue(16),
  },
});

RequiredField.propTypes = {
  field: PropTypes.string.isRequired,
  required: PropTypes.bool,
};

export default RequiredField;
