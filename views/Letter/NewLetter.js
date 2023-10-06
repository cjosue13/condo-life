import React, {useState, Fragment, useRef, useContext, useEffect} from 'react';
import {View, StyleSheet, ScrollView, Platform} from 'react-native';
import {TextInput, Button as PaperButton, Text} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import UploadFiles from '../../components/ui/partials/UploadFiles';
import Toast from 'react-native-easy-toast';
import RequiredField from '../../components/ui/forms/RequiredField';
import {MultiselectDropdown} from 'sharingan-rn-modal-dropdown';
import LettersContext from '../../context/letters/lettersContext';
import {useIsFocused} from '@react-navigation/native';
import Loading from '../../components/ui/partials/Loading';
import FieldError from '../../components/ui/errors/FieldError';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const defaultForm = {
  content: '',
  subject: '',
  emails: [],
};

const NewLetter = ({navigation, route}) => {
  const isFocused = useIsFocused();
  const [filesSelected, setFilesSelected] = useState([]);
  const [formData, setFormData] = useState(defaultForm);
  const [emailsSelected, setEmailsSelected] = useState([]);
  const [emails, setEmails] = useState([]);
  const [loading, setLoading] = useState(false);
  const letterContext = useContext(LettersContext);

  const {
    errors,
    error,
    message,
    admins,
    loadAdmins,
    createLetter,
    created,
    edited,
  } = letterContext;

  useEffect(() => {
    if (created || edited) {
      navigation.navigate('letters');
    }
  }, [created, edited]);

  useEffect(() => {
    if (admins.length > 0) {
      const data = admins.map(admin => ({
        label: `${admin.name} ${admin.lastname}`,
        value: admin.id,
        object: {
          id: admin.id,
          name: `${admin.name} ${admin.lastname}`,
          mail: admin.email,
        },
      }));

      setEmails(data);
    }
  }, [admins]);

  useEffect(() => {
    if (loading) {
      handleFormSubmit();
    }
  }, [loading]);

  useEffect(() => {
    loadAdmins();
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  const onChange = (e, type) => {
    setFormData({...formData, [type]: e.nativeEvent.text});
  };

  const handleFormSubmit = async () => {
    try {
      const arrayEmails = emailsSelected.map(id => {
        const admin = emails.find(item => id === item.value);
        if (admin) return {...admin.object};
      });
      await createLetter({
        ...formData,
        file: filesSelected.length > 0 ? filesSelected : null,
        emails: arrayEmails.length > 0 ? JSON.stringify(arrayEmails) : '',
      });
    } catch (error) {
      messageView(error, 'danger', 3000);
    }

    setLoading(false);
  };

  return (
    <Fragment>
      <KeyboardAwareScrollView>
        <View style={globalStyles.container}>
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Comunicado
          </Text>
          <RequiredField field={'Asunto'} />
          <TextInput
            label="Asunto"
            onChange={e => onChange(e, 'subject')}
            value={formData.subject}
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.input}
          />
          {FieldError(errors, 'subject')}

          <RequiredField field={'Administrador'} />
          <View style={styles.container}>
            <MultiselectDropdown
              label="Selecciona los destinatarios"
              data={emails}
              primaryColor={theme.colors.primary}
              textInputStyle={styles.input}
              // enableSearch
              selectedItemTextStyle={{
                fontFamily: configFonts.default.medium.fontFamily,
                fontWeight: Platform.select({ios: 'bold', android: undefined}),
              }}
              itemTextStyle={{
                fontFamily: configFonts.default.regular.fontFamily,
                fontWeight: 'normal',
              }}
              disableSelectionTick
              removeLabel
              textInputPlaceholder="Selecciona un administrador"
              selectedItemsText={
                emailsSelected.length === 1 ? 'destinatario' : 'destinatarios'
              }
              emptySelectionText="No se han seleccionado destinatarios"
              chipType="outlined"
              value={emailsSelected}
              required
              onChange={setEmailsSelected}
              underlineColor={theme.colors.primary}
              paperTheme={theme}
            />
            {FieldError(errors, 'emails')}
          </View>

          <RequiredField field={'Comunicado'} />

          <TextInput
            label="Comunicado"
            multiline
            numberOfLines={4}
            style={styles.input}
            onChange={e => onChange(e, 'content')}
            value={formData.content}
            underlineColor={theme.colors.primary}
            theme={theme}
          />
          {FieldError(errors, 'content')}
          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={styles.header}>
            Archivos seleccionados
          </Text>
          <UploadFiles
            filesSelected={filesSelected}
            setFilesSelected={setFilesSelected}
          />
        </View>
        <Loading isVisible={loading} text="Enviando Comunicado" />
      </KeyboardAwareScrollView>

      <View style={styles.viewButton}>
        <PaperButton
          mode="contained"
          style={styles.boton}
          underlineColor={theme.colors.primary}
          theme={theme}
          onPress={() => setLoading(true)}>
          Enviar
        </PaperButton>
      </View>
    </Fragment>
  );
};

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
  },
  container: {
    flex: 1,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 10,
    textAlign: 'center',
  },
  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
  },
  viewButton: {
    backgroundColor: '#e3e3e3',
    padding: 12,
  },
});

export default NewLetter;
