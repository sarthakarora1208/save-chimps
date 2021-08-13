import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import {
  Button,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import { StyledTableCell } from '../../../components/StyledTableCell';
import { StyledTableRow } from '../../../components/StyledTableRow';
import { useHistory } from 'react-router-dom';
import formStyles from '../../../assets/jss/components/formStyles';
import { makeStyles } from '@material-ui/core/styles';
import EmojiEmotionsIcon from '@material-ui/icons/EmojiEmotions';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import {
  RevisionRequest,
  REVISION_REQUEST_STATE,
} from '../../../constants/models/revisionRequest';
import {
  deleteRevisionRequest,
  getRevisionRequestById,
  revisionRequestState,
} from '../../../slices/revisionRequestSlice';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { viewRevisionRequest } from '../../../constants/routes';
import theme from '../../../app/theme';

const useStyles = makeStyles(formStyles);

interface IViewRevisionRequestsProps {}

export const ViewRevisionRequests: React.FC<IViewRevisionRequestsProps> =
  ({}) => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const history = useHistory();
    const { audit } = useSelector((state: RootState) => {
      return {
        audit: state.audit.audit,
      };
    }, shallowEqual);
    let revisionRequests: RevisionRequest[] = [];
    if (audit && audit.revisionRequests) {
      revisionRequests = [...audit.revisionRequests];
    }

    useEffect(() => {
      return () => {};
    }, [audit]);

    let renderedRevisionRequests;
    if (revisionRequests.length > 0) {
      renderedRevisionRequests = revisionRequests.map(
        (revisionRequest, index) => {
          return (
            <StyledTableRow key={index}>
              <StyledTableCell component="th" scope="row">
                {index + 1}
              </StyledTableCell>
              <StyledTableCell>{revisionRequest.comments}</StyledTableCell>
              <StyledTableCell>
                <Button
                  href={revisionRequest.editedMapURL}
                  endIcon={<AttachmentIcon />}
                  target="_blank"
                ></Button>
              </StyledTableCell>
              <StyledTableCell>
                {revisionRequest.state === REVISION_REQUEST_STATE.OPEN ? (
                  <Button
                    startIcon={<RateReviewIcon />}
                    variant="text"
                    style={{ color: 'black' }}
                    onClick={() => {
                      dispatch(getRevisionRequestById(revisionRequest.id));
                      history.push(viewRevisionRequest(revisionRequest.id));
                    }}
                  >
                    Resolve
                  </Button>
                ) : (
                  <Button
                    variant="text"
                    startIcon={<EmojiEmotionsIcon />}
                    style={{ color: theme.palette.primary.main }}
                    disabled={true}
                  >
                    Resolved
                  </Button>
                )}
              </StyledTableCell>
              <StyledTableCell>
                <IconButton
                  edge="end"
                  aria-label="delete"
                  onClick={(e) => {
                    e.preventDefault();
                    dispatch(deleteRevisionRequest(revisionRequest.id));
                  }}
                  style={{ color: '#ff0000' }}
                  disabled={
                    revisionRequest.state === REVISION_REQUEST_STATE.RESOLVED
                  }
                >
                  <DeleteIcon />
                </IconButton>
              </StyledTableCell>
            </StyledTableRow>
          );
        }
      );
    } else if (revisionRequests.length === 0) {
      renderedRevisionRequests = (
        <StyledTableRow>
          <StyledTableCell component="th" scope="row">
            No revision requests found!
          </StyledTableCell>
        </StyledTableRow>
      );
    } else {
      renderedRevisionRequests = (
        <StyledTableRow>
          <StyledTableCell component="th" scope="row"></StyledTableCell>
        </StyledTableRow>
      );
    }
    return (
      <div>
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
            fontFamily: 'Gotham',
          }}
        >
          Revision Requests
        </Typography>
        <br />

        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No.</StyledTableCell>
                <StyledTableCell>Comments</StyledTableCell>
                <StyledTableCell>Sketch Map</StyledTableCell>
                <StyledTableCell>Action</StyledTableCell>
                <StyledTableCell>Delete</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderedRevisionRequests}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
