import {Platform, StyleSheet} from 'react-native';
import {DefaultTheme, configureFonts} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from './colors';

//COVI FONTS
export const configFonts = {
  ios: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ios: 'bold', android: undefined}),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },

  android: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ios: 'bold', android: undefined}),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },
  default: {
    regular: {
      fontFamily: 'Montserrat-Regular',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'Montserrat-Bold',
      fontWeight: Platform.select({ios: 'bold', android: undefined}),
    },
    light: {
      fontFamily: 'Montserrat-Light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'Montserrat-Thin',
      fontWeight: 'normal',
    },
  },
};

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    text: colors.black,
    menu: colors.white,
  },
  fonts: configureFonts(configFonts),
};

const globalStyles = StyleSheet.create({
  colorText: {
    color: colors.black,
  },
  container: {
    flex: 1,
    marginHorizontal: '2.5%',
    marginTop: 20,
  },
  containerItem: {
    alignItems: 'center',
    flexDirection: 'row',
    margin: '2.5%',
  },
  emptyItems: {
    color: colors.secondary,
    //fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(30),
    //fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  emptyItemsWhite: {
    color: colors.white,
    //fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(30),
    //fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  fab: {
    backgroundColor: colors.primary,
    bottom: 20,
    margin: 20,
    position: 'absolute',
    right: 0,
  },
  itemText: {
    color: colors.white,
    fontSize: RFValue(10),
    marginLeft: '2.5%',
    textAlign: 'left',
  },
  listItem: {
    alignSelf: 'center',
    backgroundColor: colors.white,
    borderRadius: 5,
    flex: 1,
    flexDirection: 'row',
    margin: 10,
    padding: 10,
    width: '100%',
  },
  loading: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  rowDirection: {
    flexDirection: 'row',
    padding: '2.5%',
  },
  rowOptions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: '2.5%',
  },
  text: {
    fontFamily: 'century-gothic',
  },
  title: {
    fontSize: RFValue(16),
    marginVertical: '2.5%',
    textAlign: 'center',
  },
  view: {
    alignItems: 'center',
    backgroundColor: colors.primary,
    borderRadius: 20,
    elevation: 10,
    height: '80%',
    justifyContent: 'center',
    padding: 2,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});

export default globalStyles;
