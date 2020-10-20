import React, { useEffect } from 'react';
import { Flex, Text } from 'rebass';
import PlacesAutocomplete from 'react-places-autocomplete';
import IconButton from '../../IconButton';
import { useTranslation } from 'react-i18next';
import ErrorMsg from 'src/components/ErrorMsg';

const LocationInput = (props: any) => {
  const { value, onChangeValue, error } = props;
  const { t } = useTranslation();
  const divRef = React.useRef<HTMLDivElement>(null);

  const handleChange = (address: any) => {
    onChangeValue(address);
  };

  useEffect(() => {
    if (error && divRef.current) {
      divRef.current.focus();
    }
  }, [error]);

  return (
    <Flex flexDirection="column" width="100%">
      <PlacesAutocomplete value={value} onChange={handleChange}>
        {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
          <div className="autocomplete-root">
            <div className="autocomplete-root-input">
              <Flex width="30px" marginLeft="-5px">
                <IconButton icon="locationOn" />
              </Flex>
              <input
                ref={divRef as any}
                autoFocus={true}
                placeholder="Location"
                {...getInputProps()}
              />
              <Flex width="30px" marginRight="-5px">
                <IconButton icon="myLocation" />
              </Flex>
            </div>
            <Text marginLeft="3px" marginTop="5px" fontSize="12px" color="#a2a2a2">
              {t('new_crowdsale.campaign_location')}
            </Text>
            <div className="autocomplete-dropdown-container">
              {loading && <div>{t('new_crowdsale.location')}</div>}
              {suggestions.map((suggestion) => (
                <div {...getSuggestionItemProps(suggestion)}>
                  <span>{suggestion.description}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </PlacesAutocomplete>
      {error && <ErrorMsg style={{ bottom: '6vh', top: 'unset' }} title={error} type="error" />}
    </Flex>
  );
};

export default LocationInput;
