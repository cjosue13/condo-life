/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, useRef} from 'react';
import {
  View,
  StyleSheet,
  LogBox,
  FlatList,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  ActivityIndicator,
  Button,
  Divider,
  Modal,
  Portal,
  Text,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Pusher from 'pusher-js/react-native';
import Echo from 'laravel-echo';
import {options} from '../../Config/Socket';
import {MIX_CLIENT_APP_NAME} from '../../Config/environment';
import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';
import {useContext} from 'react';
import VotingsContext from '../../context/votings/votingsContext';
import Question from './Question';
import NoItems from '../../components/ui/partials/NoItems';
import Toast from 'react-native-easy-toast';
import Sound from 'react-native-sound';
import dings from '../../assets/sounds/message.mp3';
import {useState} from 'react';
import ChartItem from './ChartItem';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {RFValue} from 'react-native-responsive-fontsize';
import {messageView} from '../../utils/message';

let echo = null;

/* Pusher.log = msg => {
 // console.log(msg);
}; */

const audio = new Sound(dings, null, error => {
  if (error) {
    return;
  }
});

LogBox.ignoreLogs(['Setting a timer for a long period of time']);

const socket = (vote, loadQuestions, voters, loadCharts) => {
  let PusherClient = new Pusher(options.key, options);

  echo = new Echo({
    broadcaster: 'pusher',
    client: PusherClient,
    encrypted: true,
  });

  echo
    .channel(`${MIX_CLIENT_APP_NAME}.questions.${vote.vote_id}`)
    .listen('UpdateQuestion', () => {
      loadQuestions(vote.vote_id, vote.user_id);
      loadCharts(vote.vote_id, voters);
    });

  echo
    .channel(`${MIX_CLIENT_APP_NAME}.voteruser.${vote.vote_id}`)
    .listen('VoterUser', () => {
      loadQuestions(vote.vote_id, vote.user_id);
      loadCharts(vote.vote_id, voters);
    });
};

const DetailsVotes = ({route}) => {
  const {item: vote, voters} = route.params;

  const isFocused = useIsFocused();
  const votingContext = useContext(VotingsContext);

  const {
    loadQuestions,
    message,
    error,
    questions,
    clear,
    loading,
    answer_created,
    createAnswer,
    clearErrors,
    loadCharts,
    charts,
  } = votingContext;

  const [answers, setAnswers] = useState({answers: []});
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  useEffect(() => {
    if (isFocused) {
      loadQuestions(vote.vote_id, vote.user_id);
      loadCharts(vote.vote_id, voters);
      socket(vote, loadQuestions, voters, loadCharts);
    } else if (echo) {
      clear();
      echo.disconnect();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
      clearErrors();
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    audio.setVolume(1);
  }, []);

  useEffect(() => {
    if (saving) {
      handleFormSubmit();
    }
  }, [saving]);

  useEffect(() => {
    if (answer_created) {
      playPause();
      clear();
      setAnswers({answers: []});
    }
  }, [answer_created]);

  const playPause = () => {
    if (!audio.isPlaying()) {
      audio.play(() => {});
    }
  };

  const handleFormSubmit = async () => {
    try {
      if (answers.answers.length > 0) {
        await createAnswer({answers: JSON.stringify(answers.answers)});
      } else {
        messageView(
          'Debes seleccionar un elemento para votar.',
          'warning',
          3000,
        );
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setSaving(false);
  };

  const handleToggleScheduleType = (value, id) => {
    const answer = getInfo(value, id);
    setAnswers({
      answers: [
        ...answers.answers.filter(
          item => item.vote_question_id != answer[0].vote_question_id,
        ),
        ...answer,
      ],
    });
  };

  const getInfo = (answer, id) => {
    const data = [];
    //const userId = this.state.voterUser[0].id ;
    const userId = vote.user_id;
    const percentage = getPercentage(userId);
    //const percentage = this.state.voterUser[0].percentage;
    data.push({
      answer: answer,
      vote_question_id: parseInt(id),
      list_user_id: userId,
      answer_percentage: parseFloat(percentage),
    });

    return data;
  };

  const getPercentage = id => {
    const percentage = voters.filter(item => item.id === id);

    return percentage[0].percentage;
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <Fragment>
      <View style={globalStyles.container}>
        {questions?.length > 0 ? (
          <FlatList
            data={questions}
            keyExtractor={vote => vote?.id?.toString()}
            style={{flex: 1}}
            renderItem={({item}) => (
              <Question item={item} toggleChange={handleToggleScheduleType} />
            )}
          />
        ) : (
          <NoItems label={'No hay preguntas para votar'} />
        )}
      </View>

      {visible && (
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={styles.containerStyle}>
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.header}>
              Resultados de preguntas de {vote.description}
            </Text>
            <FlatList
              data={charts.filter(item => item.finished)}
              keyExtractor={vote => vote?.id?.toString()}
              renderItem={({item, index}) => (
                <ChartItem item={item} index={index} finished={true} />
              )}
            />

            <Button
              mode="contained"
              style={styles.closeModal}
              underlineColor={theme.colors.primary}
              theme={theme}
              onPress={hideModal}>
              Cerrar Ventana
            </Button>
          </Modal>
        </Portal>
      )}

      {charts.filter(item => item.finished).length > 0 && (
        <Fragment>
          <TouchableOpacity onPress={() => showModal()}>
            <View style={styles.results}>
              <Text
                underlineColor={theme.colors.primary}
                theme={theme}
                style={styles.title}>
                Ver resultados
              </Text>
            </View>
          </TouchableOpacity>
        </Fragment>
      )}

      {questions?.length > 0 && (
        <View style={styles.viewButton}>
          <Button
            icon="pencil-circle"
            mode="contained"
            disabled={saving}
            style={styles.boton}
            underlineColor={theme.colors.primary}
            theme={theme}
            onPress={() => {
              setSaving(true);
            }}>
            Votar
          </Button>
        </View>
      )}
    </Fragment>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  closeModal: {
    backgroundColor: theme.colors.primary,
  },
  container: {
    backgroundColor: 'white',
    margin: 20,
    paddingBottom: 30,
    paddingTop: 30,
  },
  containerStyle: {
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    margin: 20,
    padding: 20,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(18),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
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
  text: {
    fontSize: RFValue(18),
    marginBottom: 20,
  },
  title: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(20),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 10,
  },
  viewButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
  },
});

DetailsVotes.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default DetailsVotes;
