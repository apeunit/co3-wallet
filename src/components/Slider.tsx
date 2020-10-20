import React, { useRef } from 'react';
import { Box, Flex, Text } from 'rebass';
import IconButton from './IconButton';
import { motion, useMotionValue, useTransform } from 'framer-motion';

interface IProps {
  title: string;
  btnColor: string;
  bgColor: string;
  txtColor: string;
  onClick: any;
  dragEnd: any;
}
const isDev = process.env.NODE_ENV === 'development';

export const Slider: React.FC<IProps> = ({
  title,
  bgColor,
  btnColor,
  txtColor,
  onClick,
  dragEnd,
}) => {
  // tslint:disable-next-line: no-null-keyword
  const constraintsRef = useRef(null);
  const slideX = process.env.NODE_ENV === 'development' ? 120 : -118;
  const x = useMotionValue(slideX);
  const rotateY = useTransform(x, [0, 0, 0], [0, 0, 0], {
    clamp: false,
  });
  const handleSlide = (e: any) => {
    e.pageX > 270 && dragEnd();
  };

  return (
    <Flex
      justifyContent="center"
      marginBottom={4}
      backgroundColor={bgColor}
      ref={constraintsRef}
      alignItems="center"
      width="80%"
      sx={{ borderRadius: 'full' }}
    >
      <motion.div
        className="container"
        ref={constraintsRef}
        style={{
          rotateY,
          position: 'relative',
        }}
      >
        <motion.div
          className="item"
          drag="x"
          onDragEnd={handleSlide}
          dragConstraints={constraintsRef}
          style={{
            x,
            position: 'relative',
            zIndex: 11,
          }}
        >
          <IconButton
            onClick={isDev ? onClick : () => console.log("Creating")}
            size="s14"
            icon="next"
            width="56px"
            height="56px"
            className="next-step-btn"
            color={bgColor}
            backgroundColor={btnColor}
          />
        </motion.div>
        <Box
          width="200px"
          sx={{ textAlign: 'center', position: 'absolute', left: '50%', top: '50%' }}
          style={{ transform: 'translate(-50%,-50%)' }}
        >
          <Text
            fontSize="2"
            color={txtColor}
            style={{ pointerEvents: 'none', position: 'relative', zIndex: 0 }}
          >
            {title}
          </Text>
        </Box>
      </motion.div>
    </Flex>
  );
};
