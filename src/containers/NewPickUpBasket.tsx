import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Flex, Text } from 'rebass';
import _get from 'lodash/get';
import { motion } from 'framer-motion';

import CreateDetailStep from '../components/StepsComponents/CreateDetailStep';
import CreateFooterStep from '../components/StepsComponents/CreateFooterStep';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import FramerSlide from '../components/FrameMotion/Slide';
import IconButton from '../components/IconButton';
import Loading from '../components/Loading';
import TextArea from '../components/TextArea';

import { setModalData } from 'src/redux/actions/Modal';
import { getPermalink, saveResource } from 'src/api/firstlife';
import { saveWebhookAPI } from 'src/utils/helper';

import { createNewPickUpBasket } from 'src/redux/actions/Chain';
import { createPickupbasketSteps } from './commonData';
import CrowdsaleImageCard from '../components/Crowdsale/NewCrowdsale/CrowdsaleImageCard';
import BuyStep from '../components/PickUpBasket/NewPickUpBasket/BuyStep';
import SupplyStep from '../components/PickUpBasket/NewPickUpBasket/SupplyStep';

const isDev = process.env.NODE_ENV === 'development';

const NewPickUpBox: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState<string>(t('new_pickupbox.label'));
  const [loader, setLoader] = useState(false);
  const [pickupbasket, onchangePickupbasket] = useState({
    name: '',
    icon: '',
    description: '',
    productsAvailable: '',
    couponToGive: isDev ? '0xbD2Dc75534022E2bc79A49798115F9303734dA66' : '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const { accessToken } = useSelector(({ co3uum }: any) => {
    return {
      accessToken: co3uum.accessToken
    };
  });

  const checkError = (_step: number, value: any, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} ${t('common.is_required')}`);

      return true;
    }
  };

  const pickupbasketData = _get(history, 'location.state.pickupbasket', undefined);

  useEffect(() => {
    if (pickupbasketData) {
      setStep(10);
      onchangePickupbasket(pickupbasketData);
    }
  }, [pickupbasketData]);

  const handleEditStep = () => {
    setStep(5)
    setTitle(t('new_pickupbox.label'))
  }

  const handleSteps = () => {
    setError('');
    if (step <= 6) {
      if (
        checkError(1, pickupbasket.name, t('common.name')) ||
        checkError(2, pickupbasket.icon, t('common.icon')) ||
        checkError(4, pickupbasket.productsAvailable, t('new_pickupbox.product_available')) ||
        checkError(5, pickupbasket.couponToGive, t('new_pickupbox.coupon_to_give'))
      ) {
        return;
      }
      step <= 7 && title.indexOf(t('common.edit')) > -1 ? handleEditStep() : setStep(step + 1);
    }
  };

  const handlebackStep = () => {
    setError('');
    setTitle(t('new_pickupbox.label'));
    step === 5 ? setStep(step - 2) : step > 1 ? setStep(step - 1) : history.push('/');
  };

  const handleClose = () => {
    step === 6
      ? history.push({ pathname: '/', state: { pendingToken: [pickupbasket] } })
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
          link ? onchangePickupbasket({ ...pickupbasket, icon: link }) : console.log(data);
        })
        .catch((err: any) => {
          setUploading(false);
          setError(t('common.invalid_token'));
        });
    } else {
      setUploading(false);
    }
  };

  const handleChangePickupbasket = (e: any, key: string) => {
    onchangePickupbasket({ ...pickupbasket, [key]: e });
    setError('');
  };

  const handleEdit = (stepName: string) => {
    setTitle(`${t('common.edit')} ${stepName}`);
    const stepData = createPickupbasketSteps.find((_step: any) => stepName === t(`${_step.title}`));
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

  const handleCreatePickUpBasket = async () => {
    setLoader(true);
    let callbackParam: string | null;
    let webHookParam: string | null;
    if (location.search) {
      const params = new URLSearchParams(location.search);
      callbackParam = params.get('callback');
      webHookParam = params.get('webhook');
    }
    console.log(pickupbasket)
    const receipt: any = dispatch(createNewPickUpBasket(pickupbasket));
    receipt
      .then(async (res: any) => {
        if (res) {
          const crowdsaleDataRes = _get(res, 'events.PickupbasketAdded.returnValues');
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
              t('new_pickupbox.pickup_created'),
              t('common.transaction_complete'),
              'permission',
            ),
          );
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
        console.log(err, 'NewPickUpBox');
        dispatch(
          setModalData(
            true,
            t('new_pickupbox.pickup_creation_failed'),
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
      {step === 6 || title.indexOf(t('common.edit')) > -1 ? (
          <Flex
            justifyContent="space-between"
            alignItems="center"
            paddingY={4}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
          >
            <IconButton onClick={handleEditStep} sx={{ cursor: 'pointer' }} icon="close" />
            <Text>{title}</Text>
            <Text/>
          </Flex>
        ) : (
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
        )
      }
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
              value={pickupbasket.name}
              onChangeValue={(e: any) => handleChangePickupbasket(e, 'name')}
              label={t('common.name')}
              placeholder={t('new_pickupbox.name_placeholder')}
              maxLength="20"
              msg={t('new_pickupbox.campaign_msg')}
              className="pickupbasket-name-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 2 && (
            <CrowdsaleImageCard
              crowdsale={pickupbasket}
              handleChangeIcon={handleChangeIcon}
              uploading={uploading}
              error={error}
              icon={pickupbasket.icon}
            />
          )}
          {step === 3 && (
            <FramerSlide>
              <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-20px)' }}>
                <TextArea
                  className="pickupbasket-description-input"
                  value={pickupbasket.description}
                  onChangeValue={(e: any) =>  handleChangePickupbasket(e, 'description')}
                  label={t('common.short_description')}
                  placeholder={t('new_crowdsale.description')}
                  msg={t('new_crowdsale.description_msg')}
                  maxLength="200"
                  defaultRows={5}
                />
              </Flex>
            </FramerSlide>
          )}
          {step === 4 && (
            <SupplyStep
              pickupbasket={pickupbasket}
              handleChangePickupbasket={handleChangePickupbasket}
              error={error}
              _handleKeyDown={_handleKeyDown}
            />
          )}
          {step === 5 && <BuyStep data={pickupbasket} />}
          {step === 6 && (
            <CreateDetailStep
              uploading={uploading}
              handleChangeIcon={handleChangeIcon}
              handleEdit={handleEdit}
              data={pickupbasket}
            />
          )}
          {!uploading && error === '' && step !== 6 && (
            <CreateFooterStep
              lastStep={step === 5}
              handleSteps={handleSteps}
              onbtnDrag={handleCreatePickUpBasket}
            />
          )}
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default NewPickUpBox;
