import React, {useEffect, useRef} from 'react';
import {useContext} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {FAB, ActivityIndicator, Text} from 'react-native-paper';
import {Avatar} from 'react-native-elements';
import {MIX_AWS_URL} from '../../Config/environment';
import authContext from '../../context/autentication/authContext';
import globalStyles, {configFonts, theme} from '../../styles/global';
import IconAnt from 'react-native-vector-icons/AntDesign';
import Ionicon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import ProfileContext from '../../context/profile/profileContext';
import Toast from 'react-native-easy-toast';
import {useIsFocused} from '@react-navigation/native';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {messageView} from '../../utils/message';

const Profile = ({navigation}) => {
  const auth = useContext(authContext);
  const {user: authUser} = auth;
  const profileContext = useContext(ProfileContext);
  const {profile, loading, message, clear, getProfile, error} = profileContext;

  const isFocused = useIsFocused();

  const cellphones = profile ? JSON.parse(profile.cellphones) : [];
  const telephones = profile ? JSON.parse(profile.telephones) : [];

  useEffect(() => {
    if (isFocused) {
      clear();
      getProfile(authUser.id);
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
    <View style={styles.item}>
      <View style={styles.listItem}>
        <Avatar
          rounded
          PlaceholderContent={<ActivityIndicator color="fff" />}
          source={
            profile.avatar
              ? {uri: MIX_AWS_URL + profile.avatar}
              : require('../../assets/images/Profile.png')
          }
          size={RFValue(100)}
          containerStyle={styles.image}
        />
        <View style={styles.viewTexts}>
          <Text style={styles.namesText}>{profile?.fullname}</Text>

          {profile.document_id !== '0' && (
            <View style={globalStyles.containerItem}>
              <MaterialCommunityIcons
                style={styles.iconStyles}
                color={colors.white}
                name="card-account-details"
              />
              <Text style={globalStyles.itemText}>{profile.document_id}</Text>
            </View>
          )}

          <View style={globalStyles.containerItem}>
            <MaterialCommunityIcons
              style={styles.iconStyles}
              color={colors.white}
              name="email"
            />
            <Text style={globalStyles.itemText}>{profile.email}</Text>
          </View>

          {cellphones.length > 0 && (
            <View style={globalStyles.containerItem}>
              <MaterialCommunityIcons
                style={styles.iconStyles}
                color={colors.white}
                name="cellphone"
              />
              <Text style={globalStyles.itemText}>{cellphones}</Text>
            </View>
          )}
          {telephones.length > 0 && (
            <View style={globalStyles.containerItem}>
              <MaterialCommunityIcons
                style={styles.iconStyles}
                color={colors.white}
                name="phone"
              />
              <Text style={globalStyles.itemText}>{telephones}</Text>
            </View>
          )}
        </View>
      </View>
      <FAB
        icon="pencil"
        style={globalStyles.fab}
        onPress={() => {
          clear();
          navigation.navigate('editProfile');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  iconStyles: {
    fontSize: RFValue(20),
    textDecorationStyle: 'solid',
  },
  image: {marginBottom: '2.5%'},
  item: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    margin: 20,
  },
  itemText: {
    color: colors.white,
    fontSize: RFValue(10),
  },
  listItem: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 10,
    height: '50%',
    justifyContent: 'center',
    margin: 20,
    maxHeight: '100%',
    padding: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    width: '100%',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },

  namesText: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(12),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
});

export default Profile;
