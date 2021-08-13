import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { RootState } from '../../../app/rootReducer';

import formStyles from '../../../assets/jss/components/formStyles';
import { PageWrapper } from '../../../components/PageWrapper';
import {
  ARCGIS_USER_DASHBOARD,
  REGISTER,
  STAKEHOLDER_DASHBOARD,
} from '../../../constants/routes';
import { getUser } from '../../../slices/authSlice';
import { BASE_URL, HOST } from '../../../api/api';
import { USER_ROLE } from '../../../constants/models/user';
import Background from '../../../assets/images/Background.png';
import EnhancedLoginForm from './EnhancedLoginForm';

const useStyles = makeStyles(formStyles);

interface ILoginProps {}

export const Login: React.FC<ILoginProps> = () => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();

  const { authLoading, isAuthenticated, user } = useSelector(
    (state: RootState) => {
      return {
        authLoading: state.auth.loading,
        isAuthenticated: state.auth.isAuthenticated,
        user: state.auth.user,
      };
    },
    shallowEqual
  );

  // useEffect(() => {

  // }, [isAuthenticated])i;
  return (
    <div
      style={{
        backgroundImage: `url(${Background})`,
        position: 'absolute',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <PageWrapper>
        <div className={classes.wrapper}>
          <Typography variant="h4" className={classes.typography}>
            LOGIN
          </Typography>
          <p className={classes.signin}>
            Don't have an account?
            <Button
              color="primary"
              onClick={() => {
                history.push(REGISTER);
              }}
              style={{ textDecoration: 'underline' }}
            >
              Sign Up
            </Button>
          </p>
          <EnhancedLoginForm />
        </div>
      </PageWrapper>
    </div>
  );
};

export default Login;
