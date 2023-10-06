/* eslint-disable react-native/no-color-literals */
//Covi360 module
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
import DocumentsContext from '../../context/documents/documentsContext';
import {useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {useEffect} from 'react';
import NoItems from '../../components/ui/partials/NoItems';
import Loading from '../../components/ui/partials/Loading';
import download from '../../utils/DownloadFile';
import {MIX_AWS_URL} from '../../Config/environment';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';

const Documents = ({route}) => {
  const {categorie} = route.params;
  const documentContext = useContext(DocumentsContext);
  const {documents, loadDocuments, loading, error, message, clear} =
    documentContext;
  const [items, setItems] = useState([]);
  const [donwloadFile, setDownloadFile] = useState(false);
  const isFocused = useIsFocused();

  const onChange = text => {
    if (text.trim() !== '') {
      const filterData =
        documents.filter(item =>
          item.name.toUpperCase().includes(text.trim().toUpperCase()),
        ).length > 0
          ? documents.filter(item =>
              item.name.toUpperCase().includes(text.trim().toUpperCase()),
            )
          : [{empty: true}];
      setItems(filterData);
    } else {
      setItems(documents);
    }
  };

  useEffect(() => {
    if (isFocused) {
      loadDocuments(categorie);
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    setItems(documents);
  }, [documents]);

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

  const handleDonwload = async url => {
    try {
      await download(url);
    } catch (error) {
      messageView(error.message, 'danger', 3000);
    }
    setDownloadFile(false);
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
                <DataTable.Title style={styles.center}>
                  <Text style={styles.headerText}>Acciones</Text>
                </DataTable.Title>
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
                        {item.name}
                      </Text>
                    </DataTable.Cell>
                    <DataTable.Cell style={styles.center}>
                      <IconButton
                        icon={() => (
                          <MaterialCommunityIcons
                            name="download"
                            color={colors.primary}
                            size={RFValue(20)}
                          />
                        )}
                        size={RFValue(20)}
                        onPress={() => {
                          setDownloadFile(true);
                          handleDonwload(MIX_AWS_URL + item.file);
                        }}
                      />
                    </DataTable.Cell>
                  </DataTable.Row>
                ),
              )}
            </DataTable>
          </ScrollView>
        </Fragment>
      ) : (
        <NoItems />
      )}
      <Loading isVisible={donwloadFile} text="Descargando archivo" />
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

export default Documents;
