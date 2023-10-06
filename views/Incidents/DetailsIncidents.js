/* eslint-disable react-native/no-raw-text */
/* eslint-disable react-native/no-color-literals */
import React, {useEffect, useContext, useState, useRef, Fragment} from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Platform} from 'react-native';
import {
  Text,
  Button,
  Portal,
  Modal,
  ActivityIndicator,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {Image, AirbnbRating} from 'react-native-elements';
import {useIsFocused} from '@react-navigation/native';
import Toast from 'react-native-easy-toast';
import IncidentContext from '../../context/incidents/IncidentContext';
import Comment from '../../components/ui/Comments/owner/Comment';
import {MIX_AWS_URL} from '../../Config/environment';
import {map, size} from 'lodash';
import PropTypes from 'prop-types';
import Form from '../../components/ui/Comments/owner/Form';
import Icon from 'react-native-vector-icons/FontAwesome5';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Loading from '../../components/ui/partials/Loading';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {messageView} from '../../utils/message';

const DetailsIncidents = ({navigation, route}) => {
  //focus screen
  const isFocused = useIsFocused();

  const [args, setArgs] = useState({});
  const [visible, setVisible] = useState(false);
  const [qualify, setQualify] = useState(false);
  const [imageView, setImageView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [image, setImage] = useState('');
  const showImage = url => {
    setImage(url);
    setImageView(true);
  };
  const hideImage = () => {
    setImage('');
    setImageView(false);
  };

  const showQualify = () => setQualify(true);
  const hideQualify = () => setQualify(false);
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);

  //params
  const {subject, description, status, id} = route.params.item;

  //context
  const incidentContext = useContext(IncidentContext);
  const {showIncident, incident, loadComments, message, updateIncident, clear} =
    incidentContext;

  useEffect(() => {
    if (!isFocused) {
      clear();
    } else {
      showIncident(id);
      if (incident) {
        navigation.setOptions({title: subject});
      }

      if (loadComments) {
        hideQualify();
      }
    }
  }, [isFocused, loadComments]);

  useEffect(() => {
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [message]);

  useEffect(() => {
    if (isLoading) {
      handleSubmit();
    }
  }, [isLoading]);

  if (loadComments) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  const notCommentShow = () => {
    messageView('Debes escribir el comentario.', 'warning', 3000);
  };

  //get value for rating btn
  const handleChangeQualification = qualification => {
    const args = incident;
    args['qualification'] = qualification;
    setArgs(args);
  };

  const handleSubmit = async () => {
    try {
      if (Object.keys(args).length > 0) {
        const formData = new FormData();
        formData.append('description', args.description);
        formData.append('subject', args.subject);
        formData.append('qualification', args.qualification);
        await updateIncident(args.id, formData);
      } else {
        messageView('Seleccione una nueva calificación.', 'warning', 3000);
      }
    } catch (error) {
      messageView(error, 'danger', 3000);
    }
    setIsLoading(false);
  };

  return (
    <View style={globalStyles.container}>
      <View
        style={{position: 'absolute', backgroundColor: 'transparent'}}></View>
      <ScrollView>
        {size(incident?.images) > 0 && (
          <Fragment>
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.header}>
              Fotografías
            </Text>
            <ScrollView horizontal={true}>
              {map(incident.images, (item, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => showImage(MIX_AWS_URL + item.image_url)}>
                  <Image
                    style={styles.image}
                    PlaceholderContent={<ActivityIndicator color="fff" />}
                    source={{uri: MIX_AWS_URL + item.image_url}}
                  />
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Fragment>
        )}

        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.header}>
          Información
        </Text>

        <ScrollView style={styles.listItem}>
          <View style={globalStyles.containerItem}>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={colors.white}
              name="information"
            />
            <Text style={globalStyles.itemText}>{status}</Text>
          </View>

          <View style={globalStyles.containerItem}>
            <Text style={globalStyles.itemText}>{description}</Text>
          </View>
        </ScrollView>

        {imageView && (
          <Portal>
            <Modal
              visible={imageView}
              onDismiss={hideImage}
              contentContainerStyle={styles.containerImage}>
              {image.trim() !== '' && (
                <Image
                  resizeMode="cover"
                  PlaceholderContent={<ActivityIndicator color="fff" />}
                  style={styles.viewImage}
                  source={{uri: image}}
                />
              )}
            </Modal>
          </Portal>
        )}

        {visible && (
          <Portal>
            <Modal
              visible={visible}
              onDismiss={hideModal}
              contentContainerStyle={styles.containerStyle}>
              <KeyboardAwareScrollView>
                <Text
                  underlineColor={theme.colors.primary}
                  theme={theme}
                  style={styles.header}>
                  Nuevo comentario
                </Text>
                <Form
                  navigation={navigation}
                  hideModal={hideModal}
                  notCommentShow={notCommentShow}
                />
              </KeyboardAwareScrollView>
            </Modal>
          </Portal>
        )}

        {qualify && (
          <Portal>
            <Modal
              visible={qualify}
              onDismiss={hideQualify}
              contentContainerStyle={styles.containerStyle}>
              <View>
                <Text
                  underlineColor={theme.colors.primary}
                  theme={theme}
                  style={styles.header}>
                  Calificación
                </Text>

                <View style={styles.qualificationView}>
                  <Text
                    underlineColor={theme.colors.primary}
                    theme={theme}
                    style={styles.qualificationText}>
                    Por favor, califique la atención que ha recibido.
                  </Text>
                </View>
                <AirbnbRating
                  count={5}
                  reviews={[
                    'Pésimo',
                    'Deficiente',
                    'Normal',
                    'Muy Bueno',
                    'Excelente',
                  ]}
                  defaultRating={incident?.qualification}
                  size={RFValue(20)}
                  onFinishRating={value => {
                    handleChangeQualification(value);
                  }}
                />

                <Button
                  mode="contained"
                  style={styles.sendButton}
                  underlineColor={theme.colors.primary}
                  theme={theme}
                  onPress={() => setIsLoading(true)}>
                  Enviar calificación
                </Button>

                <Loading isVisible={isLoading} text="Enviando calificación" />
              </View>
            </Modal>
          </Portal>
        )}

        {incident.status === 'Cerrado' && (
          <TouchableOpacity onPress={() => showQualify()}>
            <View style={styles.results}>
              <MaterialCommunityIcons
                name="star"
                color={colors.primary}
                size={RFValue(20)}
              />
              <Text
                underlineColor={theme.colors.primary}
                theme={theme}
                style={styles.title}>
                Calificar
              </Text>
            </View>
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => showModal()}>
          <View style={styles.results}>
            <MaterialCommunityIcons
              name="tooltip-edit"
              color={theme.colors.primary}
              size={RFValue(20)}
            />
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={styles.title}>
              Escribe un comentario
            </Text>
          </View>
        </TouchableOpacity>

        {incident && size(incident.comments) > 0 && (
          <>
            {map(incident.comments, (comment, index) => (
              <Comment key={index} comment={comment} />
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  containerImage: {
    alignItems: 'center',
    backgroundColor: 'white',
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    padding: 20,
  },
  containerStyle: {
    backgroundColor: colors.accent,
    justifyContent: 'center',
    marginHorizontal: '2.5%',
    margin: 20,
    padding: 20,
  },
  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 20,
    textAlign: 'center',
  },
  iconStyles: {
    fontSize: RFValue(20),
    textDecorationStyle: 'solid',
  },
  image: {
    height: 200,
    marginRight: 10,
    width: 200,
  },

  itemText: {
    fontSize: RFValue(12),
    fontWeight: 'normal',
    margin: 10,
  },
  listItem: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 5,
    minHeight: 200,
    padding: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  qualificationText: {
    fontSize: RFValue(15),
    marginBottom: 5,
    textAlign: 'center',
  },
  qualificationView: {
    marginTop: 20,
  },
  results: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: 20,
  },
  title: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(15),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginLeft: 10,
  },
  viewImage: {
    height: 300,
    width: 300,
  },
});

DetailsIncidents.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default DetailsIncidents;
