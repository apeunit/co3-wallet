import React, { useEffect, useState } from 'react';
import { Button, Flex, Text } from 'rebass';
import ImageCard from 'src/components/ImageCard';
import FramerSlide from '../components/FrameMotion/Slide';
import IconButton from '../components/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import '../assets/styles/NewToken.css';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Moment from 'react-moment';

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const CrowdsaleDetail: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const [progress, setProgress] = useState(0);

  const { crowdsaleData } = useSelector(({ chain }: any) => {
    return {
      crowdsaleData: chain.crowdsaleData,
    };
  });

  useEffect(() => {
    setProgress(0);
    console.log(crowdsaleData, 'crowdsaleData');
    if (!crowdsaleData || crowdsaleData === null) {
      history.push('/marketplace');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuyNow = () => {
    history.push(
      `/tx?to=${crowdsaleData?.contractAddress}&&token=${crowdsaleData?.crowdSymbol}&&amount=${crowdsaleData?.giveRatio}`,
    );
  };

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
        <Text>Marketplace</Text>
        <IconButton onClick={() => history.push('/')} sx={{ cursor: 'pointer' }} icon="close" />
      </Flex>
      <FramerSlide
        customStyle={{ height: '80%', position: 'absolute', top: '65px', width: '100%' }}
      >
        <Flex flexDirection="column" width="100%" justifyContent="start">
          <Flex width="100%" height="40%">
            <ImageCard
              padding="0px"
              name=""
              symbol=""
              icon={crowdsaleData?.icon}
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
                Goal: {crowdsaleData?.maxCap}
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
                  Closes <Moment fromNow={true}>{crowdsaleData?.end}</Moment>
                </Text>
              </Flex>
            </Flex>
            <Flex color="#757575" padding="25px 0px 30px">
              {/* TODO: get description from First Life */}
              Crowdsale details not available.
            </Flex>
            <Flex>
              <Text fontSize="12px" color="#757575">
                Started on <Moment format="dddd Do MMM YYYY">{crowdsaleData?.start}</Moment>
              </Text>
            </Flex>
            <Button
              onClick={handleBuyNow}
              my="25px"
              className="buynow-btn"
              variant="primary"
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
                  BUY NOW
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
