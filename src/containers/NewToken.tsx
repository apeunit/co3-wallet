import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text } from 'rebass';
import RadioButtonGroup from '../components/RadioButtonGroup';
import AddImage from '../components/AddImage';
import { useHistory } from 'react-router-dom';
import TokenCard from '../components/TokenCard';
import TextArea from '../components/TextArea';
import CreateTokenBuyStep from '../components/CreateTokens/CreateTokenBuyStep';
import CreateTokenFooter from '../components/CreateTokens/CreateTokenFooter';
import CreateTokenInput from '../components/CreateTokens/CreateTokenInput';
import CreateTokenDetail from '../components/CreateTokens/CreateTokenDetail';
import { contractsRadio, createTokenSteps, tokensRadio } from './TokenRadioText';
import ErrorMsg from '../components/ErrorMsg';
import _get from 'lodash/get';
import { motion } from 'framer-motion';
import FramerSlide from '../components/FrameMotion/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { uploadImage } from '../utils/uploadImage';
import { setModalData } from '../redux/actions/Modal';
import { createNewToken } from '../redux/actions/Chain';
// tslint:disable-next-line: no-require-imports
const EthereumTx = require('ethereumjs-tx');

const tokenFactoryAddress: string =
  localStorage.getItem('tokenFactoryAddress') || process.env.REACT_APP_TOKEN_FACTORY || '';

const NewToken: React.FC = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState('New Token');
  const [contractLabel, changeContractLabel] = useState('');

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

  const { web3, tokenFactory, tokenList } = useSelector(({ chain }: any) => {
    return {
      web3: chain.web3,
      tokenFactory: chain.contracts.tokenFactory,
      tokenList: chain.tokenList,
    };
  });

  const checkError = (_step: number, value: string, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} is required`);

      return true;
    }
    if (_step === 3 && token.symbol) {
      if (tokenList.find((data: any) => token.symbol.toLowerCase() === data.symbol.toLowerCase())) {
        setError(`This symbol is already taken`);

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
        checkError(1, token.name, 'Name') ||
        checkError(2, token.symbol, 'Symbol') ||
        checkError(3, token.icon, 'Icon') ||
        checkError(5, token.contractType, '') ||
        checkError(6, token.tokenType, '') ||
        (token.contractType === 'Custom Contract' && checkError(5, token.contract, 'Contract')) ||
        checkError(7, token.totalSupply, 'Total Supply')
      ) {
        return;
      }
      step <= 7 && title.indexOf('Edit') > -1
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
      const res = uploadImage(e.target.files[0]);
      res
        .then(({ data }: any) => {
          setUploading(false);
          data && data.link ? onchangeToken({ ...token, icon: data.link }) : console.log(data.link);
        })
        .catch(console.log);
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
      onchangeToken({
        ...token,
        contract: URL.createObjectURL(e.target.files[0]),
        contractLabel: e.target.files[0].name,
      });
    }
    setTimeout(() => {
      setUploading(false);
    }, 1000);
  };

  const handleEdit = (stepName: string) => {
    setTitle(`Edit ${stepName}`);
    const stepData = createTokenSteps.find((_step: any) => stepName === _step.title);
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
    const receipt: any = dispatch(
      createNewToken(
        tokenFactory,
        token.name,
        token.symbol,
        token.icon,
        web3.utils.keccak256(token.icon),
        web3.utils.keccak256(token.icon),
        0,
        web3.utils.toHex(parseInt(token.totalSupply, 10) * 100 || 0),
      ),
    );
    receipt
      .then((res: any) => {
        history.push('/');
        dispatch(setModalData('Token Created', 'Transaction Complete', 'permission'));
      })
      .catch(console.log);
  };

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      width="100%"
      height="100%"
      style={{ overflow: 'hidden' }}
    >
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
            <CreateTokenInput
              type="text"
              value={token.name}
              onChangeValue={(e: any) => handleChangeToken(e, 'name')}
              label="Name"
              placeholder="Enter token name"
              maxLength="20"
              msg=""
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 2 && (
            <CreateTokenInput
              type="text"
              value={token.symbol}
              onChangeValue={(e: any) => handleChangeToken(e, 'symbol')}
              label="Symbol"
              placeholder="Enter token symbol"
              maxLength="4"
              msg="Symbol is a short identifier eg. ETH"
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
                  label="Short description"
                  placeholder="Enter short description"
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
                      label={contractLabel ? contractLabel : 'Upload contract'}
                      accept="application/pdf"
                      icon={contractLabel ? 'clouddone' : 'cloud'}
                      onChange={onChangeContract}
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
            <CreateTokenInput
              type="number"
              value={token.totalSupply}
              onChangeValue={(e: any) => handleChangeToken(e, 'totalSupply')}
              label="Total Supply"
              placeholder="Enter total supply"
              maxLength=""
              msg=""
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 8 && <CreateTokenBuyStep data={token} />}
          {step === 9 && <CreateTokenDetail handleEdit={handleEdit} data={token} />}
          {!uploading && error === '' && step !== 9 && (
            <CreateTokenFooter
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
