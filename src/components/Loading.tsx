import React from 'react';
import { Backdrop, CircularProgress, makeStyles } from '@material-ui/core';

interface IProps {
  loader: boolean;
}

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

const Loading: React.FC<IProps> = ({ loader }) => {
  const classes = useStyles();

  return (
    <Backdrop className={classes.backdrop} open={loader}>
      <CircularProgress color="inherit" />
    </Backdrop>
  );
};

export default Loading;
