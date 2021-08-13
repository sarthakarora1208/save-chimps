import React, { useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps } from 'formik';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import formStyles from '../../../assets/jss/components/formStyles';
import { Button, FormControl, TextField } from '@material-ui/core';
import { DisplayFormikState } from '../../../components/DisplayFormikState';
import { EnhancedStartAuditFormValues } from './EnhancedStartAuditForm';
import GavelIcon from '@material-ui/icons/Gavel';

const useStyles = makeStyles(formStyles);

interface IStartAuditFormProps {}

export const StartAuditForm: React.FC<
  IStartAuditFormProps & FormikProps<EnhancedStartAuditFormValues>
> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  const debug = false;
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
  } = props;
  const { auditLoading } = useSelector((state: RootState) => {
    return {
      auditLoading: state.audit.loading,
    };
  }, shallowEqual);

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl required className={classes.formWidth}>
        <TextField
          label="What is the audit called?"
          placeholder="Eg. Audit 101"
          type="string"
          name="name"
          variant="outlined"
          value={values.name}
          onChange={handleChange}
          onBlur={handleBlur}
          error={(errors.name && touched.name) as boolean}
          helperText={errors.name && touched.name && errors.name}
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
      </FormControl>
      <Button
        startIcon={<GavelIcon></GavelIcon>}
        className={classes.secondaryButton}
        variant="outlined"
        type="submit"
        disabled={auditLoading}
      >
        Start Audit
      </Button>
      {debug ? <DisplayFormikState {...props} /> : ''}
    </form>
  );
};
