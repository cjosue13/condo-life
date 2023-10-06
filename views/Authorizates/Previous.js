/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, {Fragment, useRef} from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Platform,
} from 'react-native';
import {
  ActivityIndicator,
  DataTable,
  IconButton,
  Searchbar,
  Text,
  TextInput,
} from 'react-native-paper';
import globalStyles, {configFonts, theme} from '../../styles/global';
import Feather from 'react-native-vector-icons/Feather';
import Toast from 'react-native-easy-toast';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useContext} from 'react';
import {useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';
import NoItems from '../../components/ui/partials/NoItems';
import AutorizationsContext from '../../context/autorizations/autorizationsContext';
import PropTypes from 'prop-types';
import authContext from '../../context/autentication/authContext';
import {haveRestrictions} from '../../utils/auth';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const Previous = ({navigation}) => {
  const autorizationContext = useContext(AutorizationsContext);
  const auth = useContext(authContext);
  const {user} = auth;

  const [items, setItems] = useState([]);
  const {
    error,
    message,
    oldAutorizations,
    loadOldAutorizations,
    clear,
    loading,
  } = autorizationContext;

  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadOldAutorizations();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    setItems(oldAutorizations);
  }, [oldAutorizations]);

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

  const onChange = text => {
    if (text.trim() !== '') {
      const filterData =
        oldAutorizations.filter(item =>
          item.fullname.toUpperCase().includes(text.trim().toUpperCase()),
        ).length > 0
          ? oldAutorizations.filter(item =>
              item.fullname.toUpperCase().includes(text.trim().toUpperCase()),
            )
          : [{empty: true}];
      setItems(filterData);
    } else {
      setItems(oldAutorizations);
    }
  };

  return (
    <View style={globalStyles.container}>
      {items.length > 0 ? (
        <Fragment>
          <Searchbar
            onChange={e => onChange(e.nativeEvent.text)}
            placeholder="Buscar..."
            theme={theme}
          />
          <ScrollView>
            <DataTable>
              <DataTable.Header style={styles.header}>
                <DataTable.Title style={styles.center}>
                  <Text style={styles.headerText}>Nombre</Text>
                </DataTable.Title>
                {!haveRestrictions('Leer autorizado', user.restrictions) && (
                  <DataTable.Title style={styles.center}>
                    <Text style={styles.headerText}>Acciones</Text>
                  </DataTable.Title>
                )}
              </DataTable.Header>

              {items.map((item, index) =>
                item.empty ? null : (
                  <DataTable.Row
                    key={index}
                    style={{
                      borderBottomWidth: 0,
                      backgroundColor:
                        index % 2 !== 0 ? colors.table : colors.white,
                    }}>
                    <DataTable.Cell style={styles.center}>
                      <Text
                        style={styles.subInfo}
                        underlineColor={theme.colors.primary}
                        theme={theme}>
                        {item.fullname}
                      </Text>
                    </DataTable.Cell>
                    {!haveRestrictions(
                      'Leer autorizado',
                      user.restrictions,
                    ) && (
                      <DataTable.Cell style={styles.center}>
                        <IconButton
                          icon={({size, color}) => (
                            <MaterialCommunityIcons
                              name="account-edit"
                              size={size}
                              color={color}
                            />
                          )}
                          color={colors.primary}
                          size={RFValue(20)}
                          onPress={() => {
                            navigation.navigate('detailsAuthorizate', {
                              item,
                              previous: true,
                            });
                          }}
                        />
                      </DataTable.Cell>
                    )}
                  </DataTable.Row>
                ),
              )}
            </DataTable>
          </ScrollView>
        </Fragment>
      ) : (
        <NoItems />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  center: {
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    margin: RFValue(5),
  },
  header: {
    backgroundColor: colors.table,
    marginTop: '2.5%',
  },

  headerText: {
    color: colors.black,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(15),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },

  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  subInfo: {
    fontSize: RFValue(12),
  },
});

Previous.propTypes = {
  navigation: PropTypes.object.isRequired,
};

export default Previous;
