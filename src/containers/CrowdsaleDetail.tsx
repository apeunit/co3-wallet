import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from 'rebass';
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
import { getCrowdsaleData } from 'src/redux/actions/Chain';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const CrowdsaleDetail: React.FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const classes = useStyles();
  const history = useHistory();
  const [progress, setProgress] = useState(0);
  const { state }: any = history.location;
  const [countdown, setCountdown] = useState<any>('');
  const { crowdsaleData } = useSelector(({ chain }: any) => {
    return {
      crowdsaleData: chain.crowdsaleData,
    };
  });

  const then: any = moment(crowdsaleData?.end);
  const now: any = moment();

  useEffect(() => {
    if (state && state.crowdsaleData) {
      dispatch(getCrowdsaleData({ ...state?.crowdsaleData }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state])

  useEffect(() => {
    setProgress(0);
    setCountdown(moment(then - now));
    if (!crowdsaleData || crowdsaleData === null) {
      history.push('/marketplace');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuyNow = () => {
    history.push({
      pathname: `/tx`,
      search: `to=${crowdsaleData?.contractAddress}&token=${crowdsaleData?.crowdSymbol}&amount=${crowdsaleData?.giveRatio}`,
      state: { from: '/crowdsale-detail', crowdsaleData }
    });
  };

  useEffect(() => {
    let interval: any = null;
    interval = setInterval(() => {
      setCountdown(moment(then - now));
    }, 1000);

    return () => clearInterval(interval);
  }, [crowdsaleData, countdown, then, now]);

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
            <Flex>
              <Text fontSize="12px" color="#757575">
                {t('marketplace.started_on')}{' '}
                <Moment format="dddd Do MMM YYYY">{crowdsaleData?.start}</Moment>
              </Text>
            </Flex>
            <Button
              onClick={handleBuyNow}
              className="buynow-btn"
              variant="primary"
              sx={{ position: 'absolute', bottom: 0}}
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

export default CrowdsaleDetail;
