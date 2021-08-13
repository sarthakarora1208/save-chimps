import React, { useEffect } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import { LOGIN, DASHBOARD } from '../../../constants/routes';
import { useSelector, shallowEqual } from 'react-redux';
import Typography from '@material-ui/core/Typography';
import formStyles from '../../../assets/jss/components/formStyles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import PersonOutlineOutlinedIcon from '@material-ui/icons/PersonOutlineOutlined';
import { RootState } from '../../../app/rootReducer';
import { PageWrapper } from '../../../components/PageWrapper';
import EnhancedRegisterForm from './EnhancedRegisterForm';
import Background from '../../../assets/images/Background.png';

interface IRegisterProps {}

const useStyles = makeStyles(formStyles);

const Register: React.FC<IRegisterProps> = () => {
  const classes = useStyles();
  const history = useHistory();
  const { authLoading, isAuthenticated } = useSelector((state: RootState) => {
    return {
      authLoading: state.auth.loading,
      isAuthenticated: state.auth.isAuthenticated,
    };
  }, shallowEqual);

  useEffect(() => {
    if (isAuthenticated) {
      history.push(DASHBOARD);
    }
  }, [isAuthenticated, history]);
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
          <IconButton
            color="primary"
            onClick={(e) => {
              history.go(-1);
            }}
          >
            <ArrowBackIosIcon fontSize="small" />
          </IconButton>

          <Typography variant="h4" className={classes.typography}>
            Register
          </Typography>
          <p className={classes.signin}>
            Already have an account?{' '}
            <Button
              color="primary"
              onClick={() => {
                history.push(LOGIN);
              }}
              style={{ textDecoration: 'underline' }}
            >
              Sign in
            </Button>
          </p>
          <EnhancedRegisterForm />
          <br />
        </div>
      </PageWrapper>
    </div>
  );
};

export default Register;
