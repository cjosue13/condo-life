import React, {useContext, useEffect, useRef} from 'react';
import {FlatList, View} from 'react-native';
import {FAB, ActivityIndicator} from 'react-native-paper';
import globalStyles, {theme} from '../../styles/global';
import Item from './Categories';
import {useIsFocused} from '@react-navigation/native';
import LettersContext from '../../context/letters/lettersContext';
import NoItems from '../../components/ui/partials/NoItems';
import Toast from 'react-native-easy-toast';
import {messageView} from '../../utils/message';

const Letter = ({navigation}) => {
  const letterContext = useContext(LettersContext);
  const {
    lettersCategories,
    loading,
    message,
    clear,
    letters,
    fromLetters,
    error,
    load,
  } = letterContext;

  // console.log(lettersCategories?.lettersCategories);

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      load();
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
      {letters?.length > 0 ? (
        <FlatList
          data={letters}
          keyExtractor={letter => {
            const random = Math.floor(Math.random() * 100000) + 1;
            return letter.id.toString() + ' letter ' + random;
          }}
          style={{flex: 1}}
          renderItem={({item}) => <Item item={item} navigation={navigation} />}
        />
      ) : (
        <NoItems />
      )}

      <FAB
        icon="plus"
        style={globalStyles.fab}
        onPress={() => {
          clear();
          navigation.navigate('newLetter');
        }}
      />
    </View>
  );
};

export default Letter;
