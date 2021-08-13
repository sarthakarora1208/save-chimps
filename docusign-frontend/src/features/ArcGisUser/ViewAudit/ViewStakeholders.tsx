import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import {
  Avatar,
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
import _ from 'lodash';
import RateReviewIcon from '@material-ui/icons/RateReview';
import ThumbUpIcon from '@material-ui/icons/ThumbUp';
import QueryBuilderIcon from '@material-ui/icons/QueryBuilder';
import { User } from '../../../constants/models/user';
import { RevisionRequest } from '../../../constants/models/revisionRequest';
import theme from '../../../app/theme';

interface IViewStakeholdersProps {}

export const ViewStakeholders: React.FC<IViewStakeholdersProps> = ({}) => {
  const dispatch = useDispatch();

  const { user, audit } = useSelector((state: RootState) => {
    return {
      audit: state.audit.audit,
      user: state.auth.user!,
    };
  }, shallowEqual);

  useEffect(() => {
    return () => {};
  }, [audit, user]);

  let renderedStatus = <></>;

  let renderedAuditors;
  if (audit && audit.auditors.length > 0) {
    renderedAuditors = audit.auditors.map((auditor, index) => {
      const { name, email } = auditor;
      //if (audit && _.some(audit.approvedAuditors, { email: user.email })) {
      if (
        audit &&
        audit.approvedAuditors.map((user) => user.email).includes(email)
      ) {
        renderedStatus = (
          <Button
            variant="text"
            startIcon={<ThumbUpIcon />}
            disabled={true}
            style={{ color: theme.palette.primary.main }}
          >
            Approved audit
          </Button>
        );
      } else {
        renderedStatus = (
          <Button
            variant="text"
            startIcon={<QueryBuilderIcon />}
            disabled={true}
            style={{ color: 'black' }}
          >
            Pending approval
          </Button>
        );
      }
      return (
        <StyledTableRow key={index}>
          <StyledTableCell component="th" scope="row">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell>{name}</StyledTableCell>
          <StyledTableCell>{email}</StyledTableCell>
          <StyledTableCell>{renderedStatus}</StyledTableCell>
        </StyledTableRow>
      );
    });
  } else if (audit && audit.auditors.length === 0) {
    renderedAuditors = (
      <StyledTableRow>
        <StyledTableCell component="th" scope="row">
          No auditors found!
        </StyledTableCell>
      </StyledTableRow>
    );
  } else {
    renderedAuditors = (
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
        Stakeholders
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Auditor</StyledTableCell>
              <StyledTableCell>Email</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderedAuditors}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
