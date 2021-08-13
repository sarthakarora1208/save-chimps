import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { RootState } from '../../../app/rootReducer';
import { StyledTableCell } from '../../../components/StyledTableCell';
import { StyledTableRow } from '../../../components/StyledTableRow';
import Icon from '@mdi/react';
import { mdiSignature } from '@mdi/js';
import {
  getFinishedAudits,
  getSignedDocumentsUser,
  signAudit,
} from '../../../slices/auditSlice';
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
import { DSLogin } from '../../../slices/authSlice';
import { Audit } from '../../../constants/models/audit';
import _ from 'lodash';
interface ICompletedAuditsProps {}

const CompletedAudits: React.FC<ICompletedAuditsProps> = ({}) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { audits, signedDocuments } = useSelector((state: RootState) => {
    return {
      audits: state.audit.finishedAudits,
      signedDocuments: state.audit.signedDocuments,
    };
  }, shallowEqual);
  useEffect(() => {
    dispatch(DSLogin());
    dispatch(getFinishedAudits());
    dispatch(getSignedDocumentsUser());
    return () => {};
  }, [audits.length, signedDocuments.length]);
  let renderedAudits;
  if (audits.length > 0) {
    let signedDocumentAudits: Audit[] = signedDocuments.map(
      (signedDocument) => {
        return signedDocument.audit;
      }
    );
    renderedAudits = audits.map((audit, index) => {
      let renderedStatus;
      //if (audits.map((audit) => audit.id).includes(audit.id)) {
      if (_.some(signedDocumentAudits, { id: audit.id })) {
        renderedStatus = <Button disabled={true}>Already Signed!</Button>;
      } else {
        renderedStatus = (
          <Button
            onClick={(e) => {
              e.preventDefault();
              dispatch(signAudit(audit.id));
            }}
          >
            <Icon
              path={mdiSignature}
              title="Signature"
              size={1}
              horizontal
              vertical
              color="#000"
              spin
              rotate={180}
            />
            &nbsp;Sign Document
          </Button>
        );
      }
      return (
        <StyledTableRow key={index}>
          <StyledTableCell component="th" scope="row">
            {index + 1}
          </StyledTableCell>
          <StyledTableCell>{audit.name}</StyledTableCell>
          <StyledTableCell>{audit.startedBy!.name}</StyledTableCell>
          <StyledTableCell>
            {new Date(audit.updatedAt).toLocaleDateString()}
          </StyledTableCell>

          <StyledTableCell>{renderedStatus}</StyledTableCell>
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
        Finished Audits
      </Typography>
      <br />
      <TableContainer component={Paper}>
        <Table aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>S.No.</StyledTableCell>
              <StyledTableCell>Audit Name</StyledTableCell>
              <StyledTableCell>Started By</StyledTableCell>
              <StyledTableCell>End Date</StyledTableCell>
              <StyledTableCell>Sign Report</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>{renderedAudits}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompletedAudits;
