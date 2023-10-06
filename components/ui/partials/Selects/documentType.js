import React, {useState} from 'react';
import SelectPicker from 'react-native-form-select-picker'; // Import the package

const Select = ({options}) => {
  const [selected, setSelected] = useState();
  return (
    <SelectPicker
      onValueChange={value => {
        // Do anything you want with the value.
        // For example, save in state.
        setSelected(value);
      }}
      selected={selected}>
      {Object.values(options).map((val, index) => (
        <SelectPicker.Item label={val} value={val} key={index} />
      ))}
    </SelectPicker>
  );
};

export default Select;
