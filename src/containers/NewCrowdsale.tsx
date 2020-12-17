import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text } from 'rebass';
import RadioButtonGroup from '../components/RadioButtonGroup';
import AddImage from '../components/AddImage';
import { useHistory, useLocation } from 'react-router-dom';
import TextArea from '../components/TextArea';
import BuyStep from '../components/Crowdsale/NewCrowdsale/BuyStep';
import CreateFooterStep from '../components/StepsComponents/CreateFooterStep';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import CreateDetailStep from '../components/StepsComponents/CreateDetailStep';
import { contractsRadio, createCrowdsaleSteps } from './commonData';
import ErrorMsg from '../components/ErrorMsg';
import _get from 'lodash/get';
import { motion } from 'framer-motion';
import FramerSlide from '../components/FrameMotion/Slide';
import CrowdsaleImageCard from '../components/Crowdsale/NewCrowdsale/CrowdsaleImageCard';
import SupplyStep from '../components/Crowdsale/NewCrowdsale/SupplyStep';
import PriceTokenStep from '../components/Crowdsale/NewCrowdsale/PriceTokenStep';
import DateInput from '../components/DateInput';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createNewCrowdsale } from 'src/redux/actions/Chain';
import { setModalData } from 'src/redux/actions/Modal';
import { getPermalink, saveResource } from 'src/api/firstlife';
import Loading from '../components/Loading';
import { saveWebhookAPI } from 'src/utils/helper';
import { useMutation } from '@apollo/react-hooks';
import { CROWDSALE_ADDED } from '../api/middleware';
import moment from 'moment';

const isDev = process.env.NODE_ENV === 'development';

