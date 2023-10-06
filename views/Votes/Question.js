/* eslint-disable react-native/no-unused-styles */
/* eslint-disable react-native/no-color-literals */
import {Platform, StyleSheet, View} from 'react-native';
import React from 'react';
import {RadioButton, Text} from 'react-native-paper';
import PropTypes from 'prop-types';
import {useState} from 'react';
import {configFonts, theme} from '../../styles/global';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../styles/colors';

const Question = ({item, toggleChange}) => {
  const [value, setValue] = useState('');
  return (
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text
          underlineColor={theme.colors.primary}
          theme={theme}
          style={styles.title}>
          ¿{item?.description}?
        </Text>
      </View>

      <RadioButton.Group
        onValueChange={newValue => {
          setValue(newValue);
          toggleChange(newValue, item.id);
        }}
        style={styles.radioGroup}
        value={value}>
        {item?.answers_question.map((answer, index) => {
          return (
            <View key={index} style={styles.mainbox}>
              <RadioButton.Item
                value={answer?.answer}
                mode="android"
                uncheckedColor={colors.white}
                color={colors.white}
                theme={theme}
                label={answer?.answer}
                style={{borderRadius: 20}}
                labelStyle={{color: colors.white}}
              />
            </View>
          );
        })}
      </RadioButton.Group>
    </View>
  );
};

export default Question;

Question.propTypes = {
  item: PropTypes.object.isRequired,
  toggleChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 5,
    elevation: 5,
    justifyContent: 'center',
    margin: 10,
    shadowOffset: {
      height: 0,
      width: 0,
    },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  heading: {
    alignItems: 'center',
    backgroundColor: theme.colors.primary,
    color: 'white',
    flex: 1,
  },
  mainbox: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 10,
    textAlign: 'center',
  },
  radio: {
    color: theme.colors.primary,
  },
  title: {
    color: 'white',
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(20),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    margin: 10,
  },
});
