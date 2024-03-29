import React, { useEffect, useState } from 'react';
import ToolBar from '../components/ToolBar';
import IconButton from '../components/IconButton';
import ToolBarTitle from '../components/ToolBarTitle';
import ActionButtonGroup from '../components/ActionButtonGroup';
import TokenList from '../components/Tokens/TokensList/TokenList';
import { Box, Button, Flex, Image, Text } from 'rebass';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import STFooter from '../components/SingleTokenComponents/STFooter';
import { AssetPopup } from '../components/AssetPopup';
import { PayPopup } from '../components/PayPopup';
import CouponList from '../components/Coupons/CouponsList/CouponList';
import { useTranslation } from 'react-i18next';
import { COUPON_PURPOSE, SSO_LOGIN_URL, TOKEN_PURPOSE, BACKUP_WALLET } from 'src/config';
import { setModalData } from 'src/redux/actions/Modal';
import { getApolloConnected } from 'src';
import EmptyImg from '../images/empty.png';
import { getMyProfileWithRoles } from 'src/api/co3uum';


const backupWallet = localStorage.getItem('co3-app-backup') || BACKUP_WALLET;

/**
 * Loads the token list from node and get its balance
 * @returns List of Tokens with balance
 */
const MultiToken: React.FC = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();

  const [tokenList, setTokenList] = useState([]);
  const [couponList, setCouponList] = useState([]);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [createToken, setCreateToken] = useState(false);
  const [createPayment, setCreatePayment] = useState(false);
  const [userRoles, setUserRoles] = useState<any>({});
  // const [loader, setLoader] = useState(true);
  const [buttons, setButtons] = useState<any>([]);




  // -------------------------------------------------------------------------- */
  //               Get data from the store                          */
  // -------------------------------------------------------------------------- */

  const { tokensDataList, errorWeb3, accessToken, modalOpen } = useSelector(
    ({ chain, co3uum, modal }: any) => {
      return {
        errorWeb3: chain.errorWeb3,
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
      <Text className="error-modal-text" margin="10px 0px" width="275px">
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
  };

  useEffect(() => {
    getUserdata();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [accessToken]);

  const hasAddRole = () => {
    if (process.env.NODE_ENV === 'development') return true;
    return !userRoles?.participant;
  }

  useEffect(() => {
    const list = [{
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
        accessToken ? history.replace('/receive') : displayLoginPopup();
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
        accessToken ? history.replace('/transaction-history') : displayLoginPopup();
      },
    }];

    if (hasAddRole()) {
      list.push(
        {
          icon: 'add',
          label: t('multitoken.add'),
          iconBorderColor: 'primary',
          iconBg: 'white',
          labelColor: 'primary',
          color: 'primary',
          className: 'add-round-btn',
          onClick: () => {
            accessToken ? setCreateToken(!createToken) : displayLoginPopup()
          }
        })
    }
    setButtons(list)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRoles])

  return (
    <Flex
      flexDirection="column"
      justifyContent="space-between"
      height="100vh"
      backgroundColor="white"
    >
      <Flex flexDirection="column" style={{ overflow: 'hidden' }}>
        <Flex flexDirection="column">
          <ToolBar position="relative" color="background">
            <ToolBarTitle marginLeft="20px" paddingTop="10px" paddingBottom="10px" className="multitoken-title" fontSize="40px" color="#3752F5">
              {t('multitoken.label')}
            </ToolBarTitle>
          </ToolBar>
          <ActionButtonGroup
            className="action-buttons-group"
            alignItems="flex-start"
            marginLeft="12px"
            paddingBottom="20px"
            color="background"
            loading={tokenList === undefined || tokenLoading}
            buttons={buttons}
          />
        </Flex>
        {/* -------------------------------------------------------------- */}
        <Flex
          flexDirection="column"
          style={{ overflowY: 'scroll' }}>
          <Flex
            flexDirection="column"
            style={{
              position: 'relative',
              zIndex: 12,
              flex: 1,
            }}
          >
            <Box
              backgroundColor="background"
              style={{
                border: '1px solid #f0f0f0',
                borderBottom: '1px solid #fff',
                transition: 'all 0.24s ease-out',
                height: '100%',
              }}
            >
               {backupWallet !== 'true' && (
                           <Box style={{ padding: '10px 10px' }}>
                <Button
                  className="modal-login-btn"
                  margin="10px"
                  style={{ padding: '10px', borderRadius: '30px', background: '#F5E0E0', color: '#584848', border: '1px solid #DEB5B5' }}
                  onClick={() => history.replace('/new-wallet')}
                >
                  <Flex style={{ alignItems: "center" }}>
                    <div style={{ width: '20px', height: '20px', borderRadius: '50px', background: '#C73434', color: '#FFF2F2', border: '1px solid #DEB5B5' }}><Text fontSize={1}>!</Text></div>
                    <Text fontSize={1} padding="0 4px"><Flex><p>{t('multitoken.warning_1')}</p><p style={{ textDecoration: "underline", paddingLeft: "3px" }}>{t('multitoken.warning_2')}</p></Flex></Text>
                  </Flex>
                </Button>
              </Box>
                )}
              {!tokenLoading && tokensDataList.length === 0 && (tokenList.length === 0 && couponList.length === 0) ? (
                <>
                  <Flex height="55vh" width="212px" margin="auto" paddingTop={10} flexDirection="column">
                    <Text width="195px" marginBottom="25px" textAlign="center">{t('multitoken.no_assets')}</Text>
                    <Image src={EmptyImg} />
                  </Flex>
                </>
              ) : (
                <Box paddingTop={9} overflowY="scroll" paddingBottom="180px">
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
                      <Box style={{ padding: '10px 10px' }}>
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
                </Box>
              )}
            </Box>
          </Flex>
        </Flex>
      </Flex>
      <STFooter iconActive="walletIcon" />
      {accessToken && createToken ? <AssetPopup setCreateToken={setCreateToken} /> : ''}
      {accessToken && createPayment ? <PayPopup setCreatePayment={setCreatePayment} /> : ''}
    </Flex>
  );
};

export default MultiToken;
