import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { getSignedDocumentsForAudit } from '../../../api/signedDocumentRequests';
import { RootState } from '../../../app/rootReducer';
import { BaseMap } from '../../../components/Maps/BaseMap';
import { viewFinalAudit } from '../../../constants/routes';
import {
  getAuditById,
  getSignedDocumentsAudit,
} from '../../../slices/auditSlice';
import { ViewSignedDocuments } from './ViewSignedDocuments';

interface IViewFinalAuditProps {}

const ViewFinalAudit: React.FC<IViewFinalAuditProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { auditId } = useParams<{ auditId: string }>();
  const { audit, signedDocuments } = useSelector((state: RootState) => {
    return {
      audit: state.audit.audit!,
      signedDocuments: state.audit.signedDocuments,
    };
  }, shallowEqual);

  useEffect(() => {
    if (!audit) {
      dispatch(getAuditById(auditId));
    }
  }, [audit]);
  return (
    <div style={{ margin: '0.5em', padding: '0.5em' }}>
      <Typography
        variant="h6"
        style={{
          fontWeight: 'bold',
          fontFamily: 'Gotham',
        }}
      >
        Finished Audit: {audit ? audit.name : 'audit name'}
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
                  primary={<Typography color="primary">End Date</Typography>}
                  secondary={
                    <Typography>
                      {new Date(
                        audit ? audit!.updatedAt : new Date()
                      ).toLocaleDateString()}
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  id={'audit-name'}
                  primary={<Typography color="primary">Map URL</Typography>}
                  secondary={
                    <Typography>
                      <a
                        href={audit ? audit!.finalMapUrl : ''}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {audit ? audit!.finalMapUrl : ''}
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
              <ListItem button>
                <ListItemText
                  id={'audit-name'}
                  primary={
                    <Typography color="primary">Final Report</Typography>
                  }
                  secondary={
                    <Typography>
                      This document will be sent to all the auditors for
                      signing.
                      <br />
                      <a
                        href={audit ? audit!.finalFileUrl : ''}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {audit ? audit!.finalFileUrl : ''}
                      </a>
                    </Typography>
                  }
                />
              </ListItem>
            </List>
          </Grid>
          <Grid xs={12} md={12} style={{ padding: '1em' }}>
            <ViewSignedDocuments />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ViewFinalAudit;
