import React from 'react';
import {Platform, StyleSheet, View} from 'react-native';
import {Overlay} from 'react-native-elements';
import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import {configFonts} from '../../../styles/global';

export default function Loading({isVisible, text}) {
  return (
    <Overlay
      isVisible={isVisible}
      windowBackgroundColor={colors.accent}
      overlayBackgroundColor="transparent"
      overlayStyle={styles.overlay}>
      <View style={styles.view}>
        <ActivityIndicator size="large" color={colors.accent} />
        {text && <Text style={styles.text}>{text}</Text>}
      </View>
    </Overlay>
  );
}

const styles = StyleSheet.create({
  overlay: {
    borderRadius: 20,
    height: '20%',
    width: '60%',
  },
  text: {
    color: colors.secondary,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(14),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginVertical: '5%',
    textAlign: 'center',
  },
  view: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
