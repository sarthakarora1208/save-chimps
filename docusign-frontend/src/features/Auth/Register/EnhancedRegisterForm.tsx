import { withFormik } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { register } from '../../../slices/authSlice';
import * as Yup from 'yup';
import { History } from 'history';
import { AppThunk } from '../../../app/store';
import {
  CONFIRM_PASSWORD_REQUIRED,
  EMAIL_INVALID,
  EMAIL_REQUIRED,
  NAME_REQUIRED,
  PASSWORD_REQUIRED,
  PASSWORD_TOO_SHORT,
  PASSWORDS_MUST_MATCH,
  EMAIL_NOT_LONG_ENOUGH,
} from '../../../constants/formMessages';
import { RegisterForm } from './RegisterForm';

interface IDispatchProps {
  register: (
    name: string,
    email: string,
    password: string,
    history: History
  ) => AppThunk;
}

export interface EnhancedRegisterFormValues {
  email: string;
  name: string;
  password: string;
  passwordConfirmation: string;
}

export interface EnhancedRegisterFormProps extends RouteComponentProps {
  email?: string;
  name?: string;
  register: (
    name: string,
    email: string,
    password: string,
    history: History
  ) => void;
}

const EnhancedRegisterForm = withFormik<
  EnhancedRegisterFormProps,
  EnhancedRegisterFormValues
>({
  mapPropsToValues: () => ({
    email: '',
    name: '',
    password: '',
    passwordConfirmation: '',
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .min(3, EMAIL_NOT_LONG_ENOUGH)
      .max(255)
      .email(EMAIL_INVALID)
      .required(EMAIL_REQUIRED),
    name: Yup.string().required(NAME_REQUIRED),
    password: Yup.string()
      .required(PASSWORD_REQUIRED)
      .min(6, PASSWORD_TOO_SHORT),
    passwordConfirmation: Yup.string()
      .required(CONFIRM_PASSWORD_REQUIRED)
      .oneOf([Yup.ref('password')], PASSWORDS_MUST_MATCH),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const { register, history } = props;
    const { name, email, password } = values;
    register(name, email, password, history);
    setSubmitting(false);
  },
  displayName: 'BasicForm',
})(RegisterForm);

const EnhancedRegisterFormWithRouter = withRouter(EnhancedRegisterForm);

export default connect<null, IDispatchProps>(null, { register })(
  EnhancedRegisterFormWithRouter
);
