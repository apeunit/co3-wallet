import React, { useState } from 'react';
import { Flex, Text } from 'rebass';
import { Label } from '@rebass/forms';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { KeyboardDatePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import ErrorMsg from './ErrorMsg';

const DateInput = (props: any) => {
  const { id, value, onChangeValue, label, msg, error, minDate, maxDate } = props;
  const [err, setErr] = useState(false);

  const handleFocus = () => {
    setErr(false);
  };

  return (
    <Flex flexDirection="column" width="100%" sx={{ color: err ? 'red' : 'blue600' }}>
      {label && (
        <Label fontSize={1} htmlFor="email">
          {label}
        </Label>
      )}
      <Flex backgroundColor="#F0F0F0">
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Grid container={true} justify="space-around">
            <KeyboardDatePicker
              margin="normal"
              id={id}
              InputAdornmentProps={{ position: 'start' }}
              format="MM/dd/yyyy"
              value={value}
              minDate={minDate}
              maxDate={maxDate}
              onFocus={handleFocus}
              onChange={onChangeValue}
              KeyboardButtonProps={{
                'aria-label': 'change date',
              }}
            />
          </Grid>
        </MuiPickersUtilsProvider>
      </Flex>
      <Flex justifyContent="space-between" paddingY={2}>
        <Text fontSize={1} color="#a2a2a2">
          {msg === 'focusFalse' ? '' : msg}
        </Text>
      </Flex>
      {error && <ErrorMsg style={{ top: '47vh' }} title={error} type="error" />}
    </Flex>
  );
};

export default DateInput;
