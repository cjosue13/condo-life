import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Headline, Text, Subheading} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import globalStyles, {configFonts, theme} from '../../styles/global';

const DetailsAuthorizate = ({navigation, route}) => {
  const {
    entrancename,
    lastname,
    document_id,
    ficha,
    vehicle_plate,
    datetime_of_entry,
    datetime_of_departure,
    id,
  } = route.params.item;
  const fullName = entrancename + ' ' + lastname;

  return (
    <View style={globalStyles.container}>
      <View style={globalStyles.view}>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.title}>
          {fullName.substr(0, 60)}
          {fullName.length > 60 && '...'}
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Ficha :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {ficha}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Cédula :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {document_id}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Placa :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {vehicle_plate}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Ingreso :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {datetime_of_entry}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          Salida :{' '}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {datetime_of_departure}
          </Subheading>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  subInfo: {
    color: colors.white,
    fontSize: RFValue(12),
  },
  text: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginBottom: 20,
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(24),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    justifyContent: 'center',
    marginBottom: 30,
    textAlign: 'center',
  },
});

export default DetailsAuthorizate;
