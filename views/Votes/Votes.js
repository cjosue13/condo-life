/* eslint-disable react-native/no-inline-styles */
import React, {useContext, useEffect} from 'react';
import {
  FlatList,
  View,
  LogBox,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {FAB, ActivityIndicator, Text, Divider} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Item from './ListItems';
import NoItems from '../../components/ui/partials/NoItems';
import {MIX_CLIENT_APP_NAME} from '../../Config/environment';
import authContext from '../../context/autentication/authContext';
import {useIsFocused} from '@react-navigation/native';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import {options} from '../../Config/Socket';
import VotingsContext from '../../context/votings/votingsContext';
import Toast from 'react-native-easy-toast';
import {useRef} from 'react';
import PropTypes from 'prop-types';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {havePermissions} from '../../utils/auth';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';

let echo = null;

/* Pusher.log = msg => {
  // (msg);
};*/

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const socket = (user, loadVotings) => {
  let PusherClient = new Pusher(options.key, options);

  echo = new Echo({
    broadcaster: 'pusher',
    client: PusherClient,
    encrypted: true,
  });

  echo
    .channel(`${MIX_CLIENT_APP_NAME}.vote.${user.id}`)
    .listen('VoteEvent', () => {
      // Do something
      loadVotings();
    });

  echo
    .channel(`${MIX_CLIENT_APP_NAME}.updatevote.${user.selected_account}`)
    .listen('UpdateVote', () => {
      // Do something
      loadVotings();
    });
};

const Votes = ({navigation}) => {
  const auth = useContext(authContext);
  const {user} = auth;
  // state de la app
  const voteContext = useContext(VotingsContext);

  const {loadVotings, votings, error, message, loading, clear} = voteContext;

  //focus screen
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadVotings();
      socket(user, loadVotings);
    } else {
      if (echo) {
        clear();
        echo.disconnect();
      }
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
      {votings.length > 0 ? (
        <FlatList
          data={votings}
          keyExtractor={vote => vote?.vote_id?.toString()}
          style={{flex: 1, minHeight: '65%'}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems label={'No hay votaciones disponibles en el sistema'} />
      )}

      {!havePermissions(['voter'], user.roles) && (
        <FAB
          icon="plus"
          label="Crear votante"
          style={globalStyles.fab}
          onPress={() => {
            navigation.navigate('newVoter', {});
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  results: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  title: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(20),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 10,
  },
});

Votes.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Votes;
