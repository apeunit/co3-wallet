import React, { useEffect, useState } from 'react';
import { Flex, Text, Image } from 'rebass';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Setting.css';
import IconButton from 'src/components/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import PhraseBox from 'src/components/RecoveryPhrase/PhraseBox';
import _sampleSize from 'lodash/sampleSize';
import _random from 'lodash/random';
import ErrorMsg from 'src/components/ErrorMsg';
import { useDispatch, useSelector } from 'react-redux';
import { savePublicKeyAPI } from 'src/api/co3uum';
import { mnemonicToSeed } from 'bip39';
import { initWallet, setPublicKey, setMnemonic, generateMnemonicPhrase } from 'src/redux/actions/Wallet';
import { publicToAddress, toChecksumAddress } from 'ethereumjs-util';
import { setModalData } from '../redux/actions/Modal';
import Loading from '../components/Loading';
import { MNEMONIC_PHRASE } from 'src/config';
import { backupImages } from '../images/illustrations';

const hdkey = require('ethereumjs-wallet/hdkey');

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  colorPrimary: {
    backgroundColor: '#F0F0F0',
  },
  barColorPrimary: {
    backgroundColor: '#3752F5',
  },
  barColorSecondary: {
    backgroundColor: '#DD303D',
  },
});

const NewWallet = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const classes = useStyles();
  const dispatch = useDispatch();
  const mnemonicPhrase: any = MNEMONIC_PHRASE;

  const [loader, setLoader] = useState(false);
  const [progress, setProgress] = useState(10);
  const [step, setStep] = useState(1);
  const [boxHeight, setBoxHeight] = useState('48vh');
  const [randomNo, setRandomNo] = useState(0);
  const [randomPhrase, setRandomPhrase] = useState(new Array<string>());
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');
  const { accessToken } = useSelector(({ co3uum }: any) => {
    return {
      accessToken: co3uum.accessToken,
    };
  });

  useEffect(() => {
    if (!mnemonicPhrase) {
      dispatch(generateMnemonicPhrase());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const errorModalMsg = (title: string) => (
    <Flex width="max-content" margin="auto" className="error-modal">
      <IconButton height="26px" width="26px" icon="errorOutline" />
      <Text className="error-message">{title}</Text>
    </Flex>
  );

  const displayModal = (msg: any) => {
    dispatch(setModalData(true, msg, '', 'permission'));
  };

  const handlePublicKey = async () => {
    setLoader(true);
    await mnemonicToSeed(mnemonicPhrase).then(async (seed: any) => {
      const hdkeyInstance = hdkey.fromMasterSeed(seed);
      const node = hdkeyInstance.derivePath("m/44'/60'/0'/0'/0");
      const child = node.deriveChild(0);
      const wallet = child.getWallet();
      const publicKey = toChecksumAddress(
        publicToAddress(wallet.getPublicKeyString()).toString('hex'),
      );
      dispatch(setPublicKey(publicKey));
      try {
        if (accessToken) {
          const saveData: any = await savePublicKeyAPI(accessToken, publicKey);
          if (saveData && saveData.status === 'ok') {
            localStorage.setItem('co3-app-mnemonic', mnemonicPhrase);
            dispatch(setMnemonic(mnemonicPhrase));
            setLoader(false);
            localStorage.setItem('co3-app-backup', 'true');
            dispatch(initWallet(mnemonicPhrase));
            history.push('/');
            displayModal(t('recovery_phrase.new_wallet_success'));
          } else {
            setLoader(false);
            history.push('/settings');
            displayModal(errorModalMsg(t('recovery_phrase.new_wallet_error')));
          }
        } else {
          localStorage.setItem('co3-app-mnemonic', mnemonicPhrase);
          localStorage.setItem('co3-app-backup', 'true');
          setLoader(false);
          dispatch(initWallet(mnemonicPhrase));
          history.push('/');
          displayModal(t('recovery_phrase.new_wallet_success'));
        }
      } catch (e) {
        setLoader(false);
        history.push('/settings');
        displayModal(errorModalMsg(t('recovery_phrase.new_wallet_error')));
      }
    });
  };

  const handleSteps = () => {
    setError('');
    if (step <= 9) {
      setProgress((step + 1) * 10);
      setStep(step + 1);
    }
    step === 10 && handlePublicKey();
  };

  const handlebackStep = () => {
    if (error) {
      setError('');
      setSelected('');
    } else {
      setProgress(progress - 10);
      step > 1 ? setStep(step - 1) : history.push('/settings');
    }
  };

  const getRandomPhrase = () => {
    const arr = [
      ..._sampleSize(mnemonicPhrase.split(' ').slice(0, 6), 2),
      ..._sampleSize(mnemonicPhrase.split(' ').slice(7, 11), 2),
    ];

    const hidden = arr.find((e) => e === mnemonicPhrase.split(' ')[randomNo]);
    if (!hidden) {
      arr[3] = mnemonicPhrase.split(' ')[randomNo];
    }
    setRandomPhrase(arr);
  };

  useEffect(() => {
    if (step === 8) {
      setRandomNo(_random(0, 5));
    }
    if (step === 9) {
      setRandomNo(_random(6, 11));
    }
    const boxSteps = [5, 6, 8, 9];
    boxSteps.find((e) => e === step)
      ? setBoxHeight('')
      : step === 4
        ? setBoxHeight('35vh')
        : setBoxHeight('48vh');
  }, [step]);

  useEffect(() => {
    if (step === 8 || step === 9) {
      randomNo && getRandomPhrase();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, randomNo]);

  const _renderPhrase = (val: number) => {
    let arr = mnemonicPhrase.split(' ');
    arr = [...arr.slice(0, randomNo), '', ...arr.slice(randomNo + 1)];

    return arr.splice(val - 1, val + 5).map((text: string, index: number) => {
      return (
        <PhraseBox
          key={index}
          id={index + val}
          text={text ? text : selected}
          type={error && text === '' ? 'error' : 'default'}
        />
      );
    });
  };

  const handleSelectPhrase = (text: string) => {
    setSelected(text);
    if (mnemonicPhrase.split(' ')[randomNo] === text) {
      setError('');
      setSelected('');
      handleSteps();
    } else {
      setError(t('recovery_phrase.phrase_error'));
    }
  };

  return (
    <Flex
      flexDirection="column"
      height="100vh"
      paddingBottom={3}
      justifyContent="flex-start"
      className="recovery-phrase"
    >
      <Loading loader={loader} />
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton onClick={handlebackStep} sx={{ cursor: 'pointer' }} icon="back" />
        <Text style={{ fontWeight: 600, lineHeight: '22px', marginLeft: '-45px' }} fontSize="18px">
          {t('recovery_phrase.label')}
        </Text>
        <div />
      </Flex>
      <Flex flexDirection="column" height="91vh" paddingX={6} >
        <div className={classes.root}>
          <LinearProgress
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: `${!error ? classes.barColorPrimary : classes.barColorSecondary}`,
            }}
            variant="determinate"
            value={progress}
            data-step={step}
          />
        </div>
        {boxHeight ? (
          <Flex height="85%" flexDirection="column">
            <Flex
              margin="15px auto 30px"
              width="332px"
              height={boxHeight}
            >
              {backupImages[step] && (
                <Image
                  src={backupImages[step]}
                  width="100%"
                />
              )}
            </Flex>
            <Flex marginTop="auto">
              <Text width="100%" textAlign="center">
                <div dangerouslySetInnerHTML={{ __html: t(`recovery_phrase.new_wallet_s${step}`) }}
                />
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Flex
            marginTop={error ? '110px' : 'auto'}
            flexDirection="column"
            justifyContent="space-between"
          >
            <Flex marginLeft="25px" justifyContent="start">
              {step === 5 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {mnemonicPhrase
                    .split(' ')
                    .splice(0, 6)
                    .map((text: string, index: number) => (
                      <PhraseBox key={index} id={index + 1} text={text} type={'default'} />
                    ))}
                </Flex>
              )}
              {step === 6 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {mnemonicPhrase
                    .split(' ')
                    .splice(6, 11)
                    .map((text: string, index: number) => (
                      <PhraseBox key={index} id={index + 7} text={text} type={'default'} />
                    ))}
                </Flex>
              )}
              {step === 8 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {_renderPhrase(1)}
                </Flex>
              )}
              {step === 9 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {_renderPhrase(7)}
                </Flex>
              )}
            </Flex>
            {!error && (
              <Flex marginTop="95px" fontSize="13px">
                <Text className="co3-link" width="100%" textAlign="center">
                  {t(`recovery_phrase.new_wallet_s${step}`)}
                </Text>
              </Flex>
            )}
            {!error && (step === 8 || step === 9) && (
              <Flex style={{ width: '100%', overflowX: 'scroll' }} margin="20px auto 40px">
                {randomPhrase.map((text: string, index: number) => (
                  <PhraseBox
                    onClick={() => handleSelectPhrase(text)}
                    key={index}
                    text={text}
                    type="primary"
                  />
                ))}
              </Flex>
            )}
          </Flex>
        )}
        {error && (
          <Flex className="handle-error">
            <ErrorMsg title={error} type="error" />
          </Flex>
        )}
        {!error && step !== 8 && step !== 9 && (
          <Flex
            justifyContent="center"
            backgroundColor="blue600"
            style={{
              height: '56px',
              width: '56px',
              borderRadius: '50px',
              overflow: 'hidden',
              margin: '15px auto 37px',
            }}
          >
            <IconButton
              icon="next"
              size="s14"
              color="white"
              onClick={handleSteps}
              marginBottom="-20px"
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  );
};

export default NewWallet;
