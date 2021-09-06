import React, { useEffect, useState } from 'react';
import IconButton from '../components/IconButton';
import { Flex, Text } from 'rebass';
import { Label } from '@rebass/forms';
import AddImage from '../components/AddImage';
import { useHistory, useLocation } from 'react-router-dom';
import TextArea from '../components/TextArea';
import BuyStep from '../components/Crowdsale/NewCrowdsale/BuyStep';
import CreateFooterStep from '../components/StepsComponents/CreateFooterStep';
import CreateInputStep from '../components/StepsComponents/CreateInputStep';
import CreateDetailStep from '../components/StepsComponents/CreateDetailStep';
import { createCrowdsaleSteps } from './commonData';
import ErrorMsg from '../components/ErrorMsg';
import _get from 'lodash/get';
import { motion } from 'framer-motion';
import FramerSlide from '../components/FrameMotion/Slide';
import CrowdsaleImageCard from '../components/Crowdsale/NewCrowdsale/CrowdsaleImageCard';
import SupplyStep from '../components/Crowdsale/NewCrowdsale/SupplyStep';
import PriceTokenStep from '../components/Crowdsale/NewCrowdsale/PriceTokenStep';
import DateInput from '../components/DateInput';
import { SelectAca } from 'src/components/SelectAca';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { createNewCrowdsale, fetchTokenByTicker, getAllCrowdsale, transferTokens, unlockCrowdsale } from 'src/redux/actions/Chain';
import { COUPON_PURPOSE, LIMIT } from 'src/config';
import ScenarioJSON from '../config/scenario.config.json';
import { setModalData } from 'src/redux/actions/Modal';
import { getACAList, getPermalink, saveCrowdsaleData, saveResource } from 'src/api/firstlife';
import Loading from '../components/Loading';
import { getTokenSymbol, saveWebhookAPI } from 'src/utils/helper';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import { CrowdsaleSortEnum, GET_CROWDSALE_ADDED, GET_ALL_TOKENS } from 'src/api/middleware';
import { ICrowdsaleData } from 'src/interfaces';

const pdfContract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

interface IProps {
  crowdsale: ICrowdsaleData;
  tokenList: any;
}

const isDev = process.env.NODE_ENV === 'development';
const endDateInt = new Date(new Date().setMonth(new Date().getMonth() + 1));

const NewCrowdsale: React.FC<IProps> = () => {
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
    endDate: endDateInt,
    description: '',
    contract: '',
    contractLabel: '',
    maxSupply: '',
    // itemToSell: isDev ? '0xbD2Dc75534022E2bc79A49798115F9303734dA66' : '',
    itemToSell: '',
    giveRatio: '',
    token: isDev ? '0x26BF83F78805f107740a0DafC02167e4d4d7349c' : '',
    FLID: '',
    TTA: '',
    TTG: '',
    AU: '',
    RU: '',
    aca: {
      id: '',
      geolocation: {
        long: 0,
        lang: 0
      }
    },
  });
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [acaList, setAcaList] = useState([]);
  const [tokenList, setTokenList] = useState([]);
  console.log("tokenlist", tokenList)

// -------------------------------------------------------------------------- */
//                         Get data from the store                          */
// -------------------------------------------------------------------------- */

  const { accessToken, contracts } = useSelector(({ co3uum, chain }: any) => {
    return {
      accessToken: co3uum.accessToken,
      contracts: chain.contracts,
    };
  });
  console.log('accesstoken', accessToken)


