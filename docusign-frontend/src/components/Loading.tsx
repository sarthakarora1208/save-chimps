import React, { ReactNode } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core/styles';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../app/rootReducer';
import { Box, Typography } from '@material-ui/core';
import Logo from '../assets/images/Logo.svg';

const useStyles = makeStyles((theme) => ({
  backdrop: {
    zIndex: theme.zIndex.drawer + 1,
    color: '#fff',
  },
}));

interface ILoadingProps {
  children: ReactNode;
}
export const Loading: React.FC<ILoadingProps> = ({ children }) => {
  const classes = useStyles();
  const { authLoading, auditLoading, revisionRequestLoading } = useSelector(
    (state: RootState) => {
      return {
        authLoading: state.auth.loading,
        auditLoading: state.audit.loading,
        revisionRequestLoading: state.revisionRequest.loading,
      };
    },
    shallowEqual
  );
  return (
    <>
      <Backdrop
        className={classes.backdrop}
        open={authLoading || auditLoading || revisionRequestLoading}
      >
        <Box position="relative" display="inline-flex">
          <CircularProgress size={100} />
          <Box
            top={10}
            left={0}
            bottom={0}
            right={0}
            position="absolute"
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            <img src={Logo} height="50px" />
          </Box>
        </Box>
      </Backdrop>
      {children}
    </>
  );
};
