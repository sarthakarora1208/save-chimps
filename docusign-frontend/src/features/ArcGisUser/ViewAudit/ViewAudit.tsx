import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { Container, Grid, Typography } from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from '../../../app/rootReducer';
import {
  getAuditById,
  setIsFinishAuditModalOpen,
} from '../../../slices/auditSlice';
import { BaseMap } from '../../../components/Maps/BaseMap';
import { ViewStakeholders } from './ViewStakeholders';
import { ViewRevisionRequests } from './ViewRevisionRequests';
import { FinishAuditModal } from './FinishAuditModal';
import { REVISION_REQUEST_STATE } from '../../../constants/models/revisionRequest';

interface IViewAuditProps {}

const ViewAudit: React.FC<IViewAuditProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auditId } = useParams<{ auditId: string }>();
  const { auditLoading, audit } = useSelector((state: RootState) => {
    return {
      auditLoading: state.audit.loading,
      audit: state.audit.audit!,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!audit) {
      dispatch(getAuditById(auditId));
    }
    let pendingRequestsLeft =
      audit &&
      audit.revisionRequests
        .map((revsionRequest) => revsionRequest.state)
        .includes(REVISION_REQUEST_STATE.OPEN);
    let isApprovedByAll =
      audit && audit.approvedAuditors.length === audit.auditors.length;

    if (!pendingRequestsLeft && isApprovedByAll) {
      dispatch(setIsFinishAuditModalOpen(true));
    }
    return () => {};
  }, [dispatch, audit]);

  if (audit) {
  }
  return (
    <div style={{ margin: '0.5em', padding: '0.5em' }}>
      <FinishAuditModal />
      <Typography
        variant="h6"
        style={{
          fontWeight: 'bold',
          fontFamily: 'Gotham',
        }}
      >
        {audit ? audit.name : 'audit name'}
      </Typography>
      <br />
      <Container style={{ padding: 0 }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item xs={12} md={6} style={{ padding: '1em' }}>
            <BaseMap />
          </Grid>
          <Grid item xs={12} md={6} style={{ padding: '1em' }}>
            <List>
              <ListItem button>
                <ListItemText
                  id={'audit-name'}
                  primary={<Typography color="primary">Audit Name</Typography>}
                  secondary={
                    <Typography>{audit ? audit.name : 'audit name'}</Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  id={'audit-name'}
                  primary={<Typography color="primary">Start Date</Typography>}
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
                    <Typography color="primary">Auditor Count</Typography>
                  }
                  secondary={
                    <Typography>
                      {audit ? audit.auditors!.length : 0}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  id={'audit-name'}
                  primary={
                    <Typography color="primary">Revision Requests</Typography>
                  }
                  secondary={
                    <Typography>
                      {audit && audit.revisionRequests
                        ? audit.revisionRequests.length
                        : 0}
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid xs={12} md={12} style={{ padding: '1em' }}>
            <ViewStakeholders />
          </Grid>
          <Grid xs={12} md={12} style={{ padding: '1em' }}>
            <ViewRevisionRequests />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default ViewAudit;
