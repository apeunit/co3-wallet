import React from 'react';
import { motion } from 'framer-motion';
import { Box, Button, Flex, Text } from 'rebass';
import ActionButtonGroup from '../components/ActionButtonGroup';
import { useHistory, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getUserIDName } from 'src/api/co3uum';
import { setModalData } from 'src/redux/actions/Modal';
import { useDispatch } from 'react-redux';
import { SSO_LOGIN_URL } from 'src/config';

const shade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15 } },
};

export const PayPopup = ({ setCreatePayment, state, title }: any) => {
  const { t } = useTranslation();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const errorModalBody = (title: string) => (
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
        onClick={() => window.location.assign(SSO_LOGIN_URL)}
      >
        {t('multitoken.login')}
      </Button>
    </Flex>
  );

  const handleoption = async (path: string) => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const accessTokenParam = params.get('access_token');
      try {
        const data: any = accessTokenParam && await getUserIDName(accessTokenParam);
        data &&
          history.push({
            pathname: path,
            search: location.search,
            state,
          })
      } catch (err) {
        dispatch(
          setModalData(
            true,
            t('common.token_expire'),
            errorModalBody('common.token_expire_msg'),
            'permission',
          ),
        );
      }
    } else {
      history.push({
        pathname: path,
        search: location.search,
        state,
      })
    }
  };

  return (
    <Box
      sx={{
        zIndex: '120',
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <motion.div initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.2 }}>
        <motion.div
          variants={shade}
          transition={{ duration: 0.2 }}
          onClick={() => setCreatePayment(false)}
        >
          <Flex
            justifyContent="center"
            alignItems="flex-end"
            size="100%"
            backgroundColor="overlay20"
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
            }}
          >
            <motion.div
              className="modal"
              variants={modal}
              style={{ width: '100%', position: 'absolute' }}
            >
              <Flex
                flexDirection="column"
                backgroundColor="white"
                width="100%"
                paddingX={7}
                sx={{
                  borderTopLeftRadius: 'r10',
                  borderTopRightRadius: 'r10',
                  boxShadow: 'base',
                }}
              >
                <Text paddingLeft={4} paddingY={9}>
                  {t(title || 'pay_popup.pay')}
                </Text>
                <ActionButtonGroup
                  paddingBottom={10}
                  marginBottom="auto"
                  buttons={[
                    {
                      icon: 'token',
                      label: t('pay_popup.qr_code'),
                      key: 'token',
                      iconColor: 'white',
                      iconBg: 'blue600',
                      className: 'add-token-btn',
                      onClick: () => {
                        handleoption(`/scan`);
                      },
                    },
                    {
                      icon: 'coupen',
                      label: t('pay_popup.search'),
                      key: 'coupon',
                      iconColor: 'white',
                      className: 'add-coupon-btn',
                      iconBg: 'blue600',
                      onClick: () => {
                        handleoption(`/search-user`);
                      },
                    },
                  ]}
                />
              </Flex>
            </motion.div>
          </Flex>
        </motion.div>
      </motion.div>
    </Box>
  );
};
