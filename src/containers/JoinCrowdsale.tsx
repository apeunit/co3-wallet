import React, { useEffect, useState } from 'react';
import { Box, Button, Flex, Text } from 'rebass';
import TokenCard from '../components/Tokens/CreateTokens/TokenCard';
import { Slider } from '../components/Slider';
import IconButton from '../components/IconButton';
import { useHistory, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { joinCrowdsale, approveSender } from '../redux/actions/Chain';
import { setModalData } from '../redux/actions/Modal';
import { SearchHeader } from '../components/SearchHeader';
import Keyboard from '../components/Keyboard';
import InfoBar from '../components/InfoBar';
import AvatarBadge from '../components/AvatarBadge';
import { useTranslation } from 'react-i18next';
import Loading from '../components/Loading';
import { saveWebhookAPI } from 'src/utils/helper';
import { setToAddress, setTransferAmount, setTransferToken } from 'src/redux/actions/Wallet';
import _replace from 'lodash/replace';
import { BALANCE_NOTIFY_QUERY_TOKEN, GET_ALL_TOKENS } from 'src/api/middleware';
import { useLazyQuery, useQuery } from '@apollo/react-hooks';
import ErrorMsg from '../components/ErrorMsg';

const amountRegex = new RegExp('^[0-9]+([0-9]{1,2})?$');

const JoinCrowdsale = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [loader, setLoader] = useState(false);
    const [coupons, setCoupons] = useState('1');
    const [showNumberPad, setShowNumberPad] = useState(true);
    const [maxCap, setMaxCap] = useState(1);
    const [acceptRatio, setAcceptRatio] = useState(1);
    const [tokenList, setTokenList] = useState([]);
    const [tokenData, setTokenData] = useState<any>({});

    const { amount, token, to, ethAddress } = useSelector(({ wallet }: any) => {
        return {
            amount: wallet.transfer.amount,
            token: wallet.transfer.token,
            to: wallet.transfer.to,
            ethAddress: wallet.ethAddress,
        };
    });
    const tokenQueryData = useQuery(GET_ALL_TOKENS);
    const [tokenAmountQuery, { data }] = useLazyQuery(BALANCE_NOTIFY_QUERY_TOKEN);

    useEffect(() => {
        if (!tokenQueryData.loading && tokenQueryData.data && tokenQueryData.data.tokenAddedMany) {
            setTokenList(tokenQueryData.data.tokenAddedMany);
        }
    }, [tokenQueryData]);

    const errorModalMsg = (title: string) => (
        <Flex width="max-content" margin="auto" className="error-modal">
            <IconButton height="26px" width="26px" icon="errorOutline" />
            <Text className="error-message">{t(title)}</Text>
        </Flex>
    );

    const handlebackbtn = (_error: string) => {
        const params = new URLSearchParams(location.search);
        const callbackParam = params.get('callback');
        if (callbackParam) {
            window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'}_id=${t(
                _error,
            )}`;
        } else {
            history.push('/');
            dispatch(setModalData(false, 'permission'));
        }
    };

    const handleTap = (e: string) => {
        const amountString: string = `${coupons}${e}`;
        // console.log(crow)
        if (amountRegex.test(amountString) && Number(amountString) <= (maxCap / acceptRatio)) {
            setCoupons(Number(amountString).toString());
        }
    };

    const handleErase = () => {
        let amountString: string = coupons || '';
        if (amountString) {
            amountString = amountString.slice(0, -1) || '0';
            setCoupons(amountString);
        }
    };

    const handleConfirm = () => {
        const value = Number(coupons);
        if(value < 1) return false;
        const total = Math.round(value * acceptRatio);
        dispatch(setTransferAmount(Number(total / 100).toString()));
        setShowNumberPad(false)
    };

    const errorModalBody = (title: string, btntitle: string, _error: string) => (
        <Flex flexDirection="column" width="max-content" margin="auto">
            <Text margin="10px 0px" width="275px">
                {t(title)}
            </Text>
            <Button
                className="modal-login-btn"
                height="30px"
                margin="20px auto 0px"
                width="170px"
                style={{ padding: '0px', borderRadius: '30px', background: '#3752F5' }}
                onClick={() => handlebackbtn(_error)}
            >
                {t(btntitle)}
            </Button>
        </Flex>
    );

    useEffect(() => {
        if (location.search) {
            const params = new URLSearchParams(location.search);
            const toParam = params.get('to');
            const tokenParam = params.get('token');
            const amountParam = params.get('amount');
            const callbackParam = params.get('callback');
            if (tokenParam && tokenList.length > 0) {
                const tokenNew: any = tokenList.find(
                    (tkn: any) =>
                        tkn.token_symbol === _replace(tokenParam, /['"]+/g, '') ||
                        tkn.symbol === _replace(tokenParam, /['"]+/g, ''),
                );
                if (tokenNew) {
                    tokenAmountQuery({
                        variables: {
                            accountPk: ethAddress,
                            contractAddress: tokenNew?.contractAddress,
                        },
                    });
                    if (tokenNew.logoURL && tokenNew.logoURL.includes('description')) {
                        const newtknData = tokenNew.logoURL && JSON.parse(tokenNew.logoURL);
                        setTokenData({ ...tokenNew, ...newtknData, logoURL: newtknData.logoURL });
                    } else {
                        setTokenData(tokenNew);
                    }
                    if (amountParam && tokenNew?.decimals === 0 && !Number.isInteger(amountParam)) {
                        dispatch(
                            setModalData(
                                true,
                                errorModalMsg('payment.amount_coupon_error'),
                                errorModalBody(
                                    'payment.amount_coupon_error_msg',
                                    `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`,
                                    'payment.amount_coupon_error',
                                ),
                                'permission',
                                false,
                            ),
                        );

                        return;
                    }
                } else {
                    params.delete('token');
                    params.delete('token');
                    dispatch(
                        setModalData(
                            true,
                            errorModalMsg('payment.token_error'),
                            errorModalBody(
                                '',
                                `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`,
                                'payment.token_error',
                            ),
                            'permission',
                            false,
                        ),
                    );
                }
            }
            toParam && dispatch(setToAddress(_replace(toParam, /['"]+/g, '')));
            if (amountParam && (!Number(amountParam) || Number(amountParam) < 0)) {
                dispatch(
                    setModalData(
                        true,
                        errorModalMsg('payment.amount_error'),
                        errorModalBody(
                            'payment.amount_negative_error_msg',
                            `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`,
                            'payment.amount_error',
                        ),
                        'permission',
                        false,
                    ),
                );

                return;
            }
            if (amountParam && tokenData?.decimals === 0 && !Number.isInteger(amountParam)) {
                dispatch(
                    setModalData(
                        true,
                        errorModalMsg('payment.amount_coupon_error'),
                        errorModalBody(
                            'payment.amount_coupon_error_msg',
                            `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`,
                            'payment.amount_coupon_error',
                        ),
                        'permission',
                        false,
                    ),
                );

                return;
            }
            amountParam && dispatch(setTransferAmount(amountParam));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search, tokenList]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const tokenParam = params.get('token');
        const maxCapParam = params.get('maxCap');
        const acceptRatioParam = params.get('acceptRatio');
        const amountParam = params.get('amount');
        const callbackParam = params.get('callback');

        setMaxCap(Number(maxCapParam));
        setAcceptRatio(Number(acceptRatioParam))
        
        if (tokenParam) {
            const amount = data ? (data?.balanceNotificationMany[0]?.amount || 0) : undefined;
            dispatch(
                setTransferToken({
                    ...tokenData,
                    amount,
                }),
            );
            if (
                amountParam &&
                amount < Number(amountParam)
            ) {
                dispatch(
                    setModalData(
                        true,
                        errorModalMsg('payment.amount_error'),
                        errorModalBody(
                            '',
                            `${callbackParam ? 'payment.go_back' : 'payment.back_home'}`,
                            'payment.amount_error',
                        ),
                        'permission',
                        false,
                    ),
                );

                return;
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenData, tokenAmountQuery, data]);

    const tokenAmount = () => {
        return token?.amount && token?.decimals === 2 ? token?.amount / 100 : token?.amount || 0;
    };

    const handleSendToken = () => {
        setLoader(true);
        if (!token) {
            return;
        }
        if (token?.amount < Number(amount)) {
            setLoader(false);
            setError(t('payment.amount_error'));
            dispatch(
                setModalData(true, t('payment.payment_failed'), t('payment.amount_error'), 'permission'),
            );

            return;
        }
        let callbackParam: string | null;
        let webHookParam: string | null;
        if (location.search) {
            const params = new URLSearchParams(location.search);
            callbackParam = params.get('callback');
            webHookParam = params.get('webhook');
        }
        if (token && Object.keys(token) && Object.keys(token).length && Number(amount) && to) {
            /**
             * TODO: check if these copy/conversion ops are needed
             */
            const receipt: any = dispatch(approveSender(token, to, amount));
            receipt
                .then(async (res: any) => {
                    const result = await dispatch(joinCrowdsale(token, to, amount));
                    console.log(result);
                    if (callbackParam) {
                        window.location.href = `${callbackParam}${callbackParam.includes('?') ? '&' : '?'}_id=${res.transactionHash
                            }`;
                    }
                    if (webHookParam) {
                        await saveWebhookAPI(webHookParam, res.transactionHash, res);
                    }
                    setLoader(false);
                    history.push('/');
                    dispatch(
                        setModalData(
                            true,
                            t('payment.payment_info'),
                            t('common.transaction_complete'),
                            'permission',
                        ),
                    );
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
                    console.log(err, 'confirm payment');
                    dispatch(
                        setModalData(
                            true,
                            t('payment.payment_failed'),
                            err.message.split('\n')[0],
                            'permission',
                        ),
                    );
                });
        } else if (!token || !to) {
            setTimeout(() => {
                setLoader(false);
                dispatch(
                    setModalData(
                        true,
                        t('payment.payment_failed'),
                        t(`payment.${!token ? 'token' : 'to'}_error`),
                        'permission',
                    ),
                );
            }, 2000);
        }
    };
    const { state }: any = history.location;

    return (
        <Flex
            backgroundColor="white"
            flexDirection="column"
            height="100vh"
            width="100%"
            justifyContent="space-between"
        >
            <Loading loader={loader} />
            <Box style={{ width: '100%' }}>
                <SearchHeader back={(state && state.from) || '/payment'} to={to} />
                <InfoBar>
                    <Text variant="base">{t('common.from')}</Text>
                    <AvatarBadge image={token && token.logoURL} label={token && token.name} />
                </InfoBar>
            </Box>
            {!showNumberPad ? (
                <Flex flexDirection="column" margin={5}>
                    <TokenCard
                        icon={token?.logoURL || ''}
                        name={token?.name || ''}
                        symbol={token?.token_symbol || token?.symbol || ''}
                        amount={tokenAmount()}
                    />
                    <Flex marginTop="10px" justifyContent="space-between">
                        <Text fontSize="12px">{t('payment.price')}</Text>
                        <Text fontSize="16px">{acceptRatio / 100}</Text>
                    </Flex>
                    <Flex marginTop="10px" justifyContent="space-between">
                        <Text fontSize="12px">{t('payment.coupons')}</Text>
                        <Text fontSize="16px">{coupons}</Text>
                    </Flex>
                    <Flex marginTop="15px" justifyContent="space-between">
                        <Text fontSize="18px">{t('payment.amount')}</Text>
                        <Text fontSize="40px">{amount}</Text>
                    </Flex>
                </Flex>
            ) : (
                <Box>
                    <Box marginTop="10px" paddingX={7}>
                        <Text fontSize="20px">{t('payment.coupons')}</Text>
                        <Text fontSize="12px" opacity={0.5}>{t('payment.max')} {maxCap / acceptRatio}</Text>
                    </Box>
                    <Text
                        marginTop="auto"
                        alignSelf="flex-end"
                        paddingX={7}
                        paddingY={8}
                        variant="headingX2l"
                    >
                        {coupons || 0}
                    </Text>
                    <Keyboard
                        marginBottom={10}
                        handleTap={handleTap}
                        handleErase={handleErase}
                        handleConfirm={handleConfirm}
                        disbaleConfirm={true}
                    />
                </Box>
            )}

            {error ? (
                <Flex
                    flexDirection="row"
                    paddingY={10}
                    marginTop="65px"
                    justifyContent="space-around"
                    width="100%"
                >
                    <ErrorMsg
                        style={{
                            opacity: '0.8',
                            position: 'absolute',
                            top: '88%',
                            transform: 'translateX(-50%)',
                            pointerEvents: 'none',
                        }}
                        title={error}
                        type="error"
                    />
                </Flex>
            ) : !showNumberPad && (
                <Flex flexDirection="row" paddingY={10} justifyContent="space-around" width="100%">
                    <IconButton
                        onClick={() => {
                            setShowNumberPad(true)
                        }}
                        size="s14"
                        icon="dialpad"
                        color="#8E949E"
                        backgroundColor="#ffffff"
                        sx={{
                            borderRadius: 'full',
                            borderColor: '#F1F3F6',
                            borderWidth: '2px',
                            borderStyle: 'solid',
                        }}
                    />
                    <Slider
                        title={t('payment.slide_to_send')}
                        bgColor="#F1F3F6"
                        btnColor="blue600"
                        txtColor="#8E949E"
                        dragEnd={handleSendToken}
                        onClick={handleSendToken}
                    />
                </Flex>
            )}
        </Flex>
    );
};
export default JoinCrowdsale;
