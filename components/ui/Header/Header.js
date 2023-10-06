import React from 'react';
import {Button} from 'react-native-paper';

const Header = ({navigation, route, create}) => {
  const handlePress = () => {
    navigation.navigate('guestOwner', {create: create});
  };

  return (
    <Button icon="plus-circle" color="#FFF" onPress={() => handlePress()}>
      Invitados
    </Button>
  );
};

export default Header;
