import React, { useEffect, useRef, useState } from 'react';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenList from '../components/Tokens/TokensList/TokenList';
import { Box, Button, Flex, Text } from 'rebass';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import _isEqual from 'lodash/isEqual';
import { motion } from 'framer-motion';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { AssetPopup } from '../components/AssetPopup';
import PendingTokenItem from '../components/SingleTokenComponents/PendingTokenItem';
import CouponList from '../components/Coupons/CouponsList/CouponList';
import Draggable from 'react-draggable';
import { getBound, getPos } from '../utils/sliderFtns';
import { BALANCE_NOTIFY_QUERY } from '../api/middleware';
import { useLazyQuery } from '@apollo/react-hooks';
import { useTranslation } from 'react-i18next';
import { LISTENER_POLL_INTERVAL, SSO_LOGIN_URL } from 'src/config';
import { setModalData } from 'src/redux/actions/Modal';
import { getApolloConnected } from 'src';

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
  const { t } = useTranslation();
  const history = useHistory();
  const recentbound = getBound();
  const recentPos = getPos();
  const [tokenList, setTokenList] = useState([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [createToken, setCreateToken] = useState(false);
  const [transition, setTransition] = useState(false);
  const [disableBtn, setDisableBtn] = useState(false);
  const position = getPos();
  const [bound, setBound] = useState(getBound());
  const dragger = useRef(null);
  const [controlledPosition, setControlledPosition] = useState(getPos());

  // -------------------------------------------------------------------------- */
  //                           Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { errorWeb3, ethAddress, features, accessToken, modalOpen } = useSelector(
    ({ chain, wallet, pilot, co3uum, modal }: any) => {
      return {
        errorWeb3: chain.errorWeb3,
        ethAddress: wallet.ethAddress,
        features: pilot.features,
        accessToken: co3uum.accessToken,
        modalOpen: modal.isOpen,
      };
    },
    shallowEqual,
  );

  const [balanceTokenQuery, { called, data }] = useLazyQuery(BALANCE_NOTIFY_QUERY, {
    fetchPolicy: 'no-cache',
    variables: {
      accountPk: ethAddress,
    },
  });

  useEffect(() => {
    if (ethAddress) {
      balanceTokenQuery();
      if (data) {
        const TokenInterval = setInterval(() => {
          !called && balanceTokenQuery();
        }, LISTENER_POLL_INTERVAL);

        return () => {
          clearInterval(TokenInterval);
        };
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [balanceTokenQuery, ethAddress]);

  useEffect(() => {
    if (data) {
      if (!_isEqual(tokenList, data.balanceNotificationMany)) {
        setTokenList(data.balanceNotificationMany);
        setTokenLoading(false);
      }
      if (data.balanceNotificationMany.length === 0 && errorWeb3) {
        setTokenLoading(false);
      }
    }
  }, [data, tokenList, tokenLoading, errorWeb3]);

  const onControlledDrag = (e: any, pos: any) => {
    if (tokenLoading === false && tokenList.length === 0) {
      return;
    } else {
      const { x, y } = pos;
      setControlledPosition({ x, y });
    }
  };

  const handlePosition = () => {
    if (controlledPosition.y >= position.y) {
      setControlledPosition({ x: 0, y: 0 });
    } else {
      setControlledPosition(position);
    }
  };

  const MoveUp = (e: any) => {
    if (tokenList.length === 0) {
      return;
    } else {
      !disableBtn && handlePosition();
    }
  };

  const BoundToTop = (val: any) => {
    if (val) {
      setBound({ left: 0, top: 0, right: 0, bottom: 0 });
      setControlledPosition({ x: 0, y: tokenList.length === 0 ? 250 : 0 });
    } else {
      setBound(recentbound);
      setControlledPosition(recentPos);
    }
    setTimeout(() => {
      setTransition(true);
    }, 1000);
  };

  useEffect(() => {
    let _coupons;
    let _tokens;

    setBound(recentbound);
    setControlledPosition(recentPos);

    const TCList =
      tokenList &&
      tokenList.map(
        (tkn: any) => ((tkn.amount && tkn.amount > 0) || tkn.owner === ethAddress) && tkn,
      );

    if (tokenLoading === false) {
      _coupons = TCList.length > 0 && TCList.find((tkn: any) => tkn.decimals === 0);
      _tokens = TCList.length > 0 && TCList.find((tkn: any) => tkn.decimals > 0);

      if (_tokens && _coupons) {
        BoundToTop(false);
        setDisableBtn(false);
      } else {
        BoundToTop(true);
        setDisableBtn(true);
      }
    }
    setTransition(false);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tokenLoading, tokenList.length, tokenList]);

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

  const { state } = history.location as any;

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      backgroundColor="white"
    >
      <ToolBar color="background">
        {/* <IconButton onClick={() => history.push('/app-settings')} icon="menu" color="dark" /> */}
        <ToolBarTitle marginLeft="10px" fontSize="20px" color="dark">
          {t('multitoken.label')}
        </ToolBarTitle>
      </ToolBar>
      {/* <img src={image}/> */}

      <Flex className="pending-token">
        {features.indexOf('createToken') > -1 &&
          state &&
          state.pendingToken &&
          state.pendingToken.length > 0 &&
          state.pendingToken.map((token: any, index: number) => (
            <PendingTokenItem
              key={index}
              token={token}
              subtitle={t('multitoken.creating_tokens')}
            />
          ))}
      </Flex>

      <Flex
        flexDirection="column"
        style={{ overflow: 'hidden' }}
        flex={tokenList.find((tkn: any) => tkn.decimal === '0') ? 1 : 'auto'}
        maxHeight={tokenList.find((tkn: any) => tkn.decimal === '0') ? 'auto' : 'max-content'}
        margin="auto 0 0 0"
        className={transition ? 'dragger-wrapper' : ''}
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
          <Flex flexDirection="column" flex="1">
            <ActionButtonGroup
              alignItems="flex-start"
              marginBottom={6}
              color="background"
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
                    history.replace('/scan');
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
              style={{
                position: 'relative',
                zIndex: 0,
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
                      padding="20px"
                      className="handle"
                      style={{ pointerEvents: tokenList.length === 0 ? 'none' : 'auto' }}
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
                    <Flex justifyContent="flex-end" paddingX={6} height="35px">
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
                    <Flex alignItems="flex-start" paddingX={7} paddingBottom="14px">
                      <Text fontFamily="sans" fontSize="18px" color={'lightGray'} textAlign="left">
                        {t('multitoken.tokens_discounts')}
                      </Text>
                    </Flex>
                    <TokenList tokens={tokenList} tokenLoading={tokenLoading} />
                    <Box style={{ borderTop: '1px solid #f0f0f0', margin: '20px 20px' }}>
                      <Flex justifyContent="center" alignItems="center">
                        <div role="button" onClick={MoveUp}>
                          <IconButton
                            marginY={2}
                            size="s8"
                            backgroundColor={'#fff'}
                            color={'#f0f0f0'}
                            icon={'arrowDown'}
                            style={{ border: '1px solid #f0f0f0', margin: '-17px 0 0' }}
                            rounded={true}
                          />
                        </div>
                      </Flex>
                      <Text
                        fontFamily="sans"
                        fontSize="18px"
                        padding="14px 0 10px"
                        color={'lightGray'}
                        textAlign="left"
                      >
                        {t('multitoken.coupons_passes')}
                      </Text>
                      <CouponList tokens={tokenList} tokenLoading={tokenLoading} />
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            </Flex>
          </Flex>
        </Draggable>
      </Flex>
      <STFooter iconActive="walletIcon" />
      {createToken && <AssetPopup setCreateToken={setCreateToken} />}
    </Flex>
  );
};

export default MultiToken;
