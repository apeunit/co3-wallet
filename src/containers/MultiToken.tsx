import React, { useEffect, useRef, useState } from 'react';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenList from '../components/Tokens/TokensList/TokenList';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { motion } from 'framer-motion';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { AssetPopup } from '../components/AssetPopup';
import { PayPopup } from '../components/PayPopup';
import CouponList from '../components/Coupons/CouponsList/CouponList';
import Draggable from 'react-draggable';
import { getBound, getPos } from '../utils/sliderFtns';
import { useTranslation } from 'react-i18next';
import { COUPON_PURPOSE, SSO_LOGIN_URL, TOKEN_PURPOSE } from 'src/config';
import { setModalData } from 'src/redux/actions/Modal';
import { getApolloConnected } from 'src';
import EmptyImg from '../images/empty.png';
import { getMyProfileWithRoles } from 'src/api/co3uum';

const modalOptions = {
  hidden: { y: 200 },
  visible: { y: 0, transition: { delay: 0.6, ease: 'easeOut', duration: 0.23 } },
};

/**
 * Loads the token list from node and get its balance
 * @returns List of Tokens with balance
 */
const MultiToken: React.FC = () => {
  const dispatch = useDispatch();
  const dragger = useRef(null);
  const history = useHistory();
  const { t } = useTranslation();
  const recentbound = getBound();
  const recentPos = getPos();

  const [tokenList, setTokenList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [createToken, setCreateToken] = useState(false);
  const [createPayment, setCreatePayment] = useState(false);
  const [transition, setTransition] = useState(false);
  const [bound, setBound] = useState(getBound());
  const [controlledPosition, setControlledPosition] = useState(getPos());
  const [userRoles, setUserRoles] = useState<any>({});
  // const [loader, setLoader] = useState(true);



  // -------------------------------------------------------------------------- */
  //               Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { tokensDataList, errorWeb3, features, accessToken, modalOpen } = useSelector(
    ({ chain, pilot, co3uum, modal }: any) => {
      return {
        errorWeb3: chain.errorWeb3,
        features: pilot.features,
        accessToken: co3uum.accessToken,
        modalOpen: modal.isOpen,
        tokensDataList: chain.tokenList,
      };
    },
    shallowEqual,
  );

  // -------------------------------------------------------------------------- */
  //               filter tokens and coupons from tokendatalist                       
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (tokensDataList.length > 0) {
      setTokenLoading(false);
      setTokenList(tokensDataList.filter((tk: any) => tk.purpose === TOKEN_PURPOSE));
      setCouponList(tokensDataList.filter((tk: any) => tk.purpose === COUPON_PURPOSE));
    } else if ((tokenLoading && tokensDataList.length === 0) || (errorWeb3 && !errorWeb3?.connected)) {
      setTokenLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokensDataList, tokenLoading, errorWeb3]);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const onControlledDrag = (e: any, pos: any) => {
    if (tokenLoading === false && couponList.length === 0) {
      return;
    } else {
      const { x, y } = pos;
      setControlledPosition({ x, y });
    }
  };

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const BoundToTop = (val: any) => {
    if (val) {
      setBound({ left: 0, top: 0, right: 0, bottom: 0 });
      setControlledPosition({ x: 0, y: tokenList.length === 0 ? 60 : 0 });
    } else {
      setBound(recentbound);
      setControlledPosition(recentPos);
    }
    setTimeout(() => {
      setTransition(true);
    }, 1000);
  };

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    setBound(recentbound);
    setControlledPosition(recentPos);

    if (!tokenLoading) {
      if (couponList.length > 0) {
        BoundToTop(false);
      } else {
        BoundToTop(true);
      }
    }
    setTransition(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenLoading, couponList, tokenList]);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!getApolloConnected() && !modalOpen) {
      dispatch(
        setModalData(
          true,
          t('common.no_connectivity'),
          <Button
            height="30px"
            margin="20px auto 0px"
            width="130px"
            style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
            onClick={() => window.location.reload()}
          >
            {t('common.reload')}
          </Button>,
          'permission',
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getApolloConnected(), modalOpen]);

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const errorModalMsg = (title: string) => (
    <Flex width="max-content" margin="auto" className="error-modal">
      <IconButton height="26px" width="26px" icon="errorOutline" />
      <Text className="error-message">{t(title)}</Text>
    </Flex>
  );

  const errorModalBody = (title: string) => (
    <Flex flexDirection="column" width="max-content" margin="auto">
      <Text margin="10px 0px" width="275px">
        {t(title)}
      </Text>
      <Button
        className="modal-login-btn"
        height="30px"
        margin="20px auto 0px"
        width="130px"
        style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
        onClick={() => window.location.assign(SSO_LOGIN_URL)}
      >
        {t('multitoken.login')}
      </Button>
    </Flex>
  );

  // -------------------------------------------------------------------------- */
  //
  // -------------------------------------------------------------------------- */

  const displayLoginPopup = () => {
    try {
      dispatch(
        setModalData(
          true,
          errorModalMsg('multitoken.error_login'),
          errorModalBody('multitoken.error_login_msg'),
          'permission',
        ),
      );
    } catch (err) {
      console.log(err);
    }
  };


  const getUserdata = async () => {
    if (accessToken) {
      // setLoader(true);
      try {
        const data: any = await getMyProfileWithRoles(accessToken);
        if (data) {
          setUserRoles(data.roles);
          // setLoader(false);
        }
      } catch (error) {
        // setLoader(false);
      }
    }
    // else {
    //   setLoader(false);
    // }
  };

  useEffect(() => {
    getUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const hasAddRole = () => {
    if (process.env.NODE_ENV === 'development') return true;
    
    return !userRoles?.participant;
  }

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      backgroundColor="white"
    >
      <ToolBar className="head-title" position="absolute" color="background">
        <ToolBarTitle marginLeft="10px" fontSize="20px" color="dark">
          {t('multitoken.label')}
        </ToolBarTitle>
      </ToolBar>

      <Flex className="pending-token" />

      <Flex flexDirection="column" style={{ overflow: 'hidden' }}>
        <Flex flexDirection="column" flex="1">
          <ActionButtonGroup
            alignItems="flex-start"
            marginBottom={6}
            color="background"
            sx={{ top: '135px', position: 'absolute' }}
            loading={tokenList === undefined || tokenLoading}
            buttons={[
              {
                icon: 'pay',
                iconColor: 'white',
                iconBg: 'primary',
                label: t('multitoken.pay'),
                labelColor: 'primary',
                color: 'primary',
                className: 'pay-btn',
                onClick: () => {
                  accessToken ? setCreatePayment(!createPayment) : displayLoginPopup()
                },
              },
              {
                icon: 'receive',
                label: t('multitoken.receive'),
                iconColor: 'white',
                iconBg: 'primary',
                labelColor: 'primary',
                color: 'primary',
                className: 'recieve-btn',
                onClick: () => {
                  history.replace('/receive');
                },
              },
              {
                icon: 'history',
                label: t('multitoken.history'),
                iconBorderColor: 'primary',
                iconBg: 'white',
                labelColor: 'primary',
                color: 'primary',
                className: 'txnhistory-btn',
                onClick: () => {
                  history.replace('/transaction-history');
                },
              },
            ]}
          />
          <Flex
            flexDirection="column"
            style={{ overflow: 'hidden' }}
            flex={couponList.length > 0 ? 1 : 'auto'}
            maxHeight={couponList.length > 0 ? 'auto' : 'max-content'}
            margin={`auto 0 75px 0`}
            className={`${transition ? 'dragger-wrapper' : ''} ${tokenList.length > 0 && tokenList.length <= 3 && couponList.length === 0 ? 'set-height' : ''}`}
          >
            <Draggable
              axis="y"
              handle=".handle"
              grid={[25, 25]}
              bounds={bound}
              ref={dragger}
              onDrag={onControlledDrag}
              position={controlledPosition}
            >
              <Flex
                flexDirection="column"
                style={{
                  position: 'relative',
                  zIndex: 12,
                  overflow: 'hidden',
                  flex: 1,
                }}
              >
                <motion.div initial="hidden" animate="visible" exit="hidden">
                  <motion.div variants={modalOptions}>
                    <Box
                      backgroundColor="background"
                      paddingTop={3}
                      sx={{
                        borderTopLeftRadius: 'r10',
                        borderTopRightRadius: 'r10',
                        flexGrow: 0,
                      }}
                      style={{
                        border: '1px solid #f0f0f0',
                        borderBottom: '1px solid #fff',
                        transition: 'all 0.24s ease-out',
                        height: '100%',
                      }}
                    >
                      <Box
                        padding="10px"
                        className="handle"
                        style={{ pointerEvents: tokensDataList.length === 0 ? 'none' : 'auto' }}
                      >
                        <Box
                          backgroundColor="gray200"
                          width="134px"
                          height="5px"
                          marginBottom={1}
                          margin="0 auto"
                          sx={{
                            borderRadius: 'full',
                            flexGrow: 0,
                          }}
                        />
                      </Box>
                      {hasAddRole() && <Flex justifyContent="flex-end" paddingX={6} height="35px">
                        {!tokenLoading && features.indexOf('createToken') > -1 && (
                          <IconButton
                            className="add-round-btn"
                            marginY={2}
                            size="s8"
                            backgroundColor={'black'}
                            color={'white'}
                            icon={'add'}
                            onClick={() =>
                              accessToken ? setCreateToken(!createToken) : displayLoginPopup()
                            }
                          />
                        )}
                      </Flex>
                      }
                      {!tokenLoading && tokensDataList.length === 0 && (tokenList.length === 0 && couponList.length === 0) ? (
                        <>
                          <Flex height="55vh" width="212px" margin="auto" flexDirection="column">
                            <Text width="195px" marginBottom="25px" textAlign="center">{t('multitoken.no_assets')}</Text>
                            <Image src={EmptyImg} />
                          </Flex>
                        </>
                      ) : (
                        <>
                          {(tokenLoading || tokenList.length > 0) && (
                            <>
                              <Flex alignItems="flex-start" paddingX={7}>
                                <Text fontFamily="sans" fontSize="18px" color={'lightGray'} textAlign="left">
                                  {t('multitoken.tokens')}
                                </Text>
                              </Flex>
                              <TokenList tokens={tokenList} tokenLoading={tokenLoading} />
                            </>
                          )}
                          {(tokenLoading || couponList.length > 0) && (
                            <>
                              <Box style={{ margin: '10px 10px' }}>
                                <Text
                                  fontFamily="sans"
                                  fontSize="18px"
                                  padding="0px 10px 5px"
                                  color={'lightGray'}
                                  textAlign="left"
                                >
                                  {t('multitoken.coupons_passes')}
                                </Text>
                                <CouponList tokens={couponList} tokenLoading={tokenLoading} />
                              </Box>
                            </>
                          )}
                        </>
                      )}
                    </Box>
                  </motion.div>
                </motion.div>
              </Flex>
            </Draggable>
          </Flex>
        </Flex>
      </Flex>
      <STFooter iconActive="walletIcon" />
      {createToken && <AssetPopup setCreateToken={setCreateToken} />}
      {createPayment && <PayPopup setCreatePayment={setCreatePayment} />}
    </Flex>
  );
};

export default MultiToken;
