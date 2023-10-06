/* eslint-disable react-native/no-color-literals */
import {Dimensions, StyleSheet, View} from 'react-native';
import React, {Fragment} from 'react';
import {PieChart} from 'react-native-chart-kit';
import {Text} from 'react-native-paper';
import PropTypes from 'prop-types';
import {ScrollView} from 'react-native-gesture-handler';
import {theme} from '../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';

const chartConfig = {
  backgroundGradientFrom: '#1E2923',
  backgroundGradientFromOpacity: 0,
  backgroundGradientTo: '#08130D',
  backgroundGradientToOpacity: 0.5,
  color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
  strokeWidth: 2, // optional, default 3
  barPercentage: 0.5,
  decimalPlaces: 2,
  useShadowColorFromDataset: false, // optional
};

const widthScreen = Dimensions.get('window').width;

const ChartItem = ({item, index}) => {
  return (
    <Fragment>
      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.textLeft}>{`${index + 1}. ${item.title}`}</Text>

      <View style={styles.container}>
        <ScrollView horizontal={true}>
          <PieChart
            data={item.options}
            width={widthScreen}
            height={220}
            chartConfig={chartConfig}
            accessor={'percentage'}
            backgroundColor={'transparent'}
          />
        </ScrollView>
      </View>
      <Text
        underlineColor={theme.colors.primary}
        theme={theme}
        style={styles.textRight}>
        Cantidad de votos: {item.count}
      </Text>
    </Fragment>
  );
};

export default ChartItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    margin: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  textLeft: {
    fontSize: RFValue(20),
    margin: 5,
    marginTop: 30,
    textAlign: 'left',
  },
  textRight: {
    fontSize: RFValue(14),
    margin: 10,
    textAlign: 'right',
  },
});

ChartItem.propTypes = {
  item: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
};
