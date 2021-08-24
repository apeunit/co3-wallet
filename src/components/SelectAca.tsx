import React, {
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { SelectInput } from 'src/components/Select';

export const SelectAca = (props: any) => {
  const { t } = useTranslation();
  const {
    value,
    onChangeValue,
    error,
    data,
    className
  } = props;

  const [acaValue, setAcaValue] = useState([])

  useEffect(() => {
    const _data = data.map((e: any) => {
      return {
        title: e.properties.name,
        key: {id: e.id, name: e.properties.name, geolocation: {long: e.center_lon, lang: e.center_lat}},
      }
    })
    setAcaValue(_data)
  }, [data]);

  return (
    <SelectInput
      value={value}
      // TODO: e is a complex object of the entire ACA response,
      // - what data should be written? id or geolocation... ?
      // - not sure what is the propery to write this data to, `aca`?
      onChangeValue={(e: any) => {
          console.log('aca2', e);
          onChangeValue(e)
        }
      }
      // onChangeValue={onChangeValue}
      label=""
      className={className}
      placeholder={t('common.aca_to_attach')}
      msg={t('common.aca_to_attach_message')}
      error={error}
      data={acaValue}
    />
  );
};
