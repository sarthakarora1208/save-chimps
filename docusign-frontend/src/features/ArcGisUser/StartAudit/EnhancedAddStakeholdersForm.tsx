import { withFormik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { History } from 'history';
import { AppThunk } from '../../../app/store';
import { AddStakeholdersForm } from './AddStakeholdersForm';
import { addStakeholdersToAudit } from '../../../slices/auditSlice';
import {
  EMAIL_INVALID,
  EMAIL_NOT_LONG_ENOUGH,
  EMAIL_REQUIRED,
} from '../../../constants/formMessages';

export interface IDispatchProps {
  addStakeholdersToAudit: (history: History) => AppThunk;
}

export interface EnhancedAddStakeholdersFormValues {
  email: string;
}
export interface EnhancedAddStakeholdersFormProps extends RouteComponentProps {
  email?: string;
  addStakeholdersToAudit: (history: History) => void;
}

const EnhancedAddStakeholdersForm = withFormik<
  EnhancedAddStakeholdersFormProps,
  EnhancedAddStakeholdersFormValues
>({
  mapPropsToValues: (props) => ({
    email: props.email || '',
  }),
  validationSchema: Yup.object().shape({
    email: Yup.string()
      .min(3, EMAIL_NOT_LONG_ENOUGH)
      .max(255)
      .email(EMAIL_INVALID),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const { addStakeholdersToAudit, history } = props;
    const { email } = values;
    addStakeholdersToAudit(history);
    setSubmitting(false);
  },
})(AddStakeholdersForm);

const EnhancedAddStakeholdersFormWithRouter = withRouter(
  EnhancedAddStakeholdersForm
);

export default connect<null, IDispatchProps>(null, {
  addStakeholdersToAudit,
})(EnhancedAddStakeholdersFormWithRouter);
