import React, {useEffect, useState, useRef, useContext} from 'react';
import {
  Alert,
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  DefaultTheme,
  IconButton,
} from 'react-native-paper';
import BookingsContext from '../../context/bookings/bookingsContext';
import globalStyles, {configFonts, theme} from '../../styles/global';
import axios from 'axios';
import Toast from 'react-native-easy-toast';
import Item from './ListItemsBookings';
// import Carousel from '../../components/ui/partials/Carousel';
import Loading from '../../components/ui/partials/Loading';
import 'react-native-get-random-values';
import {v4 as uuidv4} from 'uuid';
import RequiredField from '../../components/ui/forms/RequiredField';
import {RFValue} from 'react-native-responsive-fontsize';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import colors from '../../styles/colors';
import {messageView} from '../../utils/message';
import CardView from 'react-native-cardview';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Guest = ({update = false, setGuest, hideGuest}) => {
  // state component

  const [items, setItems] = useState([defaultValueForm()]);
  const bookingContext = useContext(BookingsContext);
  const {updateGuestList} = bookingContext;

  //change field function
  const onChange = (e, type, index) => {
    e.persist();
    setItems(items =>
      items.map((item, i) =>
        index !== i ? item : {...item, [type]: e?.nativeEvent?.text || ''},
      ),
    );
  };

  //handle form submit function
  const handleFormSubmit = () => {
    let valid = true;

    items.forEach(item => {
      if (item.name.trim() === '' && item.lastname.trim() === '') {
        valid = false;
        item.errorName = true;
        item.errorLastname = true;
      } else if (item.name.trim() === '' || item.lastname.trim() === '') {
        valid = false;
      }
      item.errorName = item.name.trim() === '';
      item.errorLastname = item.lastname.trim() === '';
    });

    if (!valid) {
      setItems([...items]);
      messageView('Todos los campos son obligatorios.', 'warning', 3000);
    } else {
      if (!update)
        setGuest(guest => {
          return guest.concat(items);
        });
      else updateGuestList(items);

      hideGuest();
    }
  };

  return (
    <View style={styles.main}>
      <View style={styles.container}>
        <View style={styles.right}>
          <IconButton
            size={RFValue(25)}
            color={colors.primary}
            onPress={() => setItems(items => [defaultValueForm(), ...items])}
            icon={({size, color}) => (
              <MaterialCommunityIcons
                name="account-multiple-plus"
                size={size}
                color={color}
                backgroundColor={theme.colors.primary}
              />
            )}
          />
          <TouchableOpacity
            onPress={() => setItems(items => [defaultValueForm(), ...items])}>
            <Text style={styles.text}>Agregar</Text>
          </TouchableOpacity>
        </View>
        <KeyboardAwareScrollView>
          <ScrollView>
            {items.map((item, index) => (
              <CardView
                key={index}
                style={styles.listItem}
                cardElevation={7}
                cardMaxElevation={2}
                cornerRadius={10}>
                <View style={styles.right}>
                  <IconButton
                    size={RFValue(25)}
                    color={colors.after}
                    onPress={() => {
                      if (items.length !== 1) {
                        setItems(items =>
                          items.filter((form, i) => index !== i && form),
                        );
                      }
                    }}
                    icon={({size, color}) => (
                      <MaterialCommunityIcons
                        name="delete"
                        size={size}
                        color={color}
                        backgroundColor={theme.colors.primary}
                      />
                    )}
                  />
                </View>
                <Text style={globalStyles.title}>Invitado</Text>
                <View>
                  <TextInput
                    label="Nombre"
                    onChange={e => onChange(e, 'name', index)}
                    value={item.name}
                    style={styles.input}
                    underlineColor={theme.colors.primary}
                    theme={theme}
                    error={item.errorName}
                  />
                  <TextInput
                    label="Apellidos"
                    onChange={e => onChange(e, 'lastname', index)}
                    value={item.lastname}
                    style={styles.input}
                    underlineColor={theme.colors.primary}
                    theme={theme}
                    error={item.errorLastname}
                  />
                </View>
              </CardView>
            ))}
          </ScrollView>
        </KeyboardAwareScrollView>
      </View>
      <Button
        mode="contained"
        style={styles.boton}
        underlineColor={theme.colors.primary}
        theme={theme}
        onPress={() => handleFormSubmit()}>
        Agregar invitados
      </Button>
    </View>
  );
};

export const defaultValueForm = () => {
  return {
    name: '',
    lastname: '',
    errorName: false,
    errorLastname: false,
    id: uuidv4(),
    local: true,
  };
};

export default Guest;

const styles = StyleSheet.create({
  boton: {
    backgroundColor: theme.colors.primary,
    marginTop: '2.5%',
  },
  container: {
    flex: 1,
  },
  input: {
    backgroundColor: colors.white,
    fontSize: RFValue(14),
    margin: '2.5%',
  },
  listItem: {
    backgroundColor: colors.white,
    marginVertical: '2.5%',
  },
  main: {
    height: '80%',
    margin: '2.5%',
    maxHeight: '80%',
  },
  right: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  text: {color: colors.black, fontSize: RFValue(14), fontWeight: 'normal'},
});
