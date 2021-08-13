import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { useHistory } from 'react-router';
import {
  approveAudit,
  setIsApproveMapModalOpen,
} from '../../../slices/auditSlice';
import theme from '../../../app/theme';
import { STAKEHOLDER_DASHBOARD } from '../../../constants/routes';

interface IApproveMapModalProps {}

export const ApproveMapModal: React.FC<IApproveMapModalProps> = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { open, audit } = useSelector((state: RootState) => {
    return {
      open: state.audit.isApproveMapModalOpen,
      audit: state.audit.audit,
    };
  }, shallowEqual);

  useEffect(() => {
    return () => {};
  }, [open]);

  const handleClose = () => {
    dispatch(setIsApproveMapModalOpen(false));
  };
  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          id="alert-dialog-title"
          style={{
            color: theme.palette.primary.dark,
            backgroundColor: theme.palette.primary.light,
          }}
        >
          Approve map
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <DialogContentText id="alert-dialog-description">
            Do you agree to the changes made by{' '}
            {audit ? audit.startedBy?.name : 'jane doe'} (
            {audit ? audit!.startedBy!.email : 'email'}) for the current Eastern
            Chimpanzee range map?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: theme.palette.primary.light,
          }}
        >
          <Button onClick={handleClose} style={{ color: 'red' }}>
            Disagree
          </Button>
          <Button
            onClick={() => {
              handleClose();
              if (audit) {
                dispatch(approveAudit(audit.id));
                history.push(STAKEHOLDER_DASHBOARD);
              }
            }}
            color="primary"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
