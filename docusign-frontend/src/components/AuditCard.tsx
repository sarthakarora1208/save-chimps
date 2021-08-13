import React from 'react';
import {
  Button,
  Card,
  CardContent,
  CardMedia,
  Divider,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { Audit } from '../constants/models/audit';
import auditCardStyles from '../assets/jss/components/auditCardStyles';
import { useDispatch } from 'react-redux';
import { getAuditById } from '../slices/auditSlice';
import { reviewAudit } from '../constants/routes';
import { useHistory } from 'react-router';
import SvgIcon from '@material-ui/core/SvgIcon';
import GavelIcon from '@material-ui/icons/Gavel';

const useStyles = makeStyles(auditCardStyles);

interface IAuditCardProps {
  audit: Audit;
}

export const AuditCard: React.FC<IAuditCardProps> = ({ audit }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  return (
    <Card className={classes.card}>
      <SvgIcon className={classes.svg}>
        <GavelIcon />
      </SvgIcon>
      <CardContent className={classes.content}>
        <Typography className={classes.heading} variant={'h6'} gutterBottom>
          {audit.name}
        </Typography>

        <Typography className={classes.subheading} variant={'caption'}>
          Start Date: {new Date(audit.createdAt).toLocaleDateString()}
        </Typography>
        <Typography variant={'body1'} className={classes.body} gutterBottom>
          You were invited to this audit by {audit.startedBy!.name}. You can
          suggest changes or approve the map.
        </Typography>

        <Button
          className={classes.link}
          variant="text"
          color="secondary"
          onClick={(e) => {
            e.preventDefault();
            dispatch(getAuditById(audit.id));
            history.push(reviewAudit(audit.id));
          }}
        >
          Review Audit
        </Button>
      </CardContent>
    </Card>
  );
};
