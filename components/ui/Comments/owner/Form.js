import React, {useState, Fragment, useContext, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {TextInput, Button, DefaultTheme} from 'react-native-paper';
import globalStyles, {theme} from '../../../../styles/global';
import Loading from '../../partials/Loading';
import IncidentContext from '../../../../context/incidents/IncidentContext';
import {useRef} from 'react';
import Toast from 'react-native-easy-toast';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../../styles/colors';

const Form = ({navigation, hideModal, notCommentShow}) => {
  //context
  const incidentContext = useContext(IncidentContext);
  const {incident, createComment, createdComment, clearErrors} =
    incidentContext;

  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (createdComment) {
      hideModal();
      //navigation.navigate('detailsIncident', {id: incident.id, incident});
    }
    clearErrors();
  }, [createdComment]);

  //handle form submit function
  const handleFormSubmit = () => {
    if (comment.trim() !== '') {
      const formData = new FormData();
      formData.append('comment', comment);
      formData.append('incident_id', incident.id);
      createComment(formData);
      setIsLoading(true);
    } else {
      notCommentShow();
    }
  };

  return (
    <Fragment>
      <View style={styles.container}>
        <TextInput
          label="Comentario"
          multiline
          placeholder="Escribir"
          numberOfLines={4}
          onChange={e => setComment(e.nativeEvent.text)}
          value={comment}
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.input}
        />
        <Loading isVisible={isLoading} text="Enviando comentario" />
      </View>

      <Button
        mode="contained"
        style={styles.sendButton}
        underlineColor={theme.colors.primary}
        theme={theme}
        onPress={() => handleFormSubmit()}>
        Enviar
      </Button>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    marginBottom: 20,
  },
  input: {
    backgroundColor: colors.white,
    display: 'flex',
    fontSize: RFValue(14),
    justifyContent: 'flex-end',
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    display: 'flex',
    justifyContent: 'flex-end',
  },
});

export default Form;
