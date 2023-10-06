import {Dimensions, Platform, StyleSheet, View} from 'react-native';
import React, {useContext, useEffect, useRef, useState} from 'react';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {ActivityIndicator, Text} from 'react-native-paper';
import {LineChart} from 'react-native-chart-kit';
import {colors} from '../../utils/Colors';
import {ScrollView} from 'react-native-gesture-handler';
import {useIsFocused} from '@react-navigation/native';
import entranceContext from '../../context/entrance/entranceContext';
import Toast from 'react-native-easy-toast';
import moment from 'moment';
import NoItems from '../../components/ui/partials/NoItems';
import {RFValue} from 'react-native-responsive-fontsize';

const {width, height} = Dimensions.get('window');

const Summary = ({navigation}) => {
  const isFocused = useIsFocused();

  const entranceCont = useContext(entranceContext);
  const [month, setMonth] = useState(null);
  const [week, setWeek] = useState(null);

  const {
    loadMonthEntrances,
    entrancesMonth,
    entrancesWeek,
    loadWeekEntrances,
    loading,
    clear,
  } = entranceCont;

  useEffect(() => {
    if (isFocused) {
      loadMonthEntrances();
      loadWeekEntrances();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (entrancesMonth.length > 0) {
      const texts = [];
      const values = [];
      entrancesMonth.forEach(element => {
        texts.push(moment(element.date, 'YYYY-MM').format('MMMM'));
        values.push(element.quantity);
      });

      setMonth({
        labels: texts,
        datasets: [
          {
            data: values,
            color: (opacity = 1) => '#ECEFF1', // optional

            strokeWidth: 2, // optional
          },
        ],
        legend: ['Visitas por mes'], // optional
      });
    }
  }, [entrancesMonth]);

  useEffect(() => {
    if (entrancesWeek.length > 0) {
      const texts = [];
      const values = [];
      entrancesWeek.forEach(element => {
        texts.push(moment(element.date, 'YYYY-MM-DD').format('dddd'));
        values.push(element.quantity);
      });

      setWeek({
        labels: texts,
        datasets: [
          {
            data: values,
            color: (opacity = 1) => '#ECEFF1', // optional

            strokeWidth: 2, // optional
          },
        ],
        legend: ['Visitas por semana'], // optional
      });
    }
  }, [entrancesWeek]);

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      {week || month ? (
        <ScrollView style={{width: width}}>
          {week && (
            <>
              <Text style={styles.header}>Ingresos de la última semana</Text>
              <View style={styles.container}>
                <LineChart
                  data={week}
                  width={width - 20}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.primary,
                    backgroundGradientFrom: theme.colors.primary,
                    backgroundGradientTo: theme.colors.primary,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 255) => '#ECEFF1',
                  }}
                  style={{margin: 10, borderRadius: 20}}
                  bezier
                />
              </View>
            </>
          )}
          {month && (
            <>
              <Text style={styles.header}>Ingresos de los últimos 3 meses</Text>
              <View style={styles.container}>
                <LineChart
                  data={month}
                  width={width - 20}
                  height={220}
                  chartConfig={{
                    backgroundColor: theme.colors.primary,
                    backgroundGradientFrom: theme.colors.primary,
                    backgroundGradientTo: theme.colors.primary,
                    decimalPlaces: 2, // optional, defaults to 2dp
                    color: (opacity = 255) => '#ECEFF1',
                  }}
                  style={{margin: 10, borderRadius: 20}}
                  bezier
                />
              </View>
            </>
          )}
          <View style={styles.space}></View>
        </ScrollView>
      ) : (
        <NoItems label="No se han registrado ingresos." />
      )}
    </View>
  );
};

export default Summary;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginBottom: 10,
    marginTop: 30,
    textAlign: 'center',
  },
  space: {
    margin: 20,
  },
});
