import React from 'react';
import { motion } from 'framer-motion';
import { Box, Flex, Text } from 'rebass';
import ActionButtonGroup from '../components/ActionButtonGroup';
import { useHistory } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const shade = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const modal = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.15 } },
};

export const AssetPopup = ({ setCreateToken }: any) => {
  const { t } = useTranslation();
  const history = useHistory();

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
      }}
    >
      <motion.div initial="hidden" animate="visible" exit="hidden" transition={{ duration: 0.2 }}>
        <motion.div
          variants={shade}
          transition={{ duration: 0.2 }}
          onClick={() => setCreateToken(false)}
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
            <motion.div className="modal" variants={modal} style={{ width: '100%' }}>
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
                <Text paddingLeft={4} paddingY={9}>{t('asset_popup.create_asset')}</Text>
                <ActionButtonGroup
                  paddingBottom={10}
                  marginBottom="auto"
                  buttons={[
                    {
                      icon: 'token',
                      label: t('asset_popup.token'),
                      key: 'token',
                      iconColor: 'white',
                      iconBg: 'blue600',
                      onClick: () => {
                        history.replace('/new-token');
                      },
                    },
                    {
                      icon: 'coupen',
                      label: t('asset_popup.coupon'),
                      key: 'coupon',
                      iconColor: 'white',
                      iconBg: 'blue600',
                      onClick: () => {
                        history.replace('/new-coupon');
                      },
                    },
                    {
                      icon: 'tag',
                      label: t('asset_popup.task'),
                      key: 'tag',
                      iconColor: 'white',
                      iconBg: 'blue600',
                      onClick: () => {
                        history.replace('/tagPage');
                      },
                    },
                    {
                      icon: 'history',
                      label: t('asset_popup.history'),
                      key: 'history',
                      iconColor: 'white',
                      iconBg: 'blue600',
                      onClick: () => {
                        history.replace('/historyPage');
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
