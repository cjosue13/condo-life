import React from 'react';
import {Image} from 'react-native-elements';
import {StyleSheet, View} from 'react-native';
import PropTypes from 'prop-types';
import Carousel from 'react-native-anchor-carousel';
import {ActivityIndicator, Text} from 'react-native-paper';
import {MIX_AWS_URL} from '../../../Config/environment';
import {size} from 'lodash';

const CarouselComponent = ({images, height, width}) => {
  const renderItem = ({item, index}) => {
    return (
      <Image
        key={index}
        resizeMode="cover"
        PlaceholderContent={<ActivityIndicator color="fff" />}
        style={styles.miniatureStyle}
        source={
          size(item.images) > 0
            ? {uri: MIX_AWS_URL + item.images[0].image_url}
            : require('../../../assets/images/Bookable.png')
        }
      />
    );
  };

  return (
    <View>
      <Carousel
        layout={'default'}
        data={images}
        sliderWidth={width}
        itemWidth={width}
        itemHeight={height}
        renderItem={renderItem}
      />
    </View>
  );
};

export default CarouselComponent;

CarouselComponent.propTypes = {
  images: PropTypes.array.isRequired,
  height: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
};

const styles = StyleSheet.create({});
