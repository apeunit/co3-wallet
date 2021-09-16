import React from 'react';
import { Flex } from 'rebass';
import InputField from '../InputField';
import ErrorMsg from '../ErrorMsg';
import FramerSlide from '../../components/FrameMotion/Slide';
import { useTranslation } from 'react-i18next';

interface IProps {
  type: string;
  value: string;
  onChangeValue: any;
  label: string;
  placeholder: string;
  maxLength: string;
  msg: string;
  error: string;
  className?: string;
  handleKeyChange?: any;
  autoFocus?: boolean;
  disabled?: boolean,
}

const CreateInputStep: React.FC<IProps> = ({
  type,
  value,
  onChangeValue,
  label,
  placeholder,
  maxLength,
  msg,
  error,
  handleKeyChange,
  className,
  autoFocus,
  disabled,
}) => {
  const { t } = useTranslation();

  return (
    <FramerSlide>
      <Flex
        width="100%"
        flexDirection="column"
        margin="0"
        justifyContent="space-between"
        style={{ transform: 'translateY(-30px)' }}
      >
        <InputField
          type={type}
          value={value}
          onChangeValue={onChangeValue}
          label={label}
          placeholder={placeholder}
          maxLength={maxLength}
          msg={msg}
          className={className}
          notification={error}
          handleKeyChange={handleKeyChange}
          autoFocus={autoFocus}
          disabled={disabled || false}
        />
        {error === t('new_token.symbol_already') ? (
          <ErrorMsg style={{ top: '47vh' }} title={error} type="warning" />
        ) : (
          error && <ErrorMsg style={{ top: '47vh' }} title={error} type="error" />
        )}
      </Flex>
    </FramerSlide>
  );
};

export default CreateInputStep;
