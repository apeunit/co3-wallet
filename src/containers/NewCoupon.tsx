import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text } from 'rebass';
import { Label } from '@rebass/forms';
import AddImage from '../components/AddImage';
import { useHistory } from 'react-router-dom';
import TextArea from '../components/TextArea';
import CreateBuyStep from '../components/StepsComponents/CreateBuyStep';
import CreateFooterStep from '../components/StepsComponents/CreateFooterStep';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import CreateDetailStep from '../components/StepsComponents/CreateDetailStep';
import { createCouponSteps } from './commonData';
import ErrorMsg from '../components/ErrorMsg';
import _get from 'lodash/get';
import { motion } from 'framer-motion';
import FramerSlide from '../components/FrameMotion/Slide';
import CouponImageCard from '../components/Coupons/CreateCoupon/CouponImageCard';
import { useDispatch, useSelector } from 'react-redux';
import { getPermalink, saveResource } from '../api/firstlife';
import { createNewToken } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import { COUPON_PURPOSE } from 'src/config';
const pdfContract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

const NewCoupon: React.FC = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const dispatch = useDispatch();
  const [loader, setLoader] = useState(false);
  const [step, setStep] = useState(1);
  const [title, setTitle] = useState<string>(t('new_coupon.label'));
  const [contractLabel, changeContractLabel] = useState('');
  const randomSymbol = Math.random()
    .toString(36)
    .replace('.', '')
    .replace(/\d/g, '')
    .substr(1, 4);
  const [coupon, onchangeCoupon] = useState({
    name: '',
    headline: '',
    symbol: randomSymbol.toUpperCase(),
    icon: '',
    description: '',
    contract: '',
    contractLabel: '',
    totalCoupon: '',
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);

  const { web3, tokenFactory, accessToken } = useSelector(({ chain, co3uum }: any) => {
    return {
      web3: chain.web3,
      tokenFactory: chain.contracts && chain.contracts.tokenFactory,
      accessToken: co3uum.accessToken,
    };
  });

  const checkError = (_step: number, value: string, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} ${t('common.is_required')}`);

      return true;
    }
  };

  const couponData = _get(history, 'location.state.coupon', undefined);

  useEffect(() => {
    if (couponData) {
      setStep(9);
      onchangeCoupon(couponData);
    }
  }, [couponData]);

  const handleSteps = () => {
    setError('');
    if (step <= 8) {
      if (
        checkError(1, coupon.name, t('common.name')) ||
        checkError(2, coupon.headline, t('new_coupon.headline')) ||
        checkError(5, coupon.icon, t('common.icon')) ||
        checkError(6, coupon.contract, t('common.contract')) ||
        checkError(7, coupon.totalCoupon, t('new_coupon.total_coupon'))
      ) {
        return;
      }
      if (step <= 8 && title.indexOf(t('common.edit')) > -1) {
        setStep(8);
        setTitle(t('new_coupon.label'));
      } else {
        setStep(step + 1);
      }
    }
  };

  const handlebackStep = () => {
    setError('');
    step > 1 ? setStep(step - 1) : history.push('/');
  };

  const handleClose = () => {
    step === 9
      ? history.push({ pathname: '/', state: { pendingToken: [coupon] } })
      : history.push('/');
  };

  const handleChangeIcon = (e: any) => {
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
          link ? onchangeCoupon({ ...coupon, icon: link }) : console.log(data);
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
    onchangeCoupon({ ...coupon, [key]: e });
    setError('');
  };

  const onChangeContract = (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      changeContractLabel(e.target.files[0].name);
      onchangeCoupon({ ...coupon, contractLabel: e.target.files[0].name });
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
          link ? onchangeCoupon({ ...coupon, contract: link }) : console.log(data);
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
    const stepData = createCouponSteps.find((_step: any) => stepName === t(`${_step.title}`));
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

  const handleCreateCoupon = async () => {
    setLoader(true);
    const receipt: any = dispatch(
      createNewToken(
        tokenFactory,
        coupon.name,
        coupon.symbol,
        coupon.icon,
        web3.utils.keccak256(coupon.icon),
        web3.utils.keccak256(coupon.icon),
        0,
        web3.utils.toHex(parseInt(coupon.totalCoupon, 10) || 0),
        COUPON_PURPOSE,
      ),
    );
    receipt
      .then((res: any) => {
        setLoader(false);
        history.push('/');
        dispatch(
          setModalData(
            true,
            t('new_coupon.coupon_created'),
            t('common.transaction_complete'),
            'permission',
          ),
        );
      })
      .catch((err: any) => {
        setLoader(false);
        console.log(err, 'NewCoupon');
        dispatch(
          setModalData(
            true,
            t('new_coupon.coupon_creation_failed'),
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
          style={{
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {step === 1 && (
            <CreateInputStep
              type="text"
              value={coupon.name}
              onChangeValue={(e: any) => handleChangeToken(e, 'name')}
              label={t('common.name')}
              placeholder={t('new_coupon.name_placeholder')}
              maxLength="30"
              msg=""
              className="coupon-name-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 2 && (
            <CreateInputStep
              type="text"
              value={coupon.headline}
              onChangeValue={(e: any) => handleChangeToken(e, 'headline')}
              label={t('new_coupon.headline')}
              placeholder={t('new_coupon.headline_placeholder')}
              maxLength="35"
              msg=""
              className="coupon-headline-input"
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 3 && (
            <CreateInputStep
              type="text"
              value={coupon.symbol}
              onChangeValue={(e: any) => handleChangeToken(e, 'symbol')}
              label={t('common.symbol')}
              placeholder=""
              maxLength="4"
              msg=""
              error=""
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 4 && (
            <FramerSlide>
              <Flex flexDirection="column" width="100%" style={{ transform: 'translateY(-20px)' }}>
                <TextArea
                  value={coupon.description}
                  className="coupon-description-input"
                  onChangeValue={(e: any) => handleChangeToken(e, 'description')}
                  label={t('common.short_description')}
                  placeholder={t('new_coupon.description_placeholder')}
                  maxLength="500"
                />
              </Flex>
            </FramerSlide>
          )}
          {step === 5 && (
            <CouponImageCard
              coupon={coupon}
              handleChangeIcon={handleChangeIcon}
              uploading={uploading}
              error={error}
              icon={coupon.icon}
            />
          )}
          {step === 6 && (
            <FramerSlide>
              <Flex flexDirection="column" style={{ transform: 'translateY(-10px)' }}>
                <Flex flexDirection="column" marginBottom={8}>
                  <Label fontSize="16px" color="#3191919">
                    {t('new_token.custom_contract')}
                  </Label>
                  <Text fontSize="13px" color="#8E949E" paddingX={1} marginTop={2}>
                    {t('new_token.custom_contract_msg')}{' '}
                    <a
                      className="contract-link"
                      href={pdfContract}
                      download="Token-Legal-Contract_Template.pdf"
                    >
                      {t('new_token.here')}
                    </a>
                  </Text>
                </Flex>
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
                  <div>
                    {error && <ErrorMsg title={error} type="error" style={{ top: '52vh' }} />}
                  </div>
                </Flex>
              </Flex>
            </FramerSlide>
          )}
          {step === 7 && (
            <CreateInputStep
              type="number"
              className="coupon-supply-input"
              value={coupon.totalCoupon}
              onChangeValue={(e: any) => handleChangeToken(e, 'totalCoupon')}
              label={t('new_coupon.total_coupon')}
              placeholder={t('new_coupon.total_coupon_placeholder')}
              maxLength=""
              msg=""
              error={error}
              handleKeyChange={_handleKeyDown}
            />
          )}
          {step === 8 && <CreateBuyStep data={coupon} />}
          {step === 9 && <CreateDetailStep handleEdit={handleEdit} data={coupon} />}
          {!uploading && error === '' && step !== 9 && (
            <CreateFooterStep
              lastStep={step === 8}
              handleSteps={handleSteps}
              onbtnDrag={handleCreateCoupon}
            />
          )}
        </Flex>
      </motion.div>
    </Flex>
  );
};

export default NewCoupon;
