import React, {useContext, useRef, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {Image} from 'react-native-elements';
import PropTypes from 'prop-types';
import {
  ActivityIndicator,
  Divider,
  FAB,
  Text,
  TextInput,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import {useEffect} from 'react';
import Toast from 'react-native-easy-toast';
import {useIsFocused} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {map} from 'lodash';
import LettersContext from '../../context/letters/lettersContext';
import {MIX_AWS_URL} from '../../Config/environment';
import download from '../../utils/DownloadFile';
import Loading from '../../components/ui/partials/Loading';
import ResponseLetter from './ResponseLetter';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {color} from 'react-native-reanimated';
import {messageView} from '../../utils/message';

const DetailsLetter = ({route, navigation}) => {
  const {item} = route.params;

  const letterContext = useContext(LettersContext);
  const {
    loading,
    error,
    message,
    showLetter,
    letter,
    reponsesLetter,
    ready,
    clear,
    clearOptions,
  } = letterContext;

  // console.log(letter);

  const isFocused = useIsFocused();
  const [donwloadFile, setDownloadFile] = useState(false);

  const reg = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;

  useEffect(() => {
    showLetter(item.id);
    if (!isFocused) clear();
  }, [isFocused]);
  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
    if (message) {
      messageView(message, 'success', 3000);
    }
  }, [error, message]);

  const handleDonwload = async url => {
    try {
      await download(url);
    } catch (error) {
      messageView(error.message, 'danger', 3000);
    }

    setDownloadFile(false);
  };

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <>
      <View
        style={{
          marginHorizontal: '2.5%',
          flex: 1,
          marginTop: 20,
          height: '100%',
        }}>
        <View style={styles.info}>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Text
              style={{
                fontFamily: configFonts.default.medium.fontFamily,
                fontWeight: Platform.select({ios: 'bold', android: undefined}),
                margin: 1,
                color: '#000000',
                fontSize: RFValue(12),
              }}>
              {letter?.subject}
            </Text>
          </View>
          <View style={{alignItems: 'flex-start', flex: 1}}>
            <Text style={{margin: 1, fontSize: RFValue(12)}}>
              {letter?.created_at}
            </Text>
          </View>
        </View>
        <ScrollView style={{maxHeight: '100%'}}>
          <View style={globalStyles.container}>
            <View style={styles.topItem}>
              <View style={styles.viewTexts}>
                {ready?.length > 0 && ready[0]?.ready === 1 && (
                  <MaterialCommunityIcons
                    name="check-all"
                    color={colors.white}
                    style={styles.check}
                  />
                )}
                <ScrollView>
                  <Text style={{fontSize: RFValue(12), color: colors.white}}>
                    {letter?.content}
                  </Text>
                </ScrollView>
              </View>
            </View>
            {letter?.images?.length > 0 && (
              <>
                <Text style={styles.header}>Adjuntos</Text>

                {map(letter?.images, (file, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setDownloadFile(true);
                      handleDonwload(MIX_AWS_URL + file.image_url);
                    }}>
                    <View style={styles.containerBottom}>
                      <View style={styles.containerFile}>
                        <MaterialCommunityIcons
                          name="file-download"
                          color={theme.colors.primary}
                          size={RFValue(30)}
                        />
                        <Text style={styles.text}>
                          {file.image_url.length > 15
                            ? '...' +
                              file.image_url.substr(
                                file.image_url.length - 15,
                                file.image_url.length,
                              )
                            : file.image_url}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
          <Loading isVisible={donwloadFile} text="Descargando archivo" />
        </ScrollView>
      </View>
      <View
        style={{
          flex: 1,
        }}>
        <ResponseLetter item={letter} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  check: {
    fontSize: RFValue(20),
    textAlign: 'right',
  },
  containerBottom: {
    alignItems: 'center',
    flex: 1,
    margin: '2.5%',
  },
  containerFile: {
    alignItems: 'center',
    backgroundColor: colors.cancelButton,
    borderRadius: 20,
    justifyContent: 'center',
    padding: '2.5%',
    width: RFValue(70),
  },

  header: {
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(22),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  info: {
    alignSelf: 'center',
    backgroundColor: colors.white,

    borderRadius: 20,
    flexDirection: 'row',
    margin: 5,
    padding: 10,
  },

  text: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(10),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 5,
  },
  topItem: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 10,
    marginBottom: 20,
    minHeight: 150,
    padding: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: '100%',
  },
  viewTexts: {
    margin: 20,
  },
});

DetailsLetter.propTypes = {
  navigation: PropTypes.object.isRequired,
  route: PropTypes.object.isRequired,
};

export default DetailsLetter;
