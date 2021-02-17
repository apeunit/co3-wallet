import React, { useEffect, useState } from 'react';
import { Flex } from 'rebass';
import CreateInputStep from '../../StepsComponents/CreateInputStep';
import { SelectInput } from '../../Select';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { TOKEN_PURPOSE } from 'src/config';

interface IProps {
  crowdsale: any;
  error: string;
  _handleKeyDown(event: any): void;
  handleChangeCrowdsale(event: any, key: string): void;
}

const PriceTokenStep: React.FC<IProps> = ({
  crowdsale,
  error,
  _handleKeyDown,
  handleChangeCrowdsale,
}) => {
  const { t } = useTranslation();
  const [tokenListOption, setTokenListOption]: any = useState([]);
  const { tokenList } = useSelector(({ chain }: any) => {
    return {
      tokenList: chain.tokenList,
    };
  });

  useEffect(() => {
    if (tokenList) {
      if (tokenList.length > 0) {
        tokenList.map((token: any) => {
          return (token.decimals > 0 || token.purpose === TOKEN_PURPOSE) && !tokenListOption.find((tk: any) => tk.key === token.contractAddress)
            ? tokenListOption.push({ key: token.contractAddress, title: token.name })
            : tokenListOption;
        });
      }
      setTokenListOption(tokenListOption);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenList]);

  return (
    <Flex flexDirection="column" width="100%">
      <CreateInputStep
        type="number"
        value={crowdsale.giveRatio}
        onChangeValue={(e: any) => handleChangeCrowdsale(e, 'giveRatio')}
        label=""
        placeholder={t('new_crowdsale.give_ratio')}
        maxLength=""
        msg={t('new_crowdsale.give_ratio_msg')}
        error={error}
        autoFocus={true}
        className="crowdsale-giveRatio"
        handleKeyChange={_handleKeyDown}
      />
      <SelectInput
        type="number"
        value={crowdsale.token}
        onChangeValue={(e: any) => handleChangeCrowdsale(e, 'token')}
        label=""
        placeholder={t('asset_popup.token')}
        msg={t('new_crowdsale.token_choice')}
        error={error}
        className="crowdsale-token"
        data={tokenListOption}
      />
    </Flex>
  );
};

export default PriceTokenStep;
