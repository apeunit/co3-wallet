import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Flex, Text } from 'rebass';
import { Label } from '@rebass/forms';
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export const SelectInput = (props: any) => {
  const classes = useStyles();
  const { value, onChangeValue, label, placeholder, msg, data, className } = props;

  return (
    <Flex flexDirection="column" style={{ width: '100%' }}>
      <Label fontSize={1} htmlFor="email">
        {label}
      </Label>
      <FormControl className={classes.formControl}>
        <InputLabel id="demo-simple-select-label">{placeholder}</InputLabel>
        <Select
          className={className}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          data-cy="select"
          value={data.length === 0 ? '' : value}
          onChange={(e: any) => onChangeValue(e.target.value)}
        >
          <MenuItem value="">
            <em>Select option</em>
          </MenuItem>
          {data.map((val: any) => (
            <MenuItem value={val.key} key={val.title}>
              {val.title}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Flex justifyContent="space-between" paddingY={2}>
        <Text fontSize={1} color="#ccc">
          {msg === 'focusFalse' ? '' : msg}
        </Text>
      </Flex>
    </Flex>
  );
};
