import React, {useState, useRef, useEffect, useContext} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Keyboard,
} from 'react-native';
import {ActivityIndicator, Divider, Text, TextInput} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Toast from 'react-native-easy-toast';
import {useIsFocused} from '@react-navigation/native';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import UploadFile from '../../components/ui/partials/UploadFile';
import ResponseItem from './ResponseItem';
import PropTypes from 'prop-types';
import LettersContext from '../../context/letters/lettersContext';
import authContext from '../../context/autentication/authContext';
import Loading from '../../components/ui/partials/Loading';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const defaultValue = {
  to_id: '',
  file_url: 'undefined',
  reply_id: '',
  comment: '',
  file: '',
};
const ResponseLetter = ({item}) => {
  // console.log(item.to[0].id);
  const letterContext = useContext(LettersContext);
  const {
    loading,
    error,
    message,
    created,
    messages,
    createReply,
    showMessages,
    clearOptions,
    clear,
  } = letterContext;
  const auth = useContext(authContext);
  const {user} = auth;
  const [filesSelected, setFilesSelected] = useState([]);
  const [formData, setFormData] = useState(defaultValue);
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);
  const isFocused = useIsFocused();
  const [keyboardStatus, setKeyboardStatus] = useState(0);
  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', event => {
      setKeyboardStatus(
        Platform.OS === 'android'
          ? 0
          : event.endCoordinates.height - RFValue(20),
      );
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardStatus(0);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  useEffect(() => {
    if (isFocused) showMessages(item.id);

    // if (!isFocused) clear();
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  useEffect(() => {
    if (sending) {
      handleFormSubmit();
    }
  }, [sending]);

  useEffect(() => {
    if (created) {
      setFormData(defaultValue);
      setFilesSelected([]);
      clearOptions();
    }
  }, [created]);

  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  const handleFormSubmit = async () => {
    try {
      if (filesSelected.length > 0 || formData.comment.trim() !== '') {
        await createReply({
          ...formData,
          reply_id: item.id.toString(),
          to_id:
            item.from_id === user.id
              ? user.id.toString()
              : item.from_id.toString(),
          file: filesSelected.length > 0 ? filesSelected : null,
        });
      } else {
        messageView(
          'Debes subir un archivo o escribir un mensaje primero.',
          'warning',
          3000,
        );
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setSending(false);
  };

  return (
    <>
      <View style={globalStyles.container}>
        {loading ? (
          <View style={globalStyles.loading}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
          </View>
        ) : (
          <>
            <Divider underlineColor={theme.colors.primary} theme={theme} />

            <ScrollView>
              {messages.length > 0 &&
                messages.map(msg => <ResponseItem item={msg} key={msg.id} />)}
            </ScrollView>
          </>
        )}

        <Loading isVisible={sending} text="Enviando Respuesta" />
      </View>
      <View
        style={{
          height: 125,
          justifyContent: 'center',
          bottom: keyboardStatus,
          backgroundColor: '#f2f2f2',
          width: '100%',
        }}>
        <UploadFile
          filesSelected={filesSelected}
          setFilesSelected={setFilesSelected}
          open={open}
          setOpen={setOpen}
        />

        <View style={styles.viewButton}>
          <TextInput
            label={
              filesSelected.length !== 0
                ? 'Selecciona un archivo...'
                : 'Escriba un mensaje...'
            }
            multiline
            style={styles.input}
            onChange={e => onChange(e, 'comment')}
            value={formData.comment}
            underlineColor={theme.colors.primary}
            theme={theme}
            right={
              <TextInput.Icon
                name="paperclip"
                style={styles.icon}
                underlineColor={theme.colors.primary}
                theme={theme}
                onPress={() => {
                  setOpen(true);
                  setFormData(defaultValue);
                }}
              />
            }
            disabled={filesSelected.length !== 0}
            onSubmitEditing={Keyboard.dismiss}
          />

          <TouchableOpacity
            onPress={() => {
              setSending(true);
            }}>
            <View style={styles.boton}>
              <IconFontAwesome name="paper-plane" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  boton: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    borderRadius: 20,
    display: 'flex',
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  icon: {
    alignItems: 'center',
    backgroundColor: colors.cancelButton,
    borderRadius: 20,
    display: 'flex',
    fontSize: RFValue(22),
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  input: {
    backgroundColor: colors.transparent,
    fontSize: RFValue(14),
    maxHeight: RFValue(100),
    width: '90%',
  },
  viewButton: {
    alignItems: 'center',
    backgroundColor: colors.transparent,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 20,
    marginLeft: 10,
    marginRight: 10,
  },
});

ResponseLetter.propTypes = {
  item: PropTypes.object,
};

export default ResponseLetter;
