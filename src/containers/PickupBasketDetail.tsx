import React, { useEffect, useState } from 'react';
import { Button, Flex, Text, Box } from 'rebass';
import ImageCard from 'src/components/ImageCard';
import FramerSlide from '../components/FrameMotion/Slide';
import IconButton from '../components/IconButton';
import Loading from '../components/Loading';

import '../assets/styles/NewToken.css';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import Moment from 'react-moment';
import { setModalData } from 'src/redux/actions/Modal'
import { useTranslation } from 'react-i18next';
import { getTokenSymbol } from 'src/utils/helper'
import { CrowdsaleSortEnum, GET_PICKUP_BASKET_ADDED, GET_ALL_TOKENS } from '../api/middleware';
import { useQuery } from '@apollo/react-hooks';
import { getPickupBasketData, collectPickupBasket } from 'src/redux/actions/Chain';
import axios from 'axios';
import CouponCard from '../components/Coupons/CouponCard';
// import CouponList from '../components/Coupons/CouponsList/CouponList';
// import { COUPON_PURPOSE } from 'src/config';

const fileDownload = require('js-file-download');
const isDev = process.env.NODE_ENV === 'development';
const pdfcontract = require('../assets/Token-Legal-Contract_Placeholder.pdf');

const PickupBasketDetail: React.FC = (props) => {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const history = useHistory();
  const { state }: any = history.location;
  const { id } = useParams<any>();
  const [tokenList, setTokenList] = useState([]);

  const [tokenLoading, setTokenLoading] = useState(true);

  // const [progress, setProgress] = useState(0);
  // const [couponList, setCouponList] = useState([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [error, setError] = useState('');
  const [loader, setLoader] = useState(false);
  const [isDisabled, setDisabled] = useState(true);
  const [available, setAvailable] = useState(0);
  const [progress, setProgress] = useState(0);
  const [inc, setInc] = useState(0);

  // ---------------------------------------------------
  //               Get data from the store                          
  // ---------------------------------------------------

  const tokenQueryData = useQuery(GET_ALL_TOKENS);
  const pickupBasketAddedQuery = useQuery(GET_PICKUP_BASKET_ADDED, {
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
  })

  useEffect(() => {
    if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
      setTokenList(tokenQueryData.data.tokenAddedMany);
    }
  }, [tokenQueryData]);

  useEffect(() => {
    if (!pickupBasketAddedQuery.loading && pickupBasketAddedQuery.data && pickupBasketAddedQuery.data.pickUpBasketAddedNotificationMany) {
      const data = pickupBasketAddedQuery.data.pickUpBasketAddedNotificationMany.length ? pickupBasketAddedQuery.data.pickUpBasketAddedNotificationMany[0] : null;
      if (!data) return history.push('/pickupbasketplace');
      const metaData = data?.metadata as any || null
      const pickupBasket = { ...data, ...metaData };
      dispatch(
        getPickupBasketData({
          ...pickupBasket,
          openSymbol: getTokenSymbol(tokenList, pickupBasket.couponToGive),
        }),
      );
    }
  }, [pickupBasketAddedQuery, history, dispatch, tokenList])

  const { tokensDataList, errorWeb3, pickupBasketData, token, ethAddress } = useSelector(({ co3uum, chain, wallet }: any) => {
    return {
      pickupBasketData: chain.pickupBasketData,
      token: wallet.transfer.token,
      tokensDataList: chain.tokenList,
      errorWeb3: chain.errorWeb3,
      ethAddress: wallet.ethAddress,
    };
  });


  useEffect(() => {
    setDisabled(pickupBasketData?.owner === ethAddress)// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickupBasketData, ethAddress]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_LISTENER_API_URL}/pickUpBasket/${id}`)
      .then((res) => res.json())
      .then((res) => {
        const quantity = Number(res.couponQuantity);
        setAvailable(quantity)
        setProgress(100 - (quantity * 100 / (pickupBasketData?.productsAvailable || 1)))
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, pickupBasketData, inc]);

  //---------------------------------------------------------
  //        show list of coupons
  //---------------------------------------------------------

  useEffect(() => {
    if (tokensDataList.length > 0) {
      setTokenLoading(false);
      // setCouponList(tokensDataList.filter((tk: any) => tk.purpose === COUPON_PURPOSE));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensDataList, tokenLoading, errorWeb3]);


  //---------------------------------------------------------
  //          get pickupbasket data
  //---------------------------------------------------------

  useEffect(() => {
    if (state && state.pickupBasketData) {
      dispatch(getPickupBasketData({ ...state?.pickupBasketData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  //---  //---------------------------------------------------------
  //       partticipate in the crowdsale handler
  //---------------------------------------------------------

  // const kebabCase = (string: string) => string
  //   .replace(/([a-z])([A-Z])/g, "$1-$2")
  //   .replace(/[\s_]+/g, '-')
  //   .toLowerCase();

  const handleBuyNow = async () => {
    setLoader(true);
    const result: any = dispatch(collectPickupBasket(pickupBasketData.contractAddress))
    result.then((res: any) => {
      setLoader(false);
      setInc(inc + 1 );
      dispatch(
        setModalData(
          true,
          t('pickupbox_coupons.coupon_claimed'),
          t('common.transaction_complete'),
          'permission',
        ),
      );
    }).catch((err: any) => {
      setLoader(false);
      console.log(err, 'NewPickUpBox');
      dispatch(
        setModalData(
          true,
          t('pickupbox_coupons.coupons_failed'),
          err.message.split('\n')[0],
          'permission',
        ),
      );
    })
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

  const coupon = (): any | null => {
    if (!tokenList || !tokenList.length) return null;
    return tokenList.find((token: any) => token?.contractAddress === pickupBasketData?.couponToGive)
  }

  if (!pickupBasketData?.name) return null;

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
            </Flex>
            <Flex marginTop="10px" flexDirection="column">
            <Box sx={{
                width: '100%',
                backgroundColor: '#949494',
                maxWidth: '100%'
              }}>
                <Box sx={{
                  width: `${progress}%`,
                  backgroundColor: '#3752F5',
                  height: '5px',
                  maxWidth: '100%'
                }} />
              </Box>
              <Flex marginTop="5px" flexDirection="row" alignItems="flex-end" justifyContent="space-between" fontSize="14px" color="#3752F5" >
                <Text fontSize="16px" fontWeight={600}>{available} {t('pickupbasketplace.available')}</Text>
                <Box>
                  <Text display="inline-block" fontSize="18px" fontWeight={600} marginRight={1}>{pickupBasketData?.giveRatio}</Text>
                  <Text display="inline-block" fontSize="14px" fontWeight={700}>{getTokenSymbol(tokenList, pickupBasketData.couponToGive)}</Text>
                </Box>
              </Flex>
            </Flex>
            <Flex color="#757575" padding="25px 0px 30px" flexDirection="column">
              {coupon() && (
                <CouponCard coupon={coupon()} />
              )}
              <Text fontSize="16px" color="#757575">
                {pickupBasketData?.description}
              </Text>
            </Flex>
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
                        <a rel="noopener noreferrer" target="_blank" href={`https://firstlife.torino.projectco3.eu/wall/details/${pickupBasketData?.FLID}`}>
                          {t('token_details.firstlife')}
                        </a>
                      </Text>
                    </Flex>
                  </button>
                </Flex>
              </Text>
            </Flex>

            <Button
              disabled={isDisabled}
              onClick={handleBuyNow}
              className="buynow-btn"
              variant="primary"
              sx={{ position: 'relative', bottom: 1 }}
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
