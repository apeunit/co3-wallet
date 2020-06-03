import React from 'react';
import { Box, Flex } from 'rebass';
import IconButton from '../IconButton';
import { Slider } from '../Slider';

interface IProps {
  lastStep: boolean;
  handleSteps: any;
  onbtnDrag: any;
}

const CreateTokenFooter: React.FC<IProps> = ({ lastStep, handleSteps, onbtnDrag }) => {
  return (
    <Box
      style={{
        position: 'absolute',
        bottom: '40px',
        width: '100%',
        left: '0',
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
              onClick={() => console.log('')}
              title="Slide to create"
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

export default CreateTokenFooter;
