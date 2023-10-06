import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  ImageBackground,
  Platform,
} from 'react-native';
import {Image} from 'react-native-elements';
import {ActivityIndicator, Button, Text} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {MIX_AWS_URL} from '../../Config/environment';
import SimplePaginationDot from '../../components/ui/partials/SimplePaginationDot';
import Carousel, {Pagination} from 'react-native-snap-carousel';

import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';

import CardView from 'react-native-cardview';

const {width, height} = Dimensions.get('window');

const DetailArea = ({navigation, route}) => {
  const {item: bookableArea} = route.params;

  const carouselRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({item, index}) => {
    return (
      <ScrollView>
        {!item.image_url ? (
          <View style={styles.bookableAreaDefaultImage}>
            <Image
              source={require('../../assets/images/Bookable.png')}
              style={styles.defaultImage}
              PlaceholderContent={<ActivityIndicator color="fff" />}
            />
          </View>
        ) : (
          <View style={styles.item}>
            <ImageBackground
              source={{uri: MIX_AWS_URL + item?.image_url}}
              style={styles.carousel}
            />
          </View>
        )}
      </ScrollView>
    );
  };

  return (
    <>
      {bookableArea?.images?.length > 0 ? (
        <>
          <View style={styles.centerItems}>
            <Carousel
              style={styles.carousel}
              data={bookableArea.images}
              renderItem={renderItem}
              ref={carouselRef}
              sliderWidth={width}
              itemWidth={width - 80}
              enableMomentum={true}
              decelerationRate={0.9}
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              onSnapToItem={index => setCurrentIndex(index)}
              keyExtractor={(item, index) => item.image_url + ' ' + index}
            />
          </View>
        </>
      ) : (
        <>
          <View style={styles.centerItems}>
            <Carousel
              style={styles.carousel}
              data={[{image_url: null}]}
              renderItem={renderItem}
              ref={carouselRef}
              sliderWidth={width}
              itemWidth={width}
              enableMomentum={true}
              decelerationRate={0.9}
              initialNumToRender={10}
              windowSize={5}
              maxToRenderPerBatch={5}
              updateCellsBatchingPeriod={30}
              removeClippedSubviews={false}
              onEndReachedThreshold={0.1}
              onSnapToItem={index => setCurrentIndex(index)}
              keyExtractor={item => item.image_url}
            />
          </View>
        </>
      )}
      <View style={globalStyles.container}>
        <CardView
          style={styles.listItem}
          cardElevation={7}
          cardMaxElevation={2}>
          <Text style={styles.titleText}>{bookableArea.name}</Text>
          <ScrollView>
            <Text style={styles.text}>{bookableArea.description}</Text>
          </ScrollView>
        </CardView>
      </View>
      <Button
        style={styles.boton}
        mode="contained"
        underlineColor={theme.colors.primary}
        theme={theme}
        onPress={() => {
          navigation.navigate('calendarBookingOwner', {
            bookableArea,
          });
          setCurrentIndex(0);
        }}>
        Siguiente
      </Button>
    </>
  );
};

const styles = StyleSheet.create({
  bookableAreaDefaultImage: {
    height: height / 4,
    margin: '2.5%',
  },
  boton: {
    backgroundColor: theme.colors.primary,
    margin: '2.5%',
  },
  carousel: {
    aspectRatio: 1.5,
    backgroundColor: colors.primary,
    flexGrow: 0,
  },
  centerItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  defaultImage: {
    height: '90%',
    marginTop: '2.5%',
    resizeMode: 'contain',
    width: '100%',
  },

  item: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    height: height / 4,
    marginTop: '2.5%',
  },
  listItem: {
    backgroundColor: colors.white,
    maxHeight: '60%',
    minHeight: '60%',
    padding: '5.0%',
  },
  text: {
    color: colors.black,
    fontSize: RFValue(14),
  },
  titleText: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
});

export default DetailArea;
