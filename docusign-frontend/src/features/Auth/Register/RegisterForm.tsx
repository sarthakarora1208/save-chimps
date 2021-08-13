import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { DisplayFormikState } from '../../../components/DisplayFormikState';
import { FormikProps } from 'formik';
import { EnhancedRegisterFormValues } from './EnhancedRegisterForm';

import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import EmailIcon from '@material-ui/icons/Email';

import formStyles from '../../../assets/jss/components/formStyles';
import { RootState } from '../../../app/rootReducer';
interface IRegisterFormProps {}

const useStyles = makeStyles(formStyles);

export const RegisterForm: React.FC<
  IRegisterFormProps & FormikProps<EnhancedRegisterFormValues>
> = (props) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const debug = true;
  const { values, errors, touched, handleSubmit, handleBlur, handleChange } =
    props;

  const { authLoading } = useSelector((state: RootState) => {
    return {
      authLoading: state.auth.loading,
    };
  }, shallowEqual);
  useEffect(() => {
    return () => {};
  }, []);

  const handleRegisterSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };
  return (
    <form className={classes.root} onSubmit={handleRegisterSubmit}>
      <FormControl required className={classes.formWidth}>
        <TextField
          label="Name"
          type="text"
          placeholder="Enter Full Name"
          name="name"
          variant="outlined"
          size="small"
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
      <br />
      <FormControl required className={classes.formWidth}>
        <TextField
          id="emailAddress"
          label="Email Address"
          placeholder="Enter Email"
          type="email"
          name="email"
          variant="outlined"
          size="small"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={'off'}
          error={(errors.email && touched.email) as boolean}
          helperText={errors.email && touched.email && errors.email}
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
      </FormControl>

      <br />
      <FormControl required className={classes.formWidth}>
        <TextField
          id="password"
          label="Password"
          placeholder="Enter Password"
          type="password"
          name="password"
          variant="outlined"
          size="small"
          value={values.password}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={'off'}
          error={(errors.password && touched.password) as boolean}
          helperText={errors.password && touched.password && errors.password}
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
      </FormControl>
      <FormControl required className={classes.formWidth}>
        <TextField
          id="passwordConfirmation"
          label="PasswordConfirmation"
          placeholder="Re-enter Password"
          type="password"
          name="passwordConfirmation"
          variant="outlined"
          size="small"
          value={values.passwordConfirmation}
          onChange={handleChange}
          onBlur={handleBlur}
          autoComplete={'off'}
          error={
            (errors.passwordConfirmation &&
              touched.passwordConfirmation) as boolean
          }
          helperText={
            errors.passwordConfirmation &&
            touched.passwordConfirmation &&
            errors.passwordConfirmation
          }
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
      </FormControl>
      <br />
      <br />
      <br />

      <Button
        className={classes.button}
        variant="contained"
        color="secondary"
        type="submit"
        disabled={authLoading}
        // fullWidth
      >
        REGISTER
      </Button>
      <br />
      {/* {debug ? <DisplayFormikState {...props} /> : ''} */}
    </form>
  );
};
