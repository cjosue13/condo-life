import React from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
} from 'react-native';

import {Separator, Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';

const item = ({bookableArea, navigation, saveGetApi}) => {
  const {description, name, id} = bookableArea.item;

  return (
    <TouchableOpacity
      style={styles.divider}
      onPress={() =>
        navigation.navigate('bookableAreasDetailOwner', {bookableArea})
      }>
      <View style={styles.viewBookableArea}>
        <View style={styles.viewBookableAreaImage}>
          <Image
            //resizeMode="cover"
            //PlaceholderContent={<ActivityIndicator color="fff" />}
            //source={require('../../assets/images/poll.jpg')}
            style={styles.bookableAreaImage}
          />
        </View>
        <View>
          <Text style={styles.bookableAreaName}>{name}</Text>
          <Text style={styles.bookableAreaDescription}>
            {description.substr(0, 60)}...
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  bookableAreaDescription: {
    color: 'grey',
    fontSize: RFValue(15),
    paddingTop: 2,
    width: 300,
  },
  bookableAreaImage: {
    height: 80,
    width: 80,
  },

  bookableAreaName: {
    color: 'black',
    fontSize: RFValue(17),
    paddingTop: 2,
    width: 300,
  },
  divider: {
    padding: 1,
  },
  viewBookableArea: {
    borderBottomColor: 'grey',
    borderBottomWidth: 1,
    flexDirection: 'row',
    margin: 8,
  },
  viewBookableAreaImage: {
    marginRight: 15,
  },
});

export default item;
