import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { RootState } from '../../../app/rootReducer';
import { setIsRequestChangesMapModalOpen } from '../../../slices/auditSlice';
import { useHistory } from 'react-router';
import { addRevisionRequest } from '../../../constants/routes';
import theme from '../../../app/theme';

interface IRequestChangesMapModalProps {}

export const RequestChangesMapModal: React.FC<IRequestChangesMapModalProps> =
  () => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { open, audit } = useSelector((state: RootState) => {
      return {
        open: state.audit.isRequestChangesMapModalOpen,
        audit: state.audit.audit!,
      };
    }, shallowEqual);

    useEffect(() => {
      return () => {};
    }, [open]);

    const handleClose = () => {
      dispatch(setIsRequestChangesMapModalOpen(false));
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
            Request Map Changes
          </DialogTitle>
          <DialogContent
            style={{
              backgroundColor: theme.palette.primary.light,
            }}
          >
            <DialogContentText id="alert-dialog-description">
              You will be directed to a Sketch tool where you can draw new
              points, lines or polygons on the Eastern Chimpanzee ranges map. To
              request changes on the map, click on{' '}
              {<span style={{ color: theme.palette.primary.main }}>Agree</span>}
              .
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
                history.push(addRevisionRequest(audit.id));
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
