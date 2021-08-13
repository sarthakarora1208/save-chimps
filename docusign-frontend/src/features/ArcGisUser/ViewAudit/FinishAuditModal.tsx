import React, { useRef, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import theme from '../../../app/theme';
import {
  finishAudit,
  setIsFinishAuditModalOpen,
} from '../../../slices/auditSlice';
import { Typography } from '@material-ui/core';
import mapDivStyles from '../../../assets/jss/components/mapDivStyles';
import { addMapImageToS3 } from '../../../slices/revisionRequestSlice';
import { BaseMapWithScreenshot } from '../../../components/Maps/BaseMapWithScreenshot';
import { ARCGIS_USER_DASHBOARD } from '../../../constants/routes';
import { setSuccessMsg } from '../../../slices/alertSlice';

const useStyles = makeStyles(mapDivStyles);

interface IFinishAuditModalProps {}

export const FinishAuditModal: React.FC<IFinishAuditModalProps> = ({}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const history = useHistory();

  const { open, audit } = useSelector((state: RootState) => {
    return {
      open: state.audit.isFinishAuditModalOpen,
      audit: state.audit.audit,
    };
  }, shallowEqual);

  useEffect(() => {
    return () => {};
  }, []);

  const handleClose = () => {
    dispatch(setIsFinishAuditModalOpen(false));
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        fullWidth={true}
        maxWidth={'lg'}
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          Finish Audit
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <DialogContentText id="alert-dialog-description">
            <div
              style={{
                width: '75%',
                margin: '0.5em auto',
                alignItems: 'center',
              }}
            >
              <BaseMapWithScreenshot />
              <br />
            </div>
            <Typography>
              All the auditors have approved the audit and all the revision
              requests have been resolved. Do you want to finish the audit and
              approve the map in the current state?
            </Typography>
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Button onClick={handleClose} style={{ color: 'red' }}>
            Not Now
          </Button>
          <Button
            color="primary"
            autoFocus
            onClick={() => {
              handleClose();
              if (audit) {
                dispatch(finishAudit(audit.id));
                dispatch(setSuccessMsg('Finished Audit!'));
                history.push(ARCGIS_USER_DASHBOARD);
              }
            }}
          >
            Finish
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
