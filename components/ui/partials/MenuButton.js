// import React in our code
import React, {useState, useRef, useContext} from 'react';
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
} from 'react-native';
import ModalDropdown from 'react-native-modal-dropdown';
import {Appbar, IconButton, Text} from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import EntypoIcon from 'react-native-vector-icons/Entypo';
//import {Menu,MenuProvider,MenuOptions,MenuOption ,MenuTrigger} from 'react-native-popup-menu' ;
import {Dropdown} from 'react-native-material-dropdown-v2';
import Menu, {MenuItem, MenuDivider} from 'react-native-material-menu';
import AuthContext from '../../../context/autentication/authContext';
import {configFonts, theme} from '../../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';

const removeDuplicates = (originalArray, prop) => {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
};

const MenuButton = () => {
  //const {imagesSelected, setImagesSelected} = props;
  const menuRef = useRef(null);

  //import context
  const authContext = useContext(AuthContext);

  const {
    selectedAccount,
    token,
    user,
    hangleToggleAccount,
    selectedFilial,
    loading,
  } = authContext;

  const [accounts, setAccounts] = useState(
    removeDuplicates(user.filiales, 'id'),
  );

  const handleOnSelect = async value => {
    setSelectData(value);
  };

  const showMenu = () => {
    menuRef.current.show();
  };

  const hideMenu = () => {
    menuRef.current.hide();
  };

  //display accounts
  const displayAccounts = () => {
    return accounts.map((filial, index) => {
      const disabled =
        selectedAccount.id === filial.account.id &&
        selectedFilial.id === filial.id;
      return (
        <View key={index}>
          <MenuDivider />
          <MenuItem
            disabled={disabled}
            onPress={() => {
              hangleToggleAccount(filial.account, filial, menuRef);
            }}>
            <Text
              theme={theme}
              style={{
                fontSize: 15,
                fontFamily: configFonts.default.medium.fontFamily,
                fontWeight: Platform.select({ios: 'bold', android: undefined}),
                color: disabled ? '#c4c4c4' : 'black',
              }}>
              {filial.name + '-' + filial.account.name}
            </Text>
          </MenuItem>
        </View>
      );
    });
  };

  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Menu
        ref={menuRef}
        button={
          <IconButton
            size={RFValue(25)}
            color={colors.white}
            onPress={() => showMenu()}
            icon={({size, color}) => (
              <>
                <MaterialCommunityIcons
                  name="account-convert"
                  size={size}
                  color={color}
                  backgroundColor={theme.colors.primary}
                />
              </>
            )}
          />
        }>
        {displayAccounts()}
      </Menu>
    </View>
  );
};

export default MenuButton;

const styles = StyleSheet.create({});
