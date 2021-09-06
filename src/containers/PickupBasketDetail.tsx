import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Box } from 'rebass';
import ImageCard from 'src/components/ImageCard';
import FramerSlide from '../components/FrameMotion/Slide';
import IconButton from '../components/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../assets/styles/NewToken.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { getPickupBasketData } from 'src/redux/actions/Chain';
import axios from 'axios';
import CouponList from '../components/Coupons/CouponsList/CouponList';
import { COUPON_PURPOSE } from 'src/config';

const fileDownload = require('js-file-download');
const isDev = process.env.NODE_ENV === 'development';
const pdfcontract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const PickupBasketDetail: React.FC = (props) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const { state }: any = history.location;

  const [progress, setProgress] = useState(0);
  const [couponList, setCouponList] = useState([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [countdown, setCountdown] = useState<any>('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');

  // ---------------------------------------------------
  //               Get data from the store                          
  // ---------------------------------------------------

  const { tokensDataList, errorWeb3, pickupBasketData, token } = useSelector(({ chain, wallet }: any) => {
    return {
      pickupBasketData: chain.pickupBasketData,
      token: wallet.transfer.token,
      tokensDataList: chain.tokenList,
      errorWeb3: chain.errorWeb3,
    };
  });
  console.log("pickupBasketData", pickupBasketData)

  const then: any = moment(pickupBasketData?.end);
  const now: any = moment();

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

  console.log("couponlist", couponList)

//---------------------------------------------------------
//          get pickupbasket data
//---------------------------------------------------------

  useEffect(() => {
    if (state && state.pickupBasketData) {
      dispatch(getPickupBasketData({ ...state?.pickupBasketData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

//---------------------------------------------------------
//          
//---------------------------------------------------------

  useEffect(() => {
    setProgress(0);
    setCountdown(moment(then - now));
    if (!pickupBasketData || pickupBasketData === null) {
      history.push('/marketplace');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

//---------------------------------------------------------
//                  
//---------------------------------------------------------

  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setCountdown(moment(then - now));
    }, 1000);

    return () => clearInterval(interval);
  }, [pickupBasketData, countdown, then, now]);

//---------------------------------------------------------
//       partticipate in the crowdsale handler
//---------------------------------------------------------

  const kebabCase = ( string : string ) => string
  .replace(/([a-z])([A-Z])/g, "$1-$2")
  .replace(/[\s_]+/g, '-')
  .toLowerCase();

  const handleBuyNow = () => {
    history.push({
      pathname: `/tx`,
      search: `to=${pickupBasketData?.contractAddress}&token=${pickupBasketData?.crowdSymbol}&amount=${pickupBasketData?.giveRatio}`,
      state: { from: `/pickup-basket-detail/${kebabCase(pickupBasketData.name)}`, pickupBasketData }
    });
  };

//---------------------------------------------------------
//           terms PDF
//---------------------------------------------------------

  const handleDownload = (url: string, filename: string) => {
    setIsDownloading(true);
    axios.get(isDev ? url : url.replace('http',  'https'), {
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
          onClick={() => history.push('/pickupbasketplace')}
          sx={{ cursor: 'pointer' }}
          icon="back"
        />
        <Text>{t('pickupbasketplace.label')}</Text>
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
              icon={pickupBasketData?.icon || pickupBasketData?.logoURL}
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
              <Text fontSize="24px">{pickupBasketData?.name}</Text>
              <Flex>
                <Text fontSize="18px" fontWeight="bold" color="#3048D9">
                  {pickupBasketData?.giveRatio}{' '}
                  <span className="crowdsale-detail-font">{pickupBasketData?.crowdSymbol}</span>
                </Text>
              </Flex>
            </Flex>
            <Flex marginTop="10px" flexDirection="column">
              <div className={classes.root}>
                <LinearProgress variant="determinate" value={progress} />
              </div>
              <Text marginTop="5px" fontSize="14px" color="#757575">
                {/* <span className="token-goal-font">10</span> of  */}
                {t('marketplace.goal')}: {pickupBasketData?.maxCap}
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
                  {t('marketplace.closes')} <Moment fromNow={true}>{pickupBasketData?.end}</Moment>{' '}
                  {moment().isBefore(pickupBasketData?.end) && countdown && (
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
                {pickupBasketData?.description}
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
                  {couponList.map((i: any) => i.contractAddress === pickupBasketData?.itemToSell && <CouponList tokens={i} tokenLoading={tokenLoading} />)} 
              </Box>)}
              <Flex>
              <Text fontSize="12px" color="#757575">
                {t('marketplace.started_on')}{' '}
                <Moment format="DD/MM/YYYY">{pickupBasketData?.start}</Moment>
              </Text>
            </Flex>
            <Flex>
              <Text fontSize="24px"></Text>
            </Flex>
            <Flex>
              <Text fontSize="24px">
                <Flex paddingX="15px" paddingBottom={15} marginBottom={(isDownloading || error) ? '80px' : '30px' }>
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
                    <Flex
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
                    </Flex>
                  </button>
                </Flex>
              </Text>
            </Flex>
          
            <Button
              onClick={handleBuyNow}
              className="buynow-btn"
              variant="primary"
              sx={{ position: 'relative', bottom: 1}}
              mr={2}
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

export default PickupBasketDetail;
