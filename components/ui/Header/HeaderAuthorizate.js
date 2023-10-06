import React from 'react';
import {Button} from 'react-native-paper';

const Header = ({navigation, route}) => {
  const handlePress = () => {
    navigation.navigate('previousAuthorizatesOwner');
  };

  return (
    <Button color="#FFF" onPress={() => handlePress()}>
      Anteriores
    </Button>
  );
};

export default Header;