const NewCrowdsale: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState<string>(t('new_crowdsale.label'));
  const [contractLabel, changeContractLabel] = useState('');
  const [loader, setLoader] = useState(false);

  const [crowdsale, onchangeCrowdsale] = useState({
    name: '',
    icon: '',
    startDate: new Date(),
    endDate: '2025-08-18T21:11:54',
    description: '',
    contractType: 'Standard Contract',
    contract: '',
    contractLabel: '',
    maxSupply: '',
    itemToSell: isDev ? '0xbD2Dc75534022E2bc79A49798115F9303734dA66' : '',
    giveRatio: '',
    token: isDev ? '0x26BF83F78805f107740a0DafC02167e4d4d7349c' : '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [crowdsaleAddedNotification] = useMutation(CROWDSALE_ADDED);
  const { accessToken } = useSelector(({ co3uum }: any) => {
    return {
      accessToken: co3uum.accessToken,
    };
  });

  const checkError = (_step: number, value: any, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} ${t('common.is_required')}`);

      return true;
    }
  };

  const crowdsaleData = _get(history, 'location.state.crowdsale', undefined);

  useEffect(() => {
    if (crowdsaleData) {
      setStep(10);
      onchangeCrowdsale(crowdsaleData);
    }
  }, [crowdsaleData]);

  const handleSteps = () => {
    setError('');
    if (step <= 9) {
      if (
        checkError(1, crowdsale.name, t('common.name')) ||
        checkError(2, crowdsale.icon, t('common.icon')) ||
        checkError(3, crowdsale.startDate, t('new_crowdsale.start_date')) ||
        checkError(3, crowdsale.endDate, t('new_crowdsale.end_date')) ||
        checkError(5, crowdsale.contractType, '') ||
        (crowdsale.contractType === 'Custom Contract' &&
          checkError(5, crowdsale.contract, t('common.contract'))) ||
        checkError(6, crowdsale.maxSupply, t('new_crowdsale.max_supply')) ||
        checkError(6, crowdsale.itemToSell, t('new_crowdsale.item_to_sell')) ||
        checkError(7, crowdsale.giveRatio, t('new_crowdsale.give_ratio')) ||
        checkError(7, crowdsale.token, t('asset_popup.token'))
      ) {
        return;
      }
      step <= 7 && title.indexOf(t('common.edit')) > -1 ? setStep(8) : setStep(step + 1);
    }
  };

  const handlebackStep = () => {
    setError('');
    setTitle(t('new_crowdsale.label'));
    step === 8 ? setStep(step - 2) : step > 1 ? setStep(step - 1) : history.push('/');
  };

  const handleClose = () => {
    step === 9
      ? history.push({ pathname: '/', state: { pendingToken: [crowdsale] } })
      : history.push('/');
  };

  const handleChangeIcon = (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      const res = saveResource(accessToken, e.target.files[0]);
      res
        .then(({ data }: any) => {
          setUploading(false);
          const link = getPermalink(data);
          link ? onchangeCrowdsale({ ...crowdsale, icon: link }) : console.log(data);
        })
        .catch((err: any) => {
          setUploading(false);
          setError(t('common.invalid_token'));
        });
    } else {
      setUploading(false);
    }
  };

  const handleChangeCrowdsale = (e: any, key: string) => {
    onchangeCrowdsale({ ...crowdsale, [key]: e });
    setError('');
  };

  const onChange = (e: any, key: string) => {
    if (e.target.value === 'Standard Contract') {
      setError('');
      onchangeCrowdsale({ ...crowdsale, contract: '', contractLabel: '' });
    }
    onchangeCrowdsale({ ...crowdsale, [key]: e.target.value });
  };

  const onChangeContract = (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      changeContractLabel(e.target.files[0].name);
      onchangeCrowdsale({ ...crowdsale, contractLabel: e.target.files[0].name });
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
          link ? onchangeCrowdsale({ ...crowdsale, contract: link }) : console.log(data);
        })
        .catch((err: any) => {
          setUploading(false);
          setError(t('common.invalid_token'));
        });
    } else {
      setUploading(false);
    }
  };

  const handleEdit = (stepName: string) => {
    setTitle(`${t('common.edit')} ${stepName}`);
    const stepData = createCrowdsaleSteps.find((_step: any) => stepName === t(`${_step.title}`));
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

  const handleCreateCrowdsale = async () => {
    setLoader(true);
    let callbackParam: string | null;
    let webHookParam: string | null;
    if (location.search) {
      const params = new URLSearchParams(location.search);
      callbackParam = params.get('callback');
      webHookParam = params.get('webhook');
    }
    const receipt: any = dispatch(createNewCrowdsale(accessToken, crowdsale));
    receipt
      .then(async (res: any) => {
        if (res) {
          const crowdsaleDataRes = _get(res, 'events.CrowdsaleAdded.returnValues');
          crowdsaleAddedNotification({
            variables: {
              record: {
                contractAddress: crowdsaleDataRes._contractAddress,
                identifier: crowdsaleDataRes._id,
                start: moment.unix(crowdsaleDataRes._start),
                end: moment.unix(crowdsaleDataRes._end),
                acceptRatio: parseFloat(crowdsaleDataRes._acceptRatio),
                giveRatio: parseFloat(crowdsaleDataRes._giveRatio),
                owner: crowdsaleDataRes.owner,
                timestamp: moment.unix(crowdsaleDataRes._timestamp),
                maxCap: parseFloat(crowdsaleDataRes._maxCap),
              },
            },
          })
            .then(async (res: any) => {
              if (callbackParam) {
                window.location.href = `${callbackParam}${
                  callbackParam.includes('?') ? '&' : '?'
                }_id=${crowdsaleDataRes._contractAddress}`;
              }
              if (webHookParam) {
                await saveWebhookAPI(webHookParam, crowdsaleDataRes._contractAddress, res);
              }
              setLoader(false);
              console.log(res);
              history.push('/');
              dispatch(
                setModalData(
                  true,
                  t('new_crowdsale.crowdsale_created'),
                  t('common.transaction_complete'),
                  'permission',
                ),
              );
            })
            .catch(async (err: any) => {
              if (callbackParam) {
                window.location.href = `${callbackParam}${
                  callbackParam.includes('?') ? '&' : '?'
                }_id=error`;
              }
              if (webHookParam) {
                await saveWebhookAPI(webHookParam, 'error', err);
              }
              setLoader(false);
              console.log(err, 'NewCrowdsale');
              dispatch(
                setModalData(
                  true,
                  t('new_crowdsale.crowdsale_creation_failed'),
                  err.message.split('\n')[0],
                  'permission',
                ),
              );
            });
        }
      })
      .catch(async (err: any) => {
        if (callbackParam) {
          window.location.href = `${callbackParam}${
            callbackParam.includes('?') ? '&' : '?'
          }_id=error`;
        }
        if (webHookParam) {
          await saveWebhookAPI(webHookParam, 'error', err);
        }
        setLoader(false);
        console.log(err, 'NewCrowdsale');
        dispatch(
          setModalData(
            true,
            t('new_crowdsale.crowdsale_creation_failed'),
            err.message.split('\n')[0],
            'permission',
          ),
        );
      });
  };

  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="space-between"
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
          justifyContent={step === 2 ? 'start' : 'center'}
          marginTop={step === 2 ? '80px' : ''}
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {step === 1 && (
            <CreateInputStep
              type="text"
              value={crowdsale.name}
              onChangeValue={(e: any) => handleChangeCrowdsale(e, 'name')}
              label={t('common.name')}
              placeholder={t('new_crowdsale.name_placeholder')}
              maxLength="20"
              msg={t('new_crowdsale.campaign_msg')}
              className="crowdsale-name-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 2 && (
            <CrowdsaleImageCard
              crowdsale={crowdsale}
              handleChangeIcon={handleChangeIcon}
              uploading={uploading}
              error={error}
              icon={crowdsale.icon}
            />
          )}
          {step === 3 && (
            <Flex
              height="35vh"
              paddingBottom="70px"
              justifyContent="space-between"
              flexDirection="column"
            >
              <DateInput
                id="startDate"
                value={crowdsale.startDate}
                maxDate={crowdsale.endDate}
                onChangeValue={(e: any) => handleChangeCrowdsale(e, 'startDate')}
                msg={t('new_crowdsale.starting_date')}
              />
              <DateInput
                id="endDate"
                value={crowdsale.endDate}
                minDate={crowdsale.startDate}
                onChangeValue={(e: any) => handleChangeCrowdsale(e, 'endDate')}
                msg={t('new_crowdsale.ending_date')}
              />
            </Flex>
          )}
          {step === 4 && (
            <FramerSlide>
              <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-20px)' }}>
                <TextArea
                  className="crowdsale-description-input"
                  value={crowdsale.description}
                  onChangeValue={(e: any) => handleChangeCrowdsale(e, 'description')}
                  label={t('common.short_description')}
                  placeholder={t('new_crowdsale.description')}
                  msg={t('new_crowdsale.description_msg')}
                  maxLength="200"
                  defaultRows={5}
                />
              </Flex>
            </FramerSlide>
          )}
          {step === 5 && (
            <FramerSlide>
              <Flex flexDirection="column" style={{ transform: 'translateY(-10px)' }}>
                <RadioButtonGroup
                  value={crowdsale.contractType}
                  onChange={(e: any) => onChange(e, 'contractType')}
                  radios={contractsRadio}
                />
                {crowdsale.contractType === 'Custom Contract' && (
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
                    <div>
                      {error && <ErrorMsg title={error} type="error" style={{ top: '54.6vh' }} />}
                    </div>
                  </Flex>
                )}
              </Flex>
            </FramerSlide>
          )}
          {step === 6 && (
            <SupplyStep
              crowdsale={crowdsale}
              handleChangeCrowdsale={handleChangeCrowdsale}
              error={error}
              _handleKeyDown={_handleKeyDown}
            />
          )}
          {step === 7 && (
            <PriceTokenStep
              crowdsale={crowdsale}
              handleChangeCrowdsale={handleChangeCrowdsale}
              error={error}
              _handleKeyDown={_handleKeyDown}
            />
          )}
          {step === 8 && <BuyStep data={crowdsale} />}
          {step === 9 && (
            <CreateDetailStep
              uploading={uploading}
              handleChangeIcon={handleChangeIcon}
              handleEdit={handleEdit}
              data={crowdsale}
            />
          )}
          {!uploading && error === '' && step !== 9 && (
            <CreateFooterStep
              lastStep={step === 8}
              handleSteps={handleSteps}
              onbtnDrag={handleCreateCrowdsale}
            />
          )}
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default NewCrowdsale;
