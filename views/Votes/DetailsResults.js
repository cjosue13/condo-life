import {FlatList, Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import PropTypes from 'prop-types';
import {ActivityIndicator, Text} from 'react-native-paper';
import NoItems from '../../components/ui/partials/NoItems';
import ChartItem from './ChartItem';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {useContext} from 'react';
import VotingsContext from '../../context/votings/votingsContext';
import Toast from 'react-native-easy-toast';
import {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useRef} from 'react';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';

const DetailsResults = ({navigation, route}) => {
  const {item: vote, voters} = route.params;

  const voteContext = useContext(VotingsContext);
  const {charts, message, error, loading, loadCharts, clear} = voteContext;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadCharts(vote.id, voters);
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={globalStyles.container}>
      {charts.length > 0 ? (
        <>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Resultados de preguntas de {vote.description}
          </Text>
          <FlatList
            data={charts}
            keyExtractor={vote => vote?.id?.toString()}
            renderItem={({item, index}) => (
              <ChartItem item={item} index={index} />
            )}
          />
        </>
      ) : (
        <NoItems label={'No hay resultados disponibles en el sistema'} />
      )}
    </View>
  );
};

export default DetailsResults;

DetailsResults.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

const styles = StyleSheet.create({
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
