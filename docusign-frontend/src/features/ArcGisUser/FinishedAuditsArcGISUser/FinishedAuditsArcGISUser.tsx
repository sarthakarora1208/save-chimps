import React, { useEffect } from 'react';
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import { mdiSignature } from '@mdi/js';
import Icon from '@mdi/react';
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
import { getAuditById, getFinishedAudits } from '../../../slices/auditSlice';
import IconButton from '@material-ui/core/IconButton';
import { viewFinalAudit } from '../../../constants/routes';
import Signature from '../../../assets/images/signature-with-a-pen.png';

interface IFinishedAuditsArcGISUserProps {}

const FinishedAuditsArcGISUser: React.FC<IFinishedAuditsArcGISUserProps> =
  ({}) => {
    const dispatch = useDispatch();
    const history = useHistory();
    const { audits } = useSelector((state: RootState) => {
      return {
        audits: state.audit.finishedAudits,
      };
    }, shallowEqual);

    useEffect(() => {
      dispatch(getFinishedAudits());
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
              {new Date(audit.updatedAt).toLocaleDateString()}
            </StyledTableCell>

            <StyledTableCell>{audit.auditors!.length}</StyledTableCell>
            <StyledTableCell>
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(getAuditById(audit.id));
                  history.push(viewFinalAudit(audit.id));
                }}
                variant="text"
              >
                <Icon
                  path={mdiSignature}
                  title="Signature"
                  size={1}
                  horizontal
                  vertical
                  color="#000"
                  rotate={180}
                />
                &nbsp;Request Signatures
              </Button>
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
          Finished Audits
        </Typography>
        <br />
        <TableContainer component={Paper}>
          <Table aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell>S.No.</StyledTableCell>
                <StyledTableCell>Audit Name</StyledTableCell>
                <StyledTableCell>End Date</StyledTableCell>
                <StyledTableCell>Auditors</StyledTableCell>
                <StyledTableCell>Manage</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>{renderedAudits}</TableBody>
          </Table>
        </TableContainer>
      </div>
    );
  };

export default FinishedAuditsArcGISUser;
