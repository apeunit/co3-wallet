import React from 'react';
import { Box, Flex } from 'rebass';
import IconButton from '../IconButton';
import { Slider } from '../Slider';
import { useTranslation } from 'react-i18next';

interface IProps {
  lastStep: boolean;
  handleSteps: any;
  onbtnDrag: any;
}

const CreateFooterStep: React.FC<IProps> = ({ lastStep, handleSteps, onbtnDrag }) => {
  const { t } = useTranslation();

  return (
    <Box
      style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        left: '0',
        height: '60px',
      }}
    >
      {!lastStep && (
        <Flex
          justifyContent="center"
          backgroundColor="blue600"
          style={{
            height: '56px',
            width: '56px',
            borderRadius: '50px',
            overflow: 'hidden',
            margin: '0 auto',
          }}
        >
          <IconButton
            icon="next"
            size="s14"
            color="white"
            onClick={handleSteps}
            marginBottom="-20px"
            className="next-step-btn"
          />
        </Flex>
      )}
      {lastStep && (
        <>
          <Flex marginRight="10px" marginBottom="-30px">
            <IconButton
              marginLeft={5}
              marginRight={2}
              icon="editIcon"
              onClick={handleSteps}
              size="s14"
              backgroundColor="#ffffff"
              sx={{
                borderRadius: 'full',
                borderColor: '#f1f3f6',
                borderWidth: '2px',
                borderStyle: 'solid',
              }}
              color="#cccccc"
            />
            <Slider
              dragEnd={onbtnDrag}
              onClick={onbtnDrag}
              title={t('common.slide_to_create')}
              bgColor="#F1F3F6"
              btnColor="blue600"
              txtColor="#8E949E"
            />
          </Flex>
        </>
      )}
    </Box>
  );
};

export default CreateFooterStep;
