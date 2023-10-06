/* eslint-disable react-native/no-color-literals */
import React, {useContext, useState} from 'react';
import {Platform, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import PropTypes from 'prop-types';
import moment from 'moment';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';
import {Image} from 'react-native-elements';
import {ActivityIndicator, Text} from 'react-native-paper';
import {MIX_AWS_URL} from '../../Config/environment';
import download from '../../utils/DownloadFile';
import Loading from '../../components/ui/partials/Loading';
import {useRef} from 'react';
import {configFonts, theme} from '../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import authContext from '../../context/autentication/authContext';
import {messageView} from '../../utils/message';

const ResponseItem = ({item}) => {
  const reg = /(\.jpg|\.jpeg|\.bmp|\.gif|\.png)$/i;
  const [donwloadFile, setDownloadFile] = useState(false);

  const auth = useContext(authContext);
  const {user} = auth;
  const handleDonwload = async url => {
    try {
      await download(url);
    } catch (error) {
      messageView(error.message, 'danger', 3000);
    }
    setDownloadFile(false);
  };

  return (
    <View
      style={
        user.id !== item.user.id ? styles.containerOther : styles.containerOwn
      }>
      <View style={styles.listItem}>
        <View style={styles.image}>
          <Avatar
            rounded
            source={
              item.user.avatar
                ? {uri: MIX_AWS_URL + item.user.avatar}
                : require('../../assets/images/Profile.png')
            }
            size={RFValue(50)}
          />
        </View>

        <View style={styles.viewTexts}>
          <Text
            style={
              user.id !== item.user.id ? styles.namesText : styles.namesTextOwn
            }>
            {item.user.fullname}
          </Text>
          {item.file_url != 'undefined' ? (
            <TouchableOpacity
              onPress={() => {
                setDownloadFile(true);
                handleDonwload(MIX_AWS_URL + item.file_url);
              }}>
              {reg.exec(item.file_url) ? (
                <Image
                  key={item.id}
                  style={styles.miniatureStyle}
                  PlaceholderContent={<ActivityIndicator color="fff" />}
                  source={{uri: MIX_AWS_URL + item.file_url}}
                />
              ) : (
                <View style={styles.containerFile}>
                  <IconFontAwesome
                    name="file-alt"
                    color={theme.colors.primary}
                    size={RFValue(60)}
                  />
                  <Text
                    underlineColor={theme.colors.primary}
                    theme={theme}
                    style={styles.text}>
                    {item.file_url.length > 15
                      ? '...' +
                        item.file_url.substr(
                          item.file_url.length - 15,
                          item.file_url.length,
                        )
                      : item.file_url}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ) : (
            <Text
              underlineColor={theme.colors.primary}
              theme={theme}
              style={user.id !== item.user.id ? styles.item : styles.itemOwn}>
              {item.comment}
            </Text>
          )}

          <Text
            underlineColor={theme.colors.primary}
            theme={theme}
            style={
              user.id !== item.user.id
                ? styles.timeMessage
                : styles.timeMessageOwn
            }>
            {moment(item.created_at, 'YYYY-MM-DD hh:mm:ss')
              .locale('es')
              .fromNow()}
          </Text>
        </View>
      </View>
      <Loading isVisible={donwloadFile} text="Descargando archivo" />
    </View>
  );
};

const styles = StyleSheet.create({
  containerFile: {
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: '#e3e3e3',
    borderRadius: 20,
    borderWidth: 1,
    height: RFValue(100),
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
    width: RFValue(150),
  },
  containerOther: {
    alignSelf: 'flex-start',
    backgroundColor: colors.cancelButton,
    borderRadius: 20,
    flexDirection: 'column',
    margin: 5,
    padding: 20,
    width: '85%',
  },
  containerOwn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    borderRadius: 20,
    flex: 1,
    flexDirection: 'column',
    margin: 5,
    padding: 20,
    width: '85%',
  },
  image: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
  },
  item: {
    color: colors.black,
    fontSize: RFValue(12),
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
  },
  itemOwn: {
    color: colors.white,
    fontSize: RFValue(12),
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.transparent,
    borderRadius: 20,
    flexDirection: 'row',
    width: '100%',
  },
  miniatureStyle: {
    borderRadius: 20,
    height: 100,
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
    width: 150,
  },
  namesText: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(14),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
  namesTextOwn: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(14),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
  },
  text: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(13),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 5,
  },
  textOwn: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(13),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    marginTop: 5,
  },
  timeMessage: {
    color: colors.black,
    fontSize: RFValue(10),
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
    textAlign: 'right',
  },
  timeMessageOwn: {
    color: colors.white,
    fontSize: RFValue(10),
    justifyContent: 'center',
    marginBottom: 10,
    marginLeft: 0,
    marginRight: 10,
    marginTop: 10,
    textAlign: 'right',
  },
  viewTexts: {
    margin: 20,
    width: '80%',
  },
});

ResponseItem.propTypes = {
  item: PropTypes.object.isRequired,
};

export default ResponseItem;
