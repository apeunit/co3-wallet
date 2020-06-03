import React, { useEffect, useRef, useState } from 'react';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenList from '../components/TokenList';
import { Box, Flex, Text } from 'rebass';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTransactionsHistory, loadTokenBalanceByList } from '../redux/actions/Chain';
import { useHistory } from 'react-router-dom';
import _merge from 'lodash/merge';
import { motion } from 'framer-motion';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { AssetPopup } from '../components/AssetPopup';
import PendingTokenItem from '../components/SingleTokenComponents/PendingTokenItem';
import CouponList from '../components/CouponList';
import Draggable from 'react-draggable';
import { getBound, getPos } from '../utils/sliderFtns';

const modal = {
  hidden: { y: 200 },
  visible: { y: 0, transition: { delay: 0.6, ease: 'easeOut', duration: 0.23 } },
};

/**
 * Loads the token list from node and get its balance
 * @returns List of Tokens with balance
 */
const MultiToken: React.FC = () => {
  const recentbound = getBound();
  const recentPos = getPos();
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

  const { tokenLoading, tokenList, ethAddress, user: userObj } = useSelector(
    ({ chain, wallet, user }: any) => {
      return {
        tokenList: chain.tokenList,
        ethAddress: wallet.ethAddress,
        tokenLoading: chain.tokenLoading,
        user,
      };
    },
  );
  const history = useHistory();
  const dispatch = useDispatch();

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
      setControlledPosition({ x: 0, y: 0 });
    } else {
      setBound(recentbound);
      setControlledPosition(recentPos);
    }
    setTimeout(() => {
      setTransition(true);
    }, 1000);
  };

  useEffect(() => {
    if (tokenList.length > 0) {
      // Load user balance for all the tokens return from TokenFactory.
      // If the env is development set the owner address to
      // `devAddress` define in env else provide the memonic address to the  `loadTokenBalanceByList`
      dispatch(loadTokenBalanceByList(tokenList, ethAddress));
      dispatch(fetchTransactionsHistory());
      tokenList.map((token: any) =>
        _merge(token, {
          image: token.logoURL,
        }),
      );
    }
  }, [tokenList, ethAddress, dispatch]);

  useEffect(() => {
    let _coupons;
    let _tokens;

    setBound(recentbound);
    setControlledPosition(recentPos);

    if (tokenLoading === false) {
      _coupons =
        tokenList &&
        tokenList.find(
          (tkn: any) =>
            ((tkn.amount && tkn.amount > 0) || tkn.owner === ethAddress) &&
            parseInt(tkn.decimals.toString(), 10) === 0,
        );

      _tokens =
        tokenList &&
        (tokenList.find((tkn: any) => tkn.owner === ethAddress) ||
          tokenList.find((tkn: any) => tkn.amount && tkn.amount > 0)) &&
        tokenList.find((tkn: any) => tkn.decimals > 0);

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

  const { state } = history.location as any;

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      backgroundColor="white"
    >
      <ToolBar color="background">
        <IconButton onClick={() => history.push('/import-privatekey')} icon="menu" color="dark" />
        <ToolBarTitle fontSize="18px" color="dark">
          Wallet
        </ToolBarTitle>
        <IconButton icon="ranking" color="dark" />
        <IconButton icon="notifications" dot={true} color="dark" />
      </ToolBar>

      {userObj &&
        userObj.features.indexOf('createToken') > -1 &&
        state &&
        state.pendingToken &&
        state.pendingToken.length > 0 &&
        state.pendingToken.map((token: any, index: number) => (
          <PendingTokenItem key={index} token={token} subtitle="Creating Tokens..." />
        ))}
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
                  label: 'Pay',
                  labelColor: 'primary',
                  color: 'primary',
                  onClick: () => {
                    history.replace('/scan');
                  },
                },
                {
                  icon: 'receive',
                  label: 'Receive',
                  iconColor: 'white',
                  iconBg: 'primary',
                  labelColor: 'primary',
                  color: 'primary',
                  onClick: () => {
                    history.replace('/receive');
                  },
                },
                {
                  icon: 'history',
                  label: 'History',
                  iconBorderColor: 'primary',
                  iconBg: 'white',
                  labelColor: 'primary',
                  color: 'primary',
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
                <motion.div variants={modal}>
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
                      {userObj && userObj.features.indexOf('createToken') > -1 && (
                        <IconButton
                          marginY={2}
                          size="s8"
                          backgroundColor={'black'}
                          color={'white'}
                          icon={'add'}
                          onClick={() => setCreateToken(!createToken)}
                        />
                      )}
                    </Flex>
                    <Flex alignItems="flex-start" paddingX={7} paddingBottom="14px">
                      <Text fontFamily="sans" fontSize="18px" color={'lightGray'} textAlign="left">
                        {`Tokens & Discounts`}
                      </Text>
                    </Flex>
                    <TokenList tokens={tokenList} />
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
                        {`Coupons & Passes`}
                      </Text>
                      <CouponList tokens={tokenList} />
                    </Box>
                  </Box>
                </motion.div>
              </motion.div>
            </Flex>
          </Flex>
        </Draggable>
      </Flex>
      <STFooter />
      {createToken && <AssetPopup setCreateToken={setCreateToken} />}
    </Flex>
  );
};

export default MultiToken;
