import React, {useContext, useRef} from 'react';
import {View, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import NoItems from '../../components/ui/partials/NoItems';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import {messageView} from '../../utils/message';
import DocumentsContext from '../../context/documents/documentsContext';
import Item from './Item';

const Categories = ({route, navigation}) => {
  const documentContext = useContext(DocumentsContext);
  const {loadCategories, loading, error, documentCategories, clear} =
    documentContext;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      loadCategories();
    } else {
      clear();
    }
  }, [isFocused]);

  useEffect(() => {
    if (error) {
      messageView(error, 'danger', 3000);
    }
  }, [error]);

  if (loading) {
    return (
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View style={globalStyles.container}>
      {documentCategories?.length > 0 ? (
        <FlatList
          data={documentCategories}
          keyExtractor={item => item.id}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}
    </View>
  );
};

Categories.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default Categories;
