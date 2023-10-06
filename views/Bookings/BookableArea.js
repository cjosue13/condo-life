import React, {useContext} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Platform,
  Image,
} from 'react-native';
import {ActivityIndicator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {configFonts} from '../../styles/global';
import {MIX_AWS_URL} from '../../Config/environment';

const BookableArea = ({item, navigation}) => {
  const view = () => {
    return (
      <View>
        {item?.images?.length > 0 ? (
          <View style={styles.bookableAreaImage}>
            <Image
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator color="fff" />}
              source={{uri: MIX_AWS_URL + item.images[0].image_url}}
              style={styles.image}
            />
          </View>
        ) : (
          <View style={styles.bookableAreaDefaultImage}>
            <Image
              resizeMode="cover"
              PlaceholderContent={<ActivityIndicator color="fff" />}
              source={require('../../assets/images/Bookable.png')}
              style={styles.defaultImage}
            />
          </View>
        )}
        <View style={styles.rowDirection}>
          <Text style={styles.title}>{item.name}</Text>
        </View>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate('detailArea', {
          item,
        })
      }
      style={styles.listItem}>
      {view()}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookableAreaDefaultImage: {
    backgroundColor: colors.primary,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    paddingTop: '2.5%',
  },
  bookableAreaImage: {
    justifyContent: 'center',
  },
  defaultImage: {
    height: RFValue(80),
    resizeMode: 'contain',
    width: '100%',
  },
  image: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    height: RFValue(80),
    width: '100%',
  },
  item: {
    color: colors.white,
    fontSize: RFValue(12),
    margin: 2,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    margin: '2.5%',
    width: '100%',
  },
  rowDirection: {
    padding: '2.5%',
  },

  title: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(13),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),

    padding: '2.5%',
  },
  viewButtons: {
    justifyContent: 'center',
  },
});

export default BookableArea;
