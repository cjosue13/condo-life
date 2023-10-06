import React, {useContext, useRef} from 'react';
import {View, FlatList} from 'react-native';
import PropTypes from 'prop-types';
import {useEffect} from 'react';
import NoItems from '../../components/ui/partials/NoItems';
import LettersContext from '../../context/letters/lettersContext';
import {useIsFocused} from '@react-navigation/native';
import {ActivityIndicator} from 'react-native-paper';
import Toast from 'react-native-easy-toast';
import globalStyles, {theme} from '../../styles/global';
import LetterItem from './LetterItem';
import {messageView} from '../../utils/message';

const ListItem = ({route, navigation}) => {
  const {categorie} = route.params;
  const letterContext = useContext(LettersContext);
  const {show, loading, error, message, lettersCategories, showSents, clear} =
    letterContext;
  const isFocused = useIsFocused();

  useEffect(() => {
    if (isFocused) {
      navigation.setOptions({title: categorie.name});
      if (!categorie.sent) {
        show(categorie.id);
      } else {
        showSents(categorie.id);
      }
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
      <View style={globalStyles.loading}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  return (
    <View style={globalStyles.container}>
      {lettersCategories?.length > 0 ? (
        <FlatList
          data={lettersCategories}
          keyExtractor={letter => letter.key}
          style={{flex: 1}}
          renderItem={({item}) => (
            <LetterItem item={item} navigation={navigation} />
          )}
        />
      ) : (
        <NoItems />
      )}
    </View>
  );
};

ListItem.propTypes = {
  route: PropTypes.object.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default ListItem;
