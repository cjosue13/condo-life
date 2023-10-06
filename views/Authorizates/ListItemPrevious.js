import React from 'react';
import {StyleSheet, View, TouchableOpacity} from 'react-native';
import {Avatar, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {configFonts, theme} from '../../styles/global';

const ListItemPrevious = ({item, navigation, saveGetApi}) => {
  return (
    <View style={styles.listItem}>
      {/* <SvgUri
            width="100"
            height="110%"
            source={require('../../assets/images/Dog.svg')}
          />  */}

      <View style={styles.logoContainer}>
        {/* <SvgUri
            width="100"
            height="110%"
            source={require('../../assets/images/Car.svg')}
          />  */}
        <Avatar.Image
          source={require('../../assets/images/Profile.png')}
          size={RFValue(80)}
        />
      </View>
      {/* <Image 
        source={require('../../assets/images/husk.jpg')}
        style={styles.itemIcon}
    />  */}
      {/* <Avatar.Icon
         icon="dog"
         size={80}
         style={styles.avatarStyle}
      />   */}

      <View style={{alignItems: 'flex-start', flex: 1}}>
        <Text
          style={{
            fontFamily: configFonts.default.medium.fontFamily,
            fontWeight: Platform.select({ios: 'bold', android: undefined}),
            margin: 1,
          }}>
          {item.name}
        </Text>

        <Text style={styles.item}> Estado : Afuera</Text>
        <Text style={styles.item}> Cédula : 207350371</Text>
      </View>
      <TouchableOpacity
        onPress={() =>
          navigation.navigate('newAuthorizate', {tenant: item, saveGetApi})
        }
        style={styles.iosArrow}>
        <Icon name="edit" size={30} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iosArrow: {
    justifyContent: 'center',
  },
  item: {
    margin: 2,
  },

  listItem: {
    alignSelf: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
    width: '100%',
  },
  logoContainer: {
    justifyContent: 'center',
    marginRight: 15,
  },
});

export default ListItemPrevious;
