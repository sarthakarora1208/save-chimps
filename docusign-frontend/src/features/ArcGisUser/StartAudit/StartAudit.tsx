import React from 'react';
import { PageWrapper } from '../../../components/PageWrapper';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import {
  Button,
  Container,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import formStyles from '../../../assets/jss/components/formStyles';
import EnhancedStartAuditForm from './EnhancedStartAuditForm';
import { BaseMap } from '../../../components/Maps/BaseMap';
import { RootState } from '../../../app/rootReducer';
import EnhancedAddStakeholdersForm from './EnhancedAddStakeholdersForm';

const useStyles = makeStyles(formStyles);

interface IStartAuditProps {}

const StartAudit: React.FC<IStartAuditProps> = ({}) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { step } = useSelector((state: RootState) => {
    return {
      step: state.audit.step,
    };
  }, shallowEqual);
  let renderedText;
  let renderedForm;
  switch (step) {
    case 0:
      renderedForm = <EnhancedStartAuditForm />;
      renderedText = 'START AUDIT';
      break;

    case 1:
      renderedForm = <EnhancedAddStakeholdersForm />;
      renderedText = 'ADD STAKEHOLDERS';
      break;

    default:
      renderedForm = <></>;
      break;
  }
  return (
    <div>
      <Container style={{ padding: 0 }}>
        <Grid container direction="row" justifyContent="center">
          <Grid item xs={12} md={6}>
            <BaseMap />
          </Grid>
          <Grid item xs={12} md={6}>
            <div className={classes.formWrapper}>
              <Typography variant="h6" className={classes.typography}>
                {renderedText}
              </Typography>
              {renderedForm}
            </div>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
export default StartAudit;
