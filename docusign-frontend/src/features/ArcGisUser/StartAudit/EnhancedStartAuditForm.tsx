import { withFormik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { History } from 'history';
import { AppThunk } from '../../../app/store';
import { StartAuditForm } from './StartAuditForm';
import { createAudit } from '../../../slices/auditSlice';
import { AUDIT_NAME_IS_REQUIRED } from '../../../constants/formMessages';

export interface IDispatchProps {
  createAudit: (name: string, history: History) => AppThunk;
}

export interface EnhancedStartAuditFormValues {
  name: string;
}

export interface EnhancedStartAuditFormProps extends RouteComponentProps {
  name?: string;
  createAudit: (name: string, history: History) => void;
}

const EnhancedStartAuditForm = withFormik<
  EnhancedStartAuditFormProps,
  EnhancedStartAuditFormValues
>({
  mapPropsToValues: (props) => ({
    name: props.name || '',
  }),
  validationSchema: Yup.object().shape({
    name: Yup.string().required(AUDIT_NAME_IS_REQUIRED),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const { createAudit, history } = props;
    const { name } = values;
    createAudit(name, history);

    setSubmitting(false);
  },
})(StartAuditForm);

const EnhancedStartAuditFormWithRouter = withRouter(EnhancedStartAuditForm);

export default connect<null, IDispatchProps>(null, {
  createAudit,
})(EnhancedStartAuditFormWithRouter);
