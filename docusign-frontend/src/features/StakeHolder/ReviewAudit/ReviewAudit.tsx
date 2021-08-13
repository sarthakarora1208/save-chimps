import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from '../../../app/rootReducer';
import { BaseMap } from '../../../components/Maps/BaseMap';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import RateReviewIcon from '@material-ui/icons/RateReview';
import Tooltip from '@material-ui/core/Tooltip';

import EditIcon from '@material-ui/icons/Edit';
import {
  Container,
  Grid,
  Typography,
  makeStyles,
  Button,
  List,
  ListItem,
  ListItemText,
} from '@material-ui/core';
import {
  addAuditors,
  getAuditById,
  setIsApproveMapModalOpen,
  setIsRequestChangesMapModalOpen,
} from '../../../slices/auditSlice';
import formStyles from '../../../assets/jss/components/formStyles';
import { RequestChangesMapModal } from './RequestChangesMapModal';
import { ApproveMapModal } from './ApproveMapModal';
import { approveAudit } from '../../../api/auditsRequests';
import { getRevisionRequestsForStakeholder } from '../../../slices/revisionRequestSlice';
import { AUDIT_STATE } from '../../../constants/models/audit';
import { setSuccessMsg } from '../../../slices/alertSlice';

const useStyles = makeStyles(formStyles);

interface IReviewAuditProps {}

const ReviewAudit: React.FC<IReviewAuditProps> = ({}) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { auditId } = useParams<{ auditId: string }>();
  const { audit, revisionRequests, user } = useSelector((state: RootState) => {
    return {
      audit: state.audit.audit,
      revisionRequests: state.revisionRequest.revisionRequests,
      user: state.auth.user,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!audit) {
      dispatch(getAuditById(auditId));
    }
    if (revisionRequests.length === 0) {
      dispatch(getRevisionRequestsForStakeholder());
    }
    if (
      audit &&
      user &&
      audit.approvedAuditors
        .map((auditor) => auditor.email)
        .includes(user.email)
    ) {
      dispatch(setSuccessMsg('You have already approved the audit!'));
    }
    return () => {};
  }, [dispatch, audit, auditId, revisionRequests.length]);
  let renderedButtons;
  if (
    audit &&
    user &&
    audit.approvedAuditors.map((auditor) => auditor.email).includes(user.email)
  ) {
    renderedButtons = (
      <Tooltip title="You have already approved the audit!">
        <Button className={classes.secondaryButton}>Approved</Button>
      </Tooltip>
    );
  } else {
    renderedButtons = (
      <div>
        <Typography variant="body2">
          You can either approve the map or request further changes in the range
          polygons
        </Typography>
        <Button
          startIcon={<ThumbUpIcon />}
          className={classes.secondaryButton}
          onClick={() => {
            dispatch(setIsApproveMapModalOpen(true));
          }}
          disabled={
            revisionRequests.length > 0 &&
            audit?.state === AUDIT_STATE.UNDER_REVIEW
          }
        >
          Approve map
        </Button>
        <Button
          startIcon={<RateReviewIcon />}
          className={classes.button}
          onClick={() => {
            dispatch(setIsRequestChangesMapModalOpen(true));
          }}
          disabled={revisionRequests.length > 0}
        >
          Request changes
        </Button>
      </div>
    );
  }
  return (
    <div>
      <RequestChangesMapModal />
      <ApproveMapModal />

      <Container style={{ padding: 0 }}>
        <Grid container direction="row" justifyContent="center">
          <Grid item xs={12} md={6}>
            <BaseMap />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.formWrapper}>
              <Typography variant="h6" className={classes.typography}>
                <EditIcon />
                &nbsp; REVIEW AUDIT
              </Typography>
              <List>
                <ListItem button>
                  <ListItemText
                    id={'audit-name'}
                    primary={
                      <Typography color="primary">Audit Name</Typography>
                    }
                    secondary={
                      <Typography>
                        {audit ? audit.name : 'audit name'}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem button>
                  <ListItemText
                    id={'audit-name'}
                    primary={
                      <Typography color="primary">Start Date</Typography>
                    }
                    secondary={
                      <Typography>
                        {new Date(
                          audit ? audit!.createdAt : new Date()
                        ).toLocaleDateString()}
                      </Typography>
                    }
                  />
                </ListItem>
                <ListItem button>
                  <ListItemText
                    id={'audit-name'}
                    primary={
                      <Typography color="primary">Started By</Typography>
                    }
                    secondary={
                      <Typography>
                        {audit && audit?.startedBy
                          ? audit.startedBy?.name
                          : 'jane doe'}{' '}
                        (
                        {audit && audit?.startedBy
                          ? audit!.startedBy!.email
                          : 'email'}
                        )
                      </Typography>
                    }
                  />
                </ListItem>
              </List>

              {renderedButtons}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default ReviewAudit;
