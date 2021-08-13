import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from '../../../app/rootReducer';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { getOngoingAudits } from '../../../slices/auditSlice';
import { BaseMap } from '../../../components/Maps/BaseMap';
import { AuditCard } from '../../../components/AuditCard';

interface IStakeholderDashboardProps {}

const StakeholderDashboard: React.FC<IStakeholderDashboardProps> = () => {
  const dispatch = useDispatch();
  const { audit, user, audits, finishedAudits } = useSelector(
    (state: RootState) => {
      return {
        audit: state.audit.audit,
        audits: state.audit.audits,
        finishedAudits: state.audit.finishedAudits,
        user: state.auth.user,
      };
    },
    shallowEqual
  );
  useEffect(() => {
    dispatch(getOngoingAudits());
    //dispatch(getComplete)
    return () => {};
  }, []);

  let renderedAudits;
  if (audits.length > 0) {
    renderedAudits = audits.map((audit) => {
      return (
        <Grid item xs={12} md={12} key={audit.id}>
          <AuditCard audit={audit} />
        </Grid>
      );
    });
  } else if (audits.length == 0) {
    renderedAudits = 'No audit found!';
  } else {
    renderedAudits = '';
  }

  return (
    <div>
      <Container style={{ padding: 0 }}>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={12}>
            <BaseMap />
          </Grid>
          <Grid item xs={12} md={12} style={{ margin: '1em' }}>
            <Paper
              style={{
                padding: '1em',
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: '2px solid #038175',
              }}
            >
              <Typography
                variant="h6"
                style={{
                  fontWeight: 'bold',
                  fontFamily: 'Gotham',
                }}
              >
                Ongoing Audits
              </Typography>
              <Grid container spacing={1}>
                {renderedAudits}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default StakeholderDashboard;
