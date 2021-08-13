import {
  Button,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import theme from '../../../app/theme';
import { StyledTableCell } from '../../../components/StyledTableCell';
import { StyledTableRow } from '../../../components/StyledTableRow';
import RateReviewIcon from '@material-ui/icons/RateReview';
import { mdiDraw } from '@mdi/js';
import { setSuccessMsg } from '../../../slices/alertSlice';
import { getSignedDocumentsAudit } from '../../../slices/auditSlice';

interface IViewSignedDocumentsProps {}

export const ViewSignedDocuments: React.FC<IViewSignedDocumentsProps> =
  ({}) => {
    const dispatch = useDispatch();

    const { audit, signedDocuments } = useSelector((state: RootState) => {
      return {
        audit: state.audit.audit!,
        signedDocuments: state.audit.signedDocuments,
      };
    }, shallowEqual);

    useEffect(() => {
      if (audit && audit!.auditors.length - signedDocuments.length === 0) {
        dispatch(
          setSuccessMsg('All the stakeholders have signed the audit report')
        );
      }
      if (audit) {
        dispatch(getSignedDocumentsAudit(audit.id));
      }
      return () => {};
    }, [audit, signedDocuments.length]);

    let renderedStatus = <></>;

    let renderedStakeholders;
    if (signedDocuments && signedDocuments.length > 0) {
      renderedStakeholders = signedDocuments.map((signedDocument, index) => {
        const { user } = signedDocument;
        return (
          <StyledTableRow key={index}>
            <StyledTableCell component="th" scope="row">
              {index + 1}
            </StyledTableCell>
            <StyledTableCell>{user.name}</StyledTableCell>
            <StyledTableCell>{user.email}</StyledTableCell>
            <StyledTableCell>
              <Button
                variant="text"
                disabled={true}
                style={{ color: theme.palette.primary.main }}
                startIcon={<RateReviewIcon />}
              >
                Signed document
              </Button>
            </StyledTableCell>
          </StyledTableRow>
        );
      });
    } else if (signedDocuments && signedDocuments.length === 0) {
      renderedStakeholders = (
        <StyledTableRow>
          <StyledTableCell component="th" scope="row">
            No auditors found!
          </StyledTableCell>
        </StyledTableRow>
      );
    } else {
      renderedStakeholders = (
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
          Signers
        </Typography>
        <br />
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No.</StyledTableCell>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Status</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderedStakeholders}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };
