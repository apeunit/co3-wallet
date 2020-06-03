import React from 'react';
import { motion } from 'framer-motion';

const Slide = {
  hidden: { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { delay: 0.15 } },
};

const Inputstyle = {
  height: 'max-content',
  width: '100%',
  display: 'flex',
};

interface IProps {
  children: any;
}

const FramerSlide: React.FC<IProps> = ({ children }) => {
  return (
    <>
      <motion.div variants={Slide} transition={{ duration: 0.2 }} style={Inputstyle} >
        {children}
      </motion.div>
    </>
  );
};

export default FramerSlide;
