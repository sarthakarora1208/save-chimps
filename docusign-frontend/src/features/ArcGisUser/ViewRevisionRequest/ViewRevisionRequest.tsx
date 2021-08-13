import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router';
import { RootState } from '../../../app/rootReducer';
import { makeStyles } from '@material-ui/core/styles';
import {
  getRevisionRequestById,
  resolveRevisionRequest,
} from '../../../slices/revisionRequestSlice';
import {
  Button,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@material-ui/core';
import CheckIcon from '@material-ui/icons/Check';
import { EditorMap } from '../../../components/Maps/EditorMap';

import formStyles from '../../../assets/jss/components/formStyles';
import {
  ARCGIS_USER_DASHBOARD,
  STAKEHOLDER_DASHBOARD,
} from '../../../constants/routes';

const useStyles = makeStyles(formStyles);

interface IViewRevisionRequestProps {}

const ViewRevisionRequest: React.FC<IViewRevisionRequestProps> = ({}) => {
  const classes = useStyles();
  const history = useHistory();

  const { revisionRequestId } = useParams<{ revisionRequestId: string }>();

  const dispatch = useDispatch();
  const { revisionRequest } = useSelector((state: RootState) => {
    return {
      revisionRequest: state.revisionRequest.revisionRequest,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!revisionRequest) {
      dispatch(getRevisionRequestById(revisionRequestId));
    }
    return () => {};
  }, [dispatch, revisionRequest, revisionRequestId]);
  return (
    <Container>
      <Typography
        variant="h6"
        style={{
          fontWeight: 'bold',
          fontFamily: 'Gotham',
        }}
      >
        View Revision Request
      </Typography>
      <br />
      <Grid container direction="row" justifyContent="center">
        <Grid item xs={12} md={12} style={{ margin: '0em 0em 2.5em 0em' }}>
          <EditorMap />
        </Grid>
        <Grid item xs={12} md={6}>
          <img
            src={revisionRequest ? revisionRequest.editedMapURL : ''}
            alt="sketch"
            width={'100%'}
            height={'100%'}
          ></img>
        </Grid>
        <Grid item xs={12} md={6} style={{ padding: '1em' }}>
          <List>
            <ListItem button>
              <ListItemText
                id={'audit-name'}
                primary={<Typography color="primary">Audit Name</Typography>}
                secondary={
                  <Typography>
                    {revisionRequest
                      ? revisionRequest.audit.name
                      : 'audit name'}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem button>
              <ListItemText
                id={'requested by'}
                primary={<Typography color="primary">Requested By</Typography>}
                secondary={
                  <Typography>
                    {revisionRequest
                      ? revisionRequest.requestedBy.name
                      : 'name'}
                    (
                    {revisionRequest
                      ? revisionRequest.requestedBy.email
                      : 'email'}
                    )
                  </Typography>
                }
              />
            </ListItem>
            <ListItem button>
              <ListItemText
                id={'requested by'}
                primary={<Typography color="primary">Comments</Typography>}
                secondary={
                  <Typography>
                    {revisionRequest ? revisionRequest!.comments : ''}
                  </Typography>
                }
              />
            </ListItem>
            <ListItem button>
              <ListItemText
                id={'requested by'}
                primary={<Typography color="primary">Attachments</Typography>}
                secondary={
                  <Typography>
                    {revisionRequest && revisionRequest!.attachment !== ''
                      ? revisionRequest.attachment
                      : 'None'}
                  </Typography>
                }
              />
            </ListItem>
            <Button
              startIcon={<CheckIcon />}
              className={classes.secondaryButton}
              variant="outlined"
              type="submit"
              onClick={() => {
                dispatch(resolveRevisionRequest());
                history.push(ARCGIS_USER_DASHBOARD);
              }}
            >
              Resolve Request
            </Button>
          </List>
        </Grid>
      </Grid>
    </Container>
  );
};
export default ViewRevisionRequest;
