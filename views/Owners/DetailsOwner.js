import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {Text, Subheading} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import globalStyles, {configFonts, theme} from '../../styles/global';

const DetailsOwner = ({route}) => {
  const {
    name,
    email,
    lastname,
    document_id,
    document_type,
    cellphones,
    telephones,
  } = route.params.item;
  const fullName = name + ' ' + lastname;

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
          {`Nombre : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {name}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          {`Apellidos : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {lastname}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          {`Tipo de identificación : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {document_type}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          {`Identificación : `}
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
          {`Correo : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {email}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          {`Teléfono : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {JSON.parse(telephones)}
          </Subheading>
        </Text>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.text}>
          {`Celular : `}
          <Subheading
            style={styles.subInfo}
            underlineColor={theme.colors.primary}
            theme={theme}>
            {JSON.parse(cellphones)}
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
    marginVertical: '2.5%',
  },
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(24),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    justifyContent: 'center',
    marginVertical: '2.5%',
    textAlign: 'center',
  },
});

export default DetailsOwner;
