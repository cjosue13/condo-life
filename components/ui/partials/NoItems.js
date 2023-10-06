import React from 'react';
import {View, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';
import globalStyles, {theme} from '../../../styles/global';
import {Text} from 'react-native-paper';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import {RFValue} from 'react-native-responsive-fontsize';

const NoItems = ({
  label = 'No existen elementos agregados.',
  white = false,
}) => {
  return (
    <View style={styles.container}>
      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={white ? globalStyles.emptyItemsWhite : globalStyles.emptyItems}>
        {label}
      </Text>
    </View>
  );
};

NoItems.propTypes = {
  label: PropTypes.string,
  white: PropTypes.bool,
};

const styles = StyleSheet.create({
  container: {
    ...globalStyles.container,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconStyles: {
    fontSize: RFValue(100),
  },
});

export default NoItems;