//-------------------------------------------------------------------- */
//                              get all tokens
//-------------------------------------------------------------------- */

  const tokenQueryData = useQuery(GET_ALL_TOKENS);

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const checkError = (_step: number, value: any, text: string) => {
    if (step === _step && value === '') {
      setError(`${text} ${t('common.is_required')}`);

      return true;
    }
  };

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const crowdsaleData = _get(history, 'location.state.crowdsale', undefined);

  useEffect(() => {
    if (crowdsaleData) {
      setStep(10);
      onchangeCrowdsale(crowdsaleData);
    }
  }, [crowdsaleData]);

  // -------------------------------------------------------------------------- */
  //                     ACA List
  // -------------------------------------------------------------------------- */


  useEffect(() => {
    getACAList(accessToken).then((res: any) => {
      setAcaList(res.data.things.features)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

   // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const handleEditStep = () => {
    setStep(8)
    setTitle(t('new_crowdsale.label'))
  }

  const handleSteps = () => {
    setError('');
    if (step <= 9) {
      if (
        checkError(1, crowdsale.name, t('common.name')) ||
        checkError(1, crowdsale.aca, t('common.aca_to_attach')) ||
        checkError(2, crowdsale.icon, t('common.icon')) ||
        checkError(3, crowdsale.startDate, t('new_crowdsale.start_date')) ||
        checkError(3, crowdsale.endDate, t('new_crowdsale.end_date')) ||
        checkError(5, crowdsale.contract, t('common.contract')) ||
        checkError(6, crowdsale.maxSupply, t('new_crowdsale.max_supply')) ||
        checkError(6, crowdsale.itemToSell, t('new_crowdsale.item_to_sell')) ||
        checkError(7, crowdsale.giveRatio, t('new_crowdsale.give_ratio')) ||
        checkError(7, crowdsale.token, t('asset_popup.token'))
      ) {
        return;
      }
      step <= 7 && title.indexOf(t('common.edit')) > -1 ? handleEditStep() : setStep(step + 1);
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
    console.log("crowdsale in new_crowdsale_1", crowdsale)
    setError('');
  };

  const onChangeContract = (e: any) => {
    setUploading(true);
    setError('');
    if (e.target.files[0]) {
      const label = e.target.files[0].name;
      changeContractLabel(e.target.files[0].name);
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
          link ? onchangeCrowdsale({ ...crowdsale, contract: link, contractLabel: contractLabel || label }) : console.log(data);
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

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const [crowdsaleAddedQuery, { data }] = useLazyQuery(GET_CROWDSALE_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {},
      skip: 0,
      limit: LIMIT,
      sort: CrowdsaleSortEnum.DESC,
    },
  });

  useEffect(() => {
    crowdsaleAddedQuery();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (data && data.crowdsaleAddedNotificationMany) {
      getCrowdsaleUpdatedList();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const getCrowdsaleUpdatedList = async () => {
    const cdList: any = [];
    data.crowdsaleAddedNotificationMany.map((crowdAdded: ICrowdsaleData) => {
      const metaData = crowdAdded?.metadata as any || null
      const start = crowdAdded?.start && crowdAdded?.start?.includes('1970') ? Math.round(new Date(crowdAdded?.start).getTime() * 1000) : crowdAdded?.start;
      const end = crowdAdded?.end && crowdAdded?.end?.includes('1970') ? Math.round(new Date(crowdAdded?.end).getTime() * 1000) : crowdAdded?.end;
      metaData && metaData.token && cdList.push({ ...crowdAdded, start, end, ...metaData });

      return cdList;
    });
    if (cdList.length > 0) {
      dispatch(getAllCrowdsale(cdList));
    }
  };

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */


  useEffect(() => {
    if (contracts?.tokenFactory) {
      dispatch(fetchTokenByTicker(ScenarioJSON.athens.tokens[0]));
      setLoader(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contracts]);

  const handleCreateCrowdsale = async () => {
    setLoader(true);
    let callbackParam: string | null;
    let webHookParam: string | null;
    if (location.search) {
      const params = new URLSearchParams(location.search);
      callbackParam = params.get('callback');
      webHookParam = params.get('webhook');
      console.log('params', params)
    }

    const cddata = {
      type: 'Feature',
      properties: {
        name: crowdsale.name,
        address: '', //TODO: where does this come from?
        tags: [],
        icon: crowdsale.icon,
        itemToSell: crowdsale.itemToSell,
        token: crowdsale.token,
        description: crowdsale.description,
        contract: crowdsale.contract,
        contractLabel: crowdsale.contractLabel,
        logoURL: crowdsale.icon,
        aca: `https://api.co3-torino.firstlife.org/v6/fl/Things/${crowdsale.aca.id}`,
        categories: [],
        zoom_level: 18,
        entity_type: 'CO3_ACTIVITY',
      },
      geometry: {
        type: 'Point',
        coordinates: [
          crowdsale.aca.geolocation.long,
          crowdsale.aca.geolocation.lang,
        ]
      },
    };

    saveCrowdsaleData(accessToken, cddata).then(async (res: any) => {
      const firstlifeId = res.data.id
      const datatest = res.data
      const resTest = res
      console.log('firstlifeId', firstlifeId)
      console.log('data', datatest)
      console.log('res', resTest)
      console.log('crowdsale from new crowd sale 2', crowdsale)
      console.log('crowdsaledata', crowdsale)
      crowdsale.FLID = firstlifeId
      crowdsale.TTA = getTokenSymbol(tokenList, crowdsale.token) // symbol (ticker) of the token used to participate to the crowdsale
      crowdsale.TTG = getTokenSymbol(tokenList, crowdsale.token) //  symbol (ticker) of the Coupon that users receive when the crowdsale ends
      crowdsale.AU = `${window.location.host}?access_token=${accessToken}`
      crowdsale.RU = `${window.location.host}?access_token=${accessToken}&redeem=${crowdsale.token}` // crowdsale token is place holder i have to look for the redeem code
      const receipt: any = dispatch(createNewCrowdsale(crowdsale));
      receipt
        .then(async (res: any) => {
          console.log('receipt', receipt)
          console.log('tokenlist', tokenList)
          if (res) {
            const crowdsaleDataRes = _get(res, 'events.CrowdsaleAdded.returnValues');
            const contractAddress = crowdsaleDataRes._contractAddress;
            console.log(res);
            await dispatch(transferTokens({
              contractAddress: crowdsale.itemToSell,
              purpose: COUPON_PURPOSE,
              decimals: 0,
              name: '',
              symbol: '',
              logoURL: '',
              owner: '',
              mintable: true
            },
              contractAddress,
              Number(crowdsale.maxSupply)
            ));

            // await dispatch(unlockCrowdsale(contractAddress))

            if (callbackParam) {
              window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'
                }_id=${crowdsaleDataRes._contractAddress}`;
            }
            if (webHookParam) {
              await saveWebhookAPI(webHookParam, crowdsaleDataRes._contractAddress, res);
            }
            setLoader(false);
            // console.log(res);
            // console.log(crowdsale)
            history.push('/');
            dispatch(
              setModalData(
                true,
                t('new_crowdsale.crowdsale_created'),
                t('common.transaction_complete'),
                'permission',
              ),
            );
          }
        })
        .catch(async (err: any) => {
          if (callbackParam) {
            window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'
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
    }).catch(async (err: any) => {
      const errMsg = err.response ? err.response?.data?.error?.message : err.message.split('\n')[0]
      if (callbackParam) {
        window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'
          }_id=error`;
      }
      if (webHookParam) {
        await saveWebhookAPI(webHookParam, 'error', errMsg);
      }
      setLoader(false);
      dispatch(
        setModalData(
          true,
          t('new_crowdsale.crowdsale_creation_failed'),
          errMsg,
          'permission',
        ),
      );

      return;
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
      {step === 9 || title.indexOf(t('common.edit')) > -1 ? (
        <Flex
          justifyContent="space-between"
          alignItems="center"
          paddingY={4}
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
        >
          <IconButton onClick={handleEditStep} sx={{ cursor: 'pointer' }} icon="close" />
          <Text>{title}</Text>
          <Text />
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
            <div>
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
              <SelectAca
                value={crowdsale.aca}
                onChangeValue={(e: any) => {
                  handleChangeCrowdsale(e, 'aca')
                }
                }
                label=""
                className="crowdsale-aca"
                error={error}
                data={acaList}
              />
            </div>
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
                    label={contractLabel ? contractLabel : 'Upload contract'}
                    accept="application/pdf"
                    icon={contractLabel ? 'clouddone' : 'cloud'}
                    onChange={onChangeContract}
                    placeholder={''}
                    padding={6}
                    marginLeft={20}
                  />
                  <div>
                    {error && <ErrorMsg title={error} type="error" style={{ top: '50vh' }} />}
                  </div>
                </Flex>
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
