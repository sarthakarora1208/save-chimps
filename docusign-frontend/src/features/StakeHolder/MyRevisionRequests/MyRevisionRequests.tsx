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
import { getRevisionRequestsForStakeholder } from '../../../slices/revisionRequestSlice';
import { REVISION_REQUEST_STATE } from '../../../constants/models/revisionRequest';
import AttachmentIcon from '@material-ui/icons/Attachment';
import AssignmentLateIcon from '@material-ui/icons/AssignmentLate';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import { deleteRevisionRequest } from '../../../api/revisionRequestsRequests';

interface IMyRevisionRequestsProps {}

const MyRevisionRequests: React.FC<IMyRevisionRequestsProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();

  const { revisionRequests } = useSelector((state: RootState) => {
    return {
      revisionRequests: state.revisionRequest.revisionRequests,
    };
  }, shallowEqual);
  useEffect(() => {
    dispatch(getRevisionRequestsForStakeholder());
  }, [revisionRequests.length, dispatch]);

  let renderedRevisionRequests;
  if (revisionRequests.length > 0) {
    renderedRevisionRequests = revisionRequests.map(
      (revisionRequest, index) => {
        const { audit, requestedBy } = revisionRequest;
        return (
          <StyledTableRow key={index}>
            <StyledTableCell component="th" scope="row">
              {index + 1}
            </StyledTableCell>
            <StyledTableCell>{audit.name}</StyledTableCell>
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
                <Button variant="text" startIcon={<AssignmentLateIcon />}>
                  Open
                </Button>
              ) : (
                <Button variant="text" startIcon={<AssignmentTurnedInIcon />}>
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
          You haven't made a revision request yet
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
              <StyledTableCell>Audit Name</StyledTableCell>
              <StyledTableCell>Comments</StyledTableCell>
              <StyledTableCell>Sketch Map</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderedRevisionRequests}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default MyRevisionRequests;
