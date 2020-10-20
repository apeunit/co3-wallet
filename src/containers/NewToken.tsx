import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text } from 'rebass';
import RadioButtonGroup from '../components/RadioButtonGroup';
import AddImage from '../components/AddImage';
import { useHistory } from 'react-router-dom';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import TextArea from '../components/TextArea';
import CreateBuyStep from '../components/StepsComponents/CreateBuyStep';
import CreateFooterStep from '../components/StepsComponents/CreateFooterStep';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import CreateDetailStep from '../components/StepsComponents/CreateDetailStep';
import { contractsRadio, createTokenSteps, tokensRadio } from './commonData';
import ErrorMsg from '../components/ErrorMsg';
import _get from 'lodash/get';
import { motion } from 'framer-motion';
import FramerSlide from '../components/FrameMotion/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { getPermalink, saveResource } from '../api/firstlife';
import { setModalData } from '../redux/actions/Modal';
import { createNewToken } from '../redux/actions/Chain';
import { useLazyQuery } from '@apollo/react-hooks';
import { BALANCE_NOTIFY_QUERY } from './query';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';

const NewToken: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState<string>(t('new_token.label'));
  const [contractLabel, changeContractLabel] = useState('');
  const [loader, setLoader] = useState(false);

  const [token, onchangeToken] = useState({
    name: '',
    symbol: '',
    icon: '',
    description: '',
    contractType: 'Standard Contract',
    contract: '',
    contractLabel: '',
    tokenType: 'Mintable Token',
    totalSupply: '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [tokenList, setTokenList] = useState([]);

  const { ethAddress, web3, tokenFactory, accessToken } = useSelector(
    ({ chain, wallet, co3uum }: any) => {
      return {
        web3: chain.web3,
        tokenFactory: chain.contracts && chain.contracts.tokenFactory,
        ethAddress: wallet.ethAddress,
        accessToken: co3uum.accessToken,
      };
    },
  );

  const [balanceTokenQuery, { data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
    }
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data) {
      setTokenList(data.balanceNotificationMany);
    }
  }, [data]);

  const checkError = (_step: number, value: string, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} ${t('common.is_required')}`);

      return true;
    }
    if (_step === 3 && token.symbol) {
      if (
        tokenList.find(
          (_token: any) => token.symbol.toLowerCase() === _token.token_symbol.toLowerCase(),
        )
      ) {
        setError(t('new_token.symbol_already'));

        return true;
      }
    }
  };

  const tokenData = _get(history, 'location.state.token', undefined);

  useEffect(() => {
    if (tokenData) {
      setStep(9);
      onchangeToken(tokenData);
    }
  }, [tokenData]);

  const handleSteps = () => {
    if (step <= 8) {
      if (
        checkError(1, token.name, t('common.name')) ||
        checkError(2, token.symbol, t('common.symbol')) ||
        checkError(3, token.icon, t('common.icon')) ||
        checkError(5, token.contractType, '') ||
        (token.contractType === 'Custom Contract' &&
          checkError(5, token.contract, t('common.contract'))) ||
        checkError(6, token.tokenType, '') ||
        checkError(7, token.totalSupply, t('new_token.total_supply'))
      ) {
        setLoader(false);

        return;
      }
      step <= 7 && title.indexOf(t('common.edit')) > -1
        ? setStep(8)
        : step === 6 && token.tokenType === 'Mintable Token'
        ? setStep(step + 2)
        : setStep(step + 1);
    }
  };

  const handlebackStep = () => {
    setError('');
    step === 8 && token.tokenType === 'Mintable Token'
      ? setStep(step - 2)
      : step > 1
      ? setStep(step - 1)
      : history.push('/');
  };

  const handleClose = () => {
    step === 9
      ? history.push({ pathname: '/', state: { pendingToken: [token] } })
      : history.push('/');
  };

  const handleFocus = () => {
    setError('');
  };

  const handleChangeIcon = async (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      if (!accessToken || accessToken === null) {
        setUploading(false);
        setError(t('common.access_token_error'));

        return;
      }
      const res = saveResource(accessToken, e.target.files[0]);
      res
        .then(({ data }: any) => {
          setUploading(false);
          const link = getPermalink(data);
          link ? onchangeToken({ ...token, icon: link }) : console.log(data);
        })
        .catch((err: any) => {
          setUploading(false);
          setError(t('common.invalid_token'));
        });
    } else {
      setUploading(false);
    }
  };

  const handleChangeToken = (e: any, key: string) => {
    onchangeToken({ ...token, [key]: e });
    setError('');
  };

  const onChange = (e: any, key: string) => {
    if (e.target.value === 'Standard Contract') {
      setError('');
      onchangeToken({ ...token, contract: '', contractLabel: '' });
    } else if (e.target.value === 'Mintable Token') {
      onchangeToken({ ...token, totalSupply: '' });
    }
    onchangeToken({ ...token, [key]: e.target.value });
  };

  const onChangeContract = (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      changeContractLabel(e.target.files[0].name);
      onchangeToken({ ...token, contractLabel: e.target.files[0].name });
      if (!accessToken || accessToken === null) {
        setUploading(false);
        setError(t('common.access_token_error'));

        return;
      }
      const res = saveResource(accessToken, e.target.files[0]);
      res
        .then(({ data }: any) => {
          setUploading(false);
          const link = getPermalink(data);
          link ? onchangeToken({ ...token, contract: link }) : console.log(data);
        })
        .catch((err: any) => {
          console.log(err, "err")
          setUploading(false);
          setError(t('common.invalid_token'));
        });
    } else {
      setUploading(false);
    }
  };

  const handleEdit = (stepName: string) => {
    setTitle(`${t('common.edit')} ${stepName}`);
    const stepData = createTokenSteps.find((_step: any) => stepName === t(`${_step.title}`));
    if (stepData) {
      setStep(stepData.stepId);
    }
  };

  const _handleKeyDown = (e: any) => {
    e.preventDefault();
    if (e.key === 'Enter') {
      handleSteps();
    }
  };

  const handleCreateToken = async () => {
    setLoader(true);
    const receipt: any = dispatch(
      createNewToken(
        tokenFactory,
        token.name,
        token.symbol,
        token.icon,
        web3.utils.keccak256(token.icon),
        web3.utils.keccak256(token.icon),
        2,
        web3.utils.toHex(parseInt(token.totalSupply, 10) || 0),
      ),
    );
    receipt
      .then((res: any) => {
        setLoader(false);
        history.push('/');
        dispatch(
          setModalData(
            true,
            t('new_token.token_created'),
            t('common.transaction_complete'),
            'permission',
          ),
        );
      })
      .catch((err: any) => {
        setLoader(false);
        console.log(err, 'NewToken', loader);
        dispatch(
          setModalData(
            true,
            t('new_token.token_creation_failed'),
            err.message.split('\n')[0],
            'permission',
          ),
        );
      });
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
      style={{ overflow: 'hidden' }}
    >
      <Loading loader={loader} />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton onClick={handlebackStep} sx={{ cursor: 'pointer' }} icon="back" />
        <Text>{title}</Text>
        <IconButton onClick={handleClose} sx={{ cursor: 'pointer' }} icon="close" />
      </Flex>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        style={{ flex: 1, position: 'absolute', top: '0', width: '100%', height: '100%' }}
      >
        <Flex
          paddingX={6}
          height="100%"
          justifyContent="center"
          style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}
        >
          {step === 1 && (
            <CreateInputStep
              type="text"
              value={token.name}
              onChangeValue={(e: any) => handleChangeToken(e, 'name')}
              label={t('common.name')}
              placeholder={t('new_token.name_placeholder')}
              maxLength="20"
              msg=""
              className="token-name-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 2 && (
            <CreateInputStep
              type="text"
              value={token.symbol}
              onChangeValue={(e: any) => handleChangeToken(e, 'symbol')}
              label={t('common.symbol')}
              placeholder={t('new_token.symbol_placeholder')}
              maxLength="4"
              msg={t('new_token.symbol_msg')}
              className="token-symbol-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 3 && (
            <FramerSlide>
              <Flex
                flexDirection="column"
                width="100%"
                justifyContent="space-between"
                style={{ paddingBottom: '100px', marginTop: '50px' }}
              >
                <TokenCard
                  name={token.name}
                  symbol={token.symbol}
                  icon={token.icon}
                  onChange={handleChangeIcon}
                  uploading={uploading}
                  type="add"
                />
                {error && (
                  <ErrorMsg
                    style={{ transform: 'translateX(-50%)', bottom: '40px', top: 'auto' }}
                    title={error}
                    type="error"
                  />
                )}
              </Flex>
            </FramerSlide>
          )}
          {step === 4 && (
            <FramerSlide>
              <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-20px)' }}>
                <TextArea
                  value={token.description}
                  onChangeValue={(e: any) => handleChangeToken(e, 'description')}
                  onFocus={handleFocus}
                  className="token-description-input"
                  label={t('common.short_description')}
                  placeholder={t('new_token.description_placeholder')}
                  maxLength="500"
                  error={error}
                />
                {error && (
                  <ErrorMsg
                    style={{ top: '75vh', transform: 'translate(-50%, 93px)' }}
                    title={error}
                    type="error"
                  />
                )}
              </Flex>
            </FramerSlide>
          )}
          {step === 5 && (
            <FramerSlide>
              <Flex flexDirection="column" style={{ transform: 'translateY(-10px)' }}>
                <RadioButtonGroup
                  value={token.contractType}
                  onChange={(e: any) => onChange(e, 'contractType')}
                  radios={contractsRadio}
                />
                {token.contractType === 'Custom Contract' && (
                  <Flex flexDirection="column" height="100%" justifyContent="space-between">
                    <AddImage
                      label={contractLabel ? contractLabel : t('common.upload_contract')}
                      accept="application/pdf"
                      icon={contractLabel ? 'clouddone' : 'cloud'}
                      onChange={onChangeContract}
                      uploading={uploading}
                      placeholder={''}
                      padding={6}
                      marginLeft={20}
                    />
                    {error && (
                      <div>
                        <ErrorMsg title={error} type="error" style={{ top: '54.6vh' }} />
                      </div>
                    )}
                  </Flex>
                )}
              </Flex>
            </FramerSlide>
          )}
          {step === 6 && (
            <FramerSlide>
              <Flex flexDirection="column" style={{ transform: 'translateY(-10px)' }}>
                <RadioButtonGroup
                  value={token.tokenType}
                  onChange={(e: any) => onChange(e, 'tokenType')}
                  radios={tokensRadio}
                />
              </Flex>
            </FramerSlide>
          )}
          {step === 7 && (
            <CreateInputStep
              type="number"
              value={token.totalSupply}
              onChangeValue={(e: any) => handleChangeToken(e, 'totalSupply')}
              label={t('new_token.total_supply')}
              placeholder={t('new_token.total_supply_placeholder')}
              maxLength=""
              msg=""
              className="token-totalsupply-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 8 && <CreateBuyStep data={token} />}
          {step === 9 && <CreateDetailStep handleEdit={handleEdit} data={token} />}
          {!uploading && error === '' && step !== 9 && (
            <CreateFooterStep
              lastStep={step === 8}
              handleSteps={handleSteps}
              onbtnDrag={handleCreateToken}
            />
          )}
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default NewToken;
