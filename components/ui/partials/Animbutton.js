import React, {Component, useState, useRef} from 'react';
import {TouchableWithoutFeedback, StyleSheet, Platform} from 'react-native';
import * as Animatable from 'react-native-animatable';
import {Text} from 'react-native-paper';
import {RFValue} from 'react-native-responsive-fontsize';
import colors from '../../../styles/colors';
import {configFonts, theme} from '../../../styles/global';
export default function Animbutton(props) {
  const {_onPress, effect, onColor, text, state, hours = true} = props;
  //state
  const [status, setStatus] = useState(false);

  //ref
  const refView = useRef(null);

  const onPress = () => {
    setStatus(!status);
    _onPress(!status);
    //this.props._onPress(!this.state.status)
    // this.setState({ status: !this.state.status})
    switch (effect) {
      case 'bounce':
        refView.current.bounce(800);
        break;
      case 'flash':
        refView.current.flash(800);
        break;
      case 'jello':
        refView.current.jello(800);
        break;
      case 'pulse':
        refView.current.pulse(800);
        break;
      case 'rotate':
        refView.current.rotate(800);
        break;
      case 'rubberBand':
        refView.current.rubberBand(800);
        break;
      case 'shake':
        refView.current.shake(800);
        break;
      case 'swing':
        refView.current.swing(800);
        break;
      case 'tada':
        refView.current.tada(800);
        break;
      case 'wobble':
        refView.current.view.wobble(800);
        break;
    }
  };

  if (!hours) {
    return (
      <TouchableWithoutFeedback
        style={{marginHorizontal: '1.25%'}}
        onPress={() => onPress()}>
        <Animatable.View
          ref={refView}
          style={{
            backgroundColor: '#e8e8e8',
            borderRadius: 25,
            justifyContent: 'center',
            margin: 1,
            padding: 7,
            height: RFValue(50),
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: RFValue(12),
              fontFamily: configFonts.default.medium.fontFamily,
              fontWeight: Platform.select({ios: 'bold', android: undefined}),
              textAlign: 'center',
            }}>
            {text}
          </Text>
        </Animatable.View>
      </TouchableWithoutFeedback>
    );
  }

  return (
    <TouchableWithoutFeedback
      style={{marginHorizontal: '1.25%'}}
      onPress={() => onPress()}>
      {state != undefined ? (
        <Animatable.View
          ref={refView}
          style={{
            backgroundColor: status ? onColor : '#e8e8e8',
            borderRadius: 25,
            height: RFValue(50),
            justifyContent: 'center',
            margin: 1,
            padding: 7,
            alignItems: 'center',
          }}>
          <Text
            style={{
              color: colors.black,
              fontSize: RFValue(12),
              fontFamily: configFonts.default.medium.fontFamily,
              fontWeight: Platform.select({ios: 'bold', android: undefined}),
              textAlign: 'center',
            }}>
            {text}
          </Text>
        </Animatable.View>
      ) : (
        <Animatable.View ref={refView} style={styles.viewButton}>
          <Text theme={theme} style={styles.textView}>
            {text}
          </Text>
        </Animatable.View>
      )}
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  textView: {
    color: colors.white,
    fontFamily: configFonts.default.medium.fontFamily,
    fontSize: RFValue(16),
    fontWeight: Platform.select({ios: 'bold', android: undefined}),
    textAlign: 'center',
  },
  viewButton: {
    alignItems: 'center',
    backgroundColor: colors.warning,
    borderRadius: 25,
    height: RFValue(50),
    justifyContent: 'center',
    margin: 1,
    padding: 7,
  },
});
