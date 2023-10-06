import React, {useContext} from 'react';
import {StyleSheet, View, TouchableOpacity, Platform} from 'react-native';
import {Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import authContext from '../../context/autentication/authContext';
import colors from '../../styles/colors';
import {configFonts, theme} from '../../styles/global';
import {haveRestrictions} from '../../utils/auth';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const item = ({item, navigation}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  //return icon for status
  const getIcon = () => {
    if (item.status === 'En proceso') {
      return 'comment-processing';
    } else if (item.status === 'Pendiente') {
      return 'alert-circle';
    } else if (item.status === 'Cancelado') {
      return 'cancel';
    } else if (item.status === 'Cerrado') {
      return 'check-bold';
    }
  };

  //return color for status
  const getColor = () => {
    if (item.status === 'En proceso') {
      return colors.before;
    } else if (item.status === 'Pendiente') {
      return colors.before;
    } else if (item.status === 'Cancelado') {
      return colors.after;
    } else if (item.status === 'Cerrado') {
      return colors.into;
    }
  };

  const view = () => {
    return (
      <View style={styles.listItem}>
        <View>
          <Text style={styles.title}>{item.subject}</Text>
          <Text style={styles.item}>{item.description.substr(0, 60)}</Text>

          <View style={styles.containerItem}>
            <Text style={styles.text}>{item.status}</Text>
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

  if (!haveRestrictions('Leer incidencia', user.restrictions)) {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('detailsIncident', {id: item.id, item})
        }
        style={styles.iosArrow}>
        {view()}
      </TouchableOpacity>
    );
  }

  return <View style={styles.iosArrow}>{view()}</View>;
};

const styles = StyleSheet.create({
  containerItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  iconStyles: {
    fontSize: RFValue(20),
  },
  iosArrow: {
    justifyContent: 'center',
  },
  item: {
    color: colors.white,
    fontSize: RFValue(10),
    margin: 2,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'column',
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
  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 1,
  },
});

export default item;
