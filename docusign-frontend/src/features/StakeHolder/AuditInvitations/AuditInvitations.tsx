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
import { getAuditById, getOngoingAudits } from '../../../slices/auditSlice';
import { StyledTableCell } from '../../../components/StyledTableCell';
import { StyledTableRow } from '../../../components/StyledTableRow';
import VisibilityIcon from '@material-ui/icons/Visibility';
import { reviewAudit } from '../../../constants/routes';

interface IAuditInvitationsProps {}

const AuditInvitations: React.FC<IAuditInvitationsProps> = ({}) => {
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
          <StyledTableCell>{audit.startedBy!.name}</StyledTableCell>
          <StyledTableCell>
            {new Date(audit.createdAt).toLocaleDateString()}
          </StyledTableCell>
          <StyledTableCell>
            <Button
              onClick={(e) => {
                e.preventDefault();
                dispatch(getAuditById(audit.id));
                history.push(reviewAudit(audit.id));
              }}
              endIcon={<VisibilityIcon />}
            ></Button>
          </StyledTableCell>
        </StyledTableRow>
      );
    });
  } else if (audits.length == 0) {
    renderedAudits = (
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          You haven't been invited to any audits yet.
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
        Audit Invitations
      </Typography>
      <br />

      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Audit Name</StyledTableCell>
              <StyledTableCell>Started By</StyledTableCell>
              <StyledTableCell>Start Date</StyledTableCell>
              <StyledTableCell>Review Audit</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderedAudits}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default AuditInvitations;
