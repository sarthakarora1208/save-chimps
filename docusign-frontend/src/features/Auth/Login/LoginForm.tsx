import {
  Button,
  FormControl,
  InputAdornment,
  makeStyles,
  TextField,
} from '@material-ui/core';
import React, { useEffect } from 'react';
import AccountCircle from '@material-ui/icons/AccountCircle';
import LockIcon from '@material-ui/icons/Lock';
import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import EmailIcon from '@material-ui/icons/Email';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { DisplayFormikState } from '../../../components/DisplayFormikState';
import { FormikProps } from 'formik';
import formStyles from '../../../assets/jss/components/formStyles';
import { EnhancedLoginFormValues } from './EnhancedLoginForm';
import { RootState } from '../../../app/rootReducer';

interface IStudentRegisterFormProps {}
//@ts-ignore
const useStyles = makeStyles(formStyles);

export const LoginForm: React.FC<
  IStudentRegisterFormProps & FormikProps<EnhancedLoginFormValues>
> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const debug = true;
  const { values, errors, touched, handleSubmit, handleBlur, handleChange } =
    props;

  const handleLoginSubmit = (e: any) => {
    e.preventDefault();
    handleSubmit();
  };

  const { authLoading } = useSelector((state: RootState) => {
    return {
      authLoading: state.auth.loading,
    };
  }, shallowEqual);

  return (
    <form className={classes.root} onSubmit={handleLoginSubmit}>
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
      <br />
      <Button
        className={classes.button}
        variant="contained"
        color="primary"
        type="submit"
        disabled={authLoading}
        // fullWidth
      >
        LOGIN
      </Button>
      {/*debug ? <DisplayFormikState {...props} /> : ''j*/}
    </form>
  );
};
