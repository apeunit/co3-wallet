import React, { useEffect, useRef, useState } from 'react';
import { Flex, Image, Text } from 'rebass';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../assets/styles/Setting.css';
import IconButton from 'src/components/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import PhraseBox from 'src/components/RecoveryPhrase/PhraseBox';
import ErrorMsg from 'src/components/ErrorMsg';
import _join from 'lodash/join';
import { useDispatch } from 'react-redux';
import { initWallet, setMnemonic } from 'src/redux/actions/Wallet';
import Loading from '../components/Loading';
import { setModalData } from '../redux/actions/Modal';
import { importImages } from '../images/illustrations';

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

const ImportWallet = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const history = useHistory();
  const classes = useStyles();
  const [step, setStep] = useState(1);
  const [boxHeight, setBoxHeight] = useState('48vh');
  const [phrases, setPhrases] = useState(['', '', '', '', '', '', '', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [focusId, setFocusId] = useState(0);
  const customRef: any = useRef([]);
  const [loader, setLoader] = useState(false);

  const displayModal = (msg: any) => {
    dispatch(setModalData(true, msg, '', 'permission'));
  };

  const handleImportWallet = () => {
    setLoader(true);
    dispatch(setMnemonic(_join(phrases, ' ')));
    localStorage.setItem('co3-app-mnemonic', _join(phrases, ' '));
    localStorage.setItem('co3-app-backup', 'true');
    dispatch(initWallet(_join(phrases, ' ')));
    setLoader(false);
    history.push('/');
    displayModal(t('recovery_phrase.new_wallet_success'));
  };

  const handleSteps = () => {
    if (step === 3) {
      if (phrases.find((e) => !e || e === '') === '') {
        setError(t('recovery_phrase.import_wallet_error'));

        return;
      } else {
        setStep(step + 1);
      }
    } else if (step <= 4) {
      setStep(step + 1);
      setFocusId(0);
      step === 4 && handleImportWallet();
    }
  };

  const handleKeyChange = (e: any, index: number) => {
    e.preventDefault();
    if (index <= 4) {
      setFocusId(index + 1);
      if (customRef && customRef.current[index + 1] !== null) {
        customRef.current[index + 1].focus();
      }
    }
  };

  useEffect(() => {
    customRef.current = customRef.current.slice(0, phrases.length);
  }, [phrases]);

  useEffect(() => {
    if (focusId === 0 && customRef.current[focusId]) {
      customRef.current[focusId].focus();
    }
  }, [focusId]);

  const handlebackStep = () => {
    if (error) {
      setError('');
    } else {
      step > 1 ? setStep(step - 1) : history.push('/settings');
    }
  };

  useEffect(() => {
    const boxSteps = [2, 3];
    boxSteps.find((e) => e === step)
      ? setBoxHeight('')
      : step === 4
      ? setBoxHeight('35vh')
      : setBoxHeight('48vh');
  }, [step]);

  const handleClick = (e: any, index: number) => {
    setFocusId(index);
  };

  const _renderPhrase = (firstIndex: number, lastIndex: number) => {
    return phrases
      .slice(firstIndex, lastIndex)
      .map((text: string, index: number) => (
        <PhraseBox
          key={index}
          id={index + firstIndex + 1}
          text={text}
          phrases={phrases}
          onClick={(e: any) => handleClick(e, index)}
          setPhrases={setPhrases}
          setError={setError}
          setFocusId={setFocusId}
          autoFocus={focusId === index}
          handleKeyChange={(e: any) => handleKeyChange(e, index)}
          customRef={(el: any) => (customRef.current[index] = el)}
          className={focusId === index ? 'focus-true' : 'focus-false'}
          autoComplete={'off'}
          type="input"
        />
      ));
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
          {boxHeight ? t('recovery_phrase.label') : t('recovery_phrase.import_wallet')}
        </Text>
        <div />
      </Flex>
      <Flex flexDirection="column" height="91vh" paddingX={6}>
        {boxHeight && (
          <div className={classes.root}>
            <LinearProgress
              classes={{
                colorPrimary: classes.colorPrimary,
                barColorPrimary: `${!error ? classes.barColorPrimary : classes.barColorSecondary}`,
              }}
              variant="determinate"
              value={step === 4 ? 100 : 30}
            />
          </div>
        )}
        {boxHeight ? (
          <Flex height="85%" flexDirection="column">
            <Flex margin="15px auto 30px" width="332px" height={boxHeight}>
              {importImages[step] && (
                <Image src={importImages[step]} width="100%" data-step={step} />
              )}
            </Flex>
            <Flex marginTop="auto">
              <Text width="100%" textAlign="center">
                <div
                  dangerouslySetInnerHTML={{ __html: t(`recovery_phrase.import_wallet_s${step}`) }}
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
              {step === 2 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {_renderPhrase(0, 6)}
                </Flex>
              )}
              {step === 3 && (
                <Flex width="160px" flexDirection="column" margin="auto">
                  {_renderPhrase(6, 12)}
                </Flex>
              )}
            </Flex>
            {!error && (
              <Flex marginTop="115px" fontSize="13px">
                <Text className={error ? 'error-txt' : 'co3-link'} width="100%" textAlign="center">
                  {t(`recovery_phrase.import_wallet_s${step}`)}
                </Text>
              </Flex>
            )}
          </Flex>
        )}
        {error && (
          <Flex className="handle-error">
            <ErrorMsg iconStyle={{ margin: 'auto' }} title={error} type="error" />
          </Flex>
        )}
        {!error && (
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

export default ImportWallet;
