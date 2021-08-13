import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
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
import {
  deleteAudit,
  getAuditById,
  getOngoingAudits,
} from '../../../slices/auditSlice';
import { StyledTableCell } from '../../../components/StyledTableCell';
import { StyledTableRow } from '../../../components/StyledTableRow';
import { viewAudit } from '../../../constants/routes';
import GavelIcon from '@material-ui/icons/Gavel';
import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';

interface IOngoingAuditsProps {}

const OngoingAudits: React.FC<IOngoingAuditsProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { audits } = useSelector((state: RootState) => {
    return {
      audits: state.audit.audits,
      user: state.auth.user,
    };
  }, shallowEqual);
  useEffect(() => {
    dispatch(getOngoingAudits());
    return () => {};
  }, [audits.length]);
  let renderedAudits;
  if (audits.length > 0) {
    renderedAudits = audits.map((audit, index) => {
      return (
        <StyledTableRow key={index}>
          <StyledTableCell component="th" scope="row">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell>{audit.name}</StyledTableCell>
          <StyledTableCell>
            {new Date(audit.createdAt).toLocaleDateString()}
          </StyledTableCell>

          <StyledTableCell>{audit.auditors!.length}</StyledTableCell>
          <StyledTableCell>
            <IconButton
              onClick={(e) => {
                e.preventDefault();
                dispatch(getAuditById(audit.id));
                history.push(viewAudit(audit.id));
              }}
            >
              <GavelIcon />
            </IconButton>
          </StyledTableCell>
          <StyledTableCell>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={(e) => {
                e.preventDefault();
                dispatch(deleteAudit(audit.id));
              }}
              style={{ color: '#ff0000' }}
            >
              <DeleteIcon />
            </IconButton>
          </StyledTableCell>
        </StyledTableRow>
      );
    });
  } else if (audits.length == 0) {
    renderedAudits = (
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          You haven't started any audits yet.
        </StyledTableCell>
      </StyledTableRow>
    );
  } else {
    renderedAudits = (
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
        Ongoing Audits
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Audit Name</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>Auditors</StyledTableCell>
              <StyledTableCell>Manage</StyledTableCell>
              <StyledTableCell>Delete</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderedAudits}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default OngoingAudits;
