import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Box } from 'rebass';
import ImageCard from 'src/components/ImageCard';
import FramerSlide from '../components/FrameMotion/Slide';
import IconButton from '../components/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../assets/styles/NewToken.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { CrowdsaleSortEnum, GET_CROWDSALE_ADDED, GET_ALL_TOKENS } from '../api/middleware';
import { useQuery } from '@apollo/react-hooks';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getTokenSymbol } from 'src/utils/helper'
import { getCrowdsaleData } from 'src/redux/actions/Chain';
import axios from 'axios';
// import CouponList from '../components/Coupons/CouponsList/CouponList';
import { COUPON_PURPOSE } from 'src/config';
// import { GET_TOKEN } from '../api/middleware';


const fileDownload = require('js-file-download');
const isDev = process.env.NODE_ENV === 'development';
const pdfcontract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const CrowdsaleDetail: React.FC = (props) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { state }: any = history.location;
  const { id } = useParams<any>();
  const [tokenList, setTokenList] = useState([])

  const [progress, setProgress] = useState(0);
  const [couponList, setCouponList] = useState([]);
  // const [tokenListOption, setTokenListOption]: any = useState([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [countdown, setCountdown] = useState<any>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [isDisabled, setIsDisabled] = useState(false)

  // ---------------------------------------------------
  //               Get data from the store                          
  // ---------------------------------------------------
  const tokenQueryData = useQuery(GET_ALL_TOKENS);
  const crowdsalesQueryData = useQuery(GET_CROWDSALE_ADDED, {
    fetchPolicy: 'no-cache',
    variables: {
      filter: {
        metadata: {
          FLID: id,
        }
      },
      skip: 0,
      limit: 1,
      sort: CrowdsaleSortEnum.DESC,
    },
  });

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

  useEffect(() => {
    if (!crowdsalesQueryData.loading && crowdsalesQueryData.data && crowdsalesQueryData.data.crowdsaleAddedNotificationMany) {
      const data = crowdsalesQueryData.data.crowdsaleAddedNotificationMany.length ? crowdsalesQueryData.data.crowdsaleAddedNotificationMany[0] : null;
      if (!data) return history.push('/marketplace');
      const metaData = data?.metadata as any || null
      const start = data?.start && data?.start?.includes('1970') ? Math.round(new Date(data?.start).getTime() * 1000) : data?.start;
      const end = data?.end && data?.end?.includes('1970') ? Math.round(new Date(data?.end).getTime() * 1000) : data?.end;
      const crowdsale = { ...data, start, end, ...metaData };
      dispatch(
        getCrowdsaleData({
          ...crowdsale,
          crowdSymbol: getTokenSymbol(tokenList, crowdsale.token),
        }),
      );
      console.log(data);
    }
  }, [crowdsalesQueryData, history, dispatch, tokenList]);

  const { tokensDataList, errorWeb3, crowdsaleData, token } = useSelector(({ chain, wallet }: any) => {
    return {
      crowdsaleData: chain.crowdsaleData,
      token: wallet.transfer.token,
      tokensDataList: chain.tokenList,
      errorWeb3: chain.errorWeb3,
    };
  });
  // console.log("crowdsaledata", crowdsaleData)

  const then: any = moment(crowdsaleData?.end);
  const now: any = moment();
  // console.log("then minus now", then._d - now._d)
  // console.log("now minus then", now - then)

  //-------------------------------------------------------------------------------
  //        if crowdsale is not open button to participate will get disabled
  //-------------------------------------------------------------------------------

  useEffect(() => {
    setIsDisabled(!then.isSameOrAfter(now));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDisabled]);

  //-------------------------------------------------------------------------------
  //        
  //-------------------------------------------------------------------------------

  // const [getCoupon, { called, data }] = useLazyQuery(GET_TOKEN, {
  //   fetchPolicy: 'no-cache',
  //   variables: {
  //     contractAddress: crowdsaleData.itemToSell,
  //   },
  // });

  // useEffect(() => {
  //   if (crowdsaleData) {
  //     getCoupon()
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [crowdsaleData]);

  //---------------------------------------------------------
  //        show list of coupons
  //---------------------------------------------------------

  useEffect(() => {
    if (tokensDataList.length > 0) {
      setCouponList(tokensDataList.filter((tk: any) => tk.purpose === COUPON_PURPOSE));
      console.log("tokendatalist", tokensDataList)
    } else if ((tokenLoading && tokensDataList.length === 0) || (errorWeb3 && !errorWeb3?.connected)) {
      setTokenLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensDataList, tokenLoading, errorWeb3]);

  // console.log("couponlist", couponList)

  //---------------------------------------------------------
  //          get crowdsale data
  //---------------------------------------------------------

  useEffect(() => {
    if (state && state.crowdsaleData) {
      dispatch(getCrowdsaleData({ ...state?.crowdsaleData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  //---------------------------------------------------------
  //        ???
  //---------------------------------------------------------

  useEffect(() => {
    setProgress(0);
    setCountdown(moment(then - now));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //---------------------------------------------------------
  //       ???           
  //---------------------------------------------------------

  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setCountdown(moment(then - now));
    }, 1000);

    return () => clearInterval(interval);
  }, [crowdsaleData, countdown, then, now]);


  //---------------------------------------------------------
  //       partticipate in the crowdsale handler
  //---------------------------------------------------------

  const kebabCase = (string: string) => string
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, '-')
    .toLowerCase();

  const handleBuyNow = () => {
    history.push({
      pathname: `/join-crowdsale`,
      search: `to=${crowdsaleData?.contractAddress}&token=${crowdsaleData?.crowdSymbol}&amount=${crowdsaleData?.acceptRatio}&acceptRatio=${crowdsaleData?.acceptRatio}&maxCap=${crowdsaleData?.maxCap}`,
      state: { from: `/crowdsale-detail/${kebabCase(crowdsaleData.name)}`, crowdsaleData }
    });
  };

  //---------------------------------------------------------
  //           terms PDF
  //---------------------------------------------------------

  const handleDownload = (url: string, filename: string) => {
    setIsDownloading(true);
    axios.get(isDev ? url : url.replace('http', 'https'), {
      responseType: 'blob',
    })
      .then((res) => {
        setIsDownloading(false);
        fileDownload(res.data, filename)
      }).catch(() => {
        setIsDownloading(false);
        setError(t('common.download_error'))
      })
  }
  if (!crowdsaleData?.name) return null;
  return (
    <Flex
      flexDirection="column"
      width="100%"
      height="100%"
      justifyContent="space-between"
      style={{ overflow: 'hidden' }}
    >
      <Flex
        justifyContent="space-between"
        alignItems="center"
        paddingY={4}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', zIndex: 100 }}
      >
        <IconButton
          onClick={() => history.push('/marketplace')}
          sx={{ cursor: 'pointer' }}
          icon="back"
        />
        <Text>{t('marketplace.label')}</Text>
        <IconButton onClick={() => history.push('/')} sx={{ cursor: 'pointer' }} icon="close" />
      </Flex>
      <FramerSlide
        customStyle={{ height: '85%', position: 'absolute', top: '65px', width: '100%' }}
      >
        <Flex flexDirection="column" width="100%" justifyContent="start">
          <Flex width="100%" height="40%">
            <ImageCard
              padding="0px"
              name=""
              symbol=""
              icon={crowdsaleData?.icon || crowdsaleData?.logoURL}
              uploading={false}
              type=""
              uploadIcon="crowdsale"
              alignItems="center"
              style={{
                width: '97%',
                margin: '0px auto',
                alignContent: 'center',
                justifyContent: 'flex-end !important',
              }}
            />
          </Flex>
          <Flex
            paddingX={'20px'}
            marginTop="15px"
            flexDirection="column"
            width="100%"
            justifyContent="start"
          >
            <Flex justifyContent="space-between">
              <Text fontSize="24px">{crowdsaleData?.name}</Text>
              <Flex>
                <Text fontSize="18px" fontWeight="bold" color="#3048D9">
                  {crowdsaleData?.giveRatio}{' '}
                  <span className="crowdsale-detail-font">{crowdsaleData?.crowdSymbol}</span>
                </Text>
              </Flex>
            </Flex>
            <Flex marginTop="10px" flexDirection="column">
              <div className={classes.root}>
                <LinearProgress variant="determinate" value={progress} />
              </div>
              <Text marginTop="5px" fontSize="14px" color="#757575">
                {/* <span className="token-goal-font">10</span> of  */}
                {t('marketplace.goal')}: {crowdsaleData?.maxCap}
              </Text>
            </Flex>
            <Flex marginTop="15px" flexDirection="row" fontSize="14px" color="#949494">
              <Flex>
                <IconButton
                  cursor={'default'}
                  icon="hourglassEmpty"
                  width="14px"
                  height="16px"
                  marginRight="12px"
                />
                <Text>
                  {t('marketplace.closes')} <Moment fromNow={true}>{crowdsaleData?.end}</Moment>{' '}
                  {moment().isBefore(crowdsaleData?.end) && countdown && (
                    <>
                      {countdown.format('D')} {t('marketplace.days')} {countdown.format('HH')}{' '}
                      {t('marketplace.hours')} {countdown.format('mm')} {t('marketplace.minutes')}{' '}
                      {countdown.format('ss')} {t('marketplace.seconds')}
                    </>
                  )}
                </Text>
              </Flex>
            </Flex>
            <Flex color="#757575" padding="25px 0px 30px">
              <Text fontSize="16px" color="#757575">
                {crowdsaleData?.description}
              </Text>
            </Flex>
            {(tokenLoading || couponList.length > 0) &&
              (<Box width="100%" marginTop="20px">
                <Text
                  fontFamily="sans"
                  fontSize="18px"
                  padding="0px 10px 5px"
                  color={'lightGray'}
                  textAlign="left"
                >
                  {t('crowdsaledetail.coupons_received')}
                </Text>
                {/* {couponList.map((coupon: any) => 
                  coupon.contractAddress === crowdsaleData?.itemToSell 
                  && <CouponList tokens={coupon} tokenLoading={tokenLoading} />)}  */}
                {/* <CouponList tokens={couponList} tokenLoading={tokenLoading} /> */}
                {/* {data} */}
              </Box>)}
            <Flex>
              <Text fontSize="12px" color="#757575">
                {t('marketplace.started_on')}{' '}
                <Moment format="DD/MM/YYYY">{crowdsaleData?.start}</Moment>
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="24px"></Text>
            </Flex>
            <Flex marginTop="10px" flexDirection="column">
              <Text marginTop="5px" fontSize="14px" color="#757575">
                {t('marketplace.aca')}: {crowdsaleData?.aca.name}
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="24px">
                <Flex paddingX="15px" paddingBottom={15} marginBottom={(isDownloading || error) ? '80px' : '30px'}>
                  <button onClick={() => handleDownload(token?.contractHash || pdfcontract, token?.contractLabel || 'Token-Legal-Contract_Placeholder.pdf')}>
                    <Flex
                      marginTop="10px"
                      height="32px"
                      width="187px"
                      sx={{ borderRadius: 'full', borderWidth: '1px', borderColor: '#F1F3F6' }}
                      className="token-file-icon"
                      padding="5px 10px 10px 12px"
                    >
                      <IconButton marginRight="5px" width="20px" height="10px" icon="fileCopy" />
                      <Text color="#404245" fontSize={13}>
                        {t('token_details.terms_conditions')}
                      </Text>
                    </Flex>
                  </button>
                  <button>
                    {/* <Flex
                      marginTop="10px"
                      height="32px"
                      width="187px"
                      sx={{ borderRadius: 'full', borderWidth: '1px', borderColor: '#F1F3F6' }}
                      className="token-file-icon"
                      padding="5px 10px 10px 12px"
                      >
                      <IconButton marginRight="5px" width="20px" height="10px" icon="locationOn" />
                      <Text color="#404245" fontSize={13}>
                        {t('token_details.firstlife')}
                      </Text>
                    </Flex> */}
                  </button>
                </Flex>
              </Text>
            </Flex>

            <Button
              onClick={handleBuyNow}
              className="buynow-btn"
              variant="primary"
              sx={{ position: 'relative', bottom: 1 }}
              mr={2}
              disabled={isDisabled}
            >
              <Flex justifyContent="center">
                <IconButton
                  marginRight="10px"
                  cursor={'default'}
                  icon="shoppingCart"
                  width="22px"
                  height="13px"
                />
                <Text fontSize="14px" lineHeight="14px">
                  {t('marketplace.buy_now')}
                </Text>
              </Flex>
            </Button>
          </Flex>
        </Flex>
      </FramerSlide>
    </Flex>
  );
};

export default CrowdsaleDetail;

