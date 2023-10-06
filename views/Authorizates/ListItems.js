import React, {Fragment} from 'react';
import {useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {MIX_AWS_URL} from '../../Config/environment';
import authContext from '../../context/autentication/authContext';
import colors from '../../styles/colors';
import globalStyles, {configFonts} from '../../styles/global';
import {haveRestrictions} from '../../utils/auth';

const item = ({item, navigation}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  const getColor = () => {
    if (item.status === 'Dentro') {
      return colors.into;
    } else {
      return colors.before;
    }
  };

  const getIcon = () => {
    if (item.status === 'Dentro') {
      return 'check-bold';
    } else {
      return 'alert-circle';
    }
  };
  const content = () => {
    return (
      <View style={styles.listItem}>
        <View>
          <Image
            resizeMode="cover"
            PlaceholderContent={<ActivityIndicator color="fff" />}
            source={
              item.avatar !== 'undefined' && item.avatar !== null
                ? {uri: MIX_AWS_URL + item.avatar}
                : require('../../assets/images/Profile.png')
            }
            style={
              item.avatar !== 'undefined' && item.avatar !== null
                ? styles.image
                : styles.defaultImage
            }
          />
        </View>

        <View style={styles.padding}>
          <Text style={styles.text}>{item.fullname}</Text>
          <View style={styles.containerItem}>
            <Text style={styles.text}>{item.state}</Text>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={getColor()}
              name={getIcon()}
            />
          </View>
        </View>
      </View>
    );
  };

  return (
    <Fragment>
      {haveRestrictions('Leer autorizado', user.restrictions) ? (
        <View>{content()}</View>
      ) : (
        <TouchableOpacity
          onPress={() => navigation.navigate('detailsAuthorizate', {item})}>
          {content()}
        </TouchableOpacity>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  defaultImage: {
    height: RFValue(80),
    marginTop: '2.5%',
    resizeMode: 'contain',
    width: '100%',
  },
  iconStyles: {
    fontSize: RFValue(20),
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    width: '100%',
  },

  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    margin: '2.5%',
    width: '100%',
  },

  padding: {
    padding: '2.5%',
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
