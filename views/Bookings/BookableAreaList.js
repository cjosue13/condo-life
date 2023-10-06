import React, {useEffect, useState, useContext, useRef} from 'react';
import {
  FlatList,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from 'react-native';
import {ActivityIndicator, Searchbar, Text} from 'react-native-paper';
import {size} from 'lodash';
import globalStyles, {configFonts, theme} from '../../styles/global';
import BookingsContext from '../../context/bookings/bookingsContext';
import {MIX_AWS_URL} from '../../Config/environment';
import {useIsFocused} from '@react-navigation/native';
import NoItems from '../../components/ui/partials/NoItems';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import BookableArea from './BookableArea';

const widthScreen = Dimensions.get('window').width;
const {width, height} = Dimensions.get('window');

const BookableAreaList = ({navigation}) => {
  const isFocused = useIsFocused();
  const carouselRef = useRef(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  //bookings context
  const bookingsContext = useContext(BookingsContext);
  //state of conxtext
  const {
    loading,
    clear,
    loadBookableAreas,
    bookablesArea,
    loadingBookableAreas,
  } = bookingsContext;

  const [items, setItems] = useState([]);

  //use effect
  useEffect(() => {
    if (isFocused) {
      loadBookableAreas();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    setItems(bookablesArea);
  }, [bookablesArea]);

  const renderItem = ({item, index}) => {
    return (
      <ScrollView>
        <TouchableOpacity
          activeOpacity={1}
          style={styles.item}
          onPress={() => {
            navigation.navigate('calendarBookingOwner', {
              bookableArea: item,
            });
            setCurrentIndex(0);
          }}>
          <ImageBackground
            source={
              size(item?.images) > 0
                ? {uri: MIX_AWS_URL + item.images[0].image_url}
                : require('../../assets/images/Bookable.png')
            }
            style={styles.imageBackground}></ImageBackground>
          <View style={styles.lowerContainer}>
            <Text style={styles.titleText}>
              {item.name.length > 20
                ? item.name.substr(0, 20) + '...'
                : item.name}
            </Text>
            <Text style={styles.contentText}>
              {item.description.length > 225
                ? item.description.substr(0, 225) + '...'
                : item.description}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    );
  };

  const onChange = text => {
    if (text.trim() !== '') {
      const filterData =
        bookablesArea.filter(item =>
          item.name.toUpperCase().includes(text.trim().toUpperCase()),
        ).length > 0
          ? bookablesArea.filter(item =>
              item.name.toUpperCase().includes(text.trim().toUpperCase()),
            )
          : [];
      setItems(filterData);
    } else {
      setItems(bookablesArea);
    }
  };

  //loading to component
  if (loadingBookableAreas) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      <Searchbar
        onChange={e => onChange(e.nativeEvent.text)}
        placeholder="Buscar..."
        theme={theme}
      />
      {items?.length > 0 ? (
        <>
          <FlatList
            data={items}
            keyExtractor={item => item?.id?.toString()}
            style={{flex: 1}}
            onEndReachedThreshold={0.5}
            renderItem={({item}) => (
              <BookableArea item={item} navigation={navigation} />
            )}
          />

          {/* <View style={styles.centerItems}>
              <Carousel
                style={styles.carousel}
                data={bookablesArea}
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
                keyExtractor={(item, index) => item.title + ' ' + index}
              />
        </View> */}
        </>
      ) : (
        <NoItems label="No existen áreas reservables disponibles" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  carousel: {
    aspectRatio: 1.5,
    backgroundColor: colors.primary,
    flexGrow: 0,
  },
  centerItems: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignContent: 'center',
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  contentText: {
    color: colors.white,
    fontSize: RFValue(12),
    marginTop: 10,
  },
  imageBackground: {
    backgroundColor: '#EBEBEB',
    borderColor: colors.primary,
    borderRadius: 20,
    borderWidth: 5,
    flex: 2,
  },
  item: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
    borderRadius: 10,
    borderWidth: 2,
    elevation: 3,
    height: height / 1.5,
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  lowerContainer: {
    flex: 1,
    margin: 10,
  },
  titleText: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
});

export default BookableAreaList;
