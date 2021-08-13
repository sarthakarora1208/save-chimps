import React, { useEffect } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import { PageWrapper } from '../../../components/PageWrapper';
import formStyles from '../../../assets/jss/components/formStyles';
import { getAuditById } from '../../../slices/auditSlice';
import EnhancedAddOrEditRevisionRequestForm from './EnhancedAddOrEditRevisionRequestForm';
import {
  setImageBinary,
  setIsSketchOnMapModalOpen,
} from '../../../slices/revisionRequestSlice';
import { SketchOnMapModal } from './SketchOnMapModal';
import EditIcon from '@material-ui/icons/Edit';

interface IAddOrEditRevsionRequestProps {}

const useStyles = makeStyles(formStyles);

const AddOrEditRevsionRequest: React.FC<IAddOrEditRevsionRequestProps> = () => {
  const classes = useStyles();
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const { auditId } = useParams<{ auditId: string }>();
  const { audit, imageBinary, s3URL } = useSelector((state: RootState) => {
    return {
      audit: state.audit.audit,
      imageBinary: state.revisionRequest.imageBinary,
      s3URL: state.revisionRequest.s3URL,
    };
  }, shallowEqual);
  useEffect(() => {
    if (!audit) {
      dispatch(getAuditById(auditId));
    }
    if (imageBinary === '') {
      dispatch(setIsSketchOnMapModalOpen(true));
    }
  }, [dispatch, audit, auditId, imageBinary, s3URL]);

  return (
    <div>
      <SketchOnMapModal />
      <Container style={{ padding: 0 }}>
        <Grid container direction="row" justifyContent="center">
          <Grid item xs={12} md={6} style={{ position: 'relative' }}>
            <img src={s3URL} alt="sketch" width={'100%'} height={'100%'}></img>
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.formWrapper}>
              <Typography variant="h6" className={classes.typography}>
                REVISION REQUEST
              </Typography>
              <Typography variant="body1">
                This request (along with map data) for {audit ? audit.name : ''}{' '}
                audit will be sent to {audit ? audit.startedBy!.name : ''} for
                approval. You can also add the notes/comments to the request.
              </Typography>

              <EnhancedAddOrEditRevisionRequestForm />
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default AddOrEditRevsionRequest;
{
  /* <Tooltip title="Change Sketch Map" aria-label="add">
              <EditIcon
                style={{
                  position: 'absolute',
                  top: '2px',
                  right: '2px',
                  width: '36px',
                  height: '36px',
                  border: '2px solid #038175',
                  color: '#038175',
                }}
                onClick={() => {
                  dispatch(setIsSketchOnMapModalOpen(true));
                }}
              />
            </Tooltip> */
}
