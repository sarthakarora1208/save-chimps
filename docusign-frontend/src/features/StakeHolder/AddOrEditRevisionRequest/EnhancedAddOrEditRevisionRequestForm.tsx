import { withFormik, FormikProps } from 'formik';
import { RouteComponentProps, withRouter } from 'react-router';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import { History } from 'history';
import { AppThunk } from '../../../app/store';
import { createRevisionRequest } from '../../../slices/revisionRequestSlice';
import { AddOrEditRevisionRequestForm } from './AddOrEditRevisionRequestForm';
import { COMMENTS_ARE_REQUIRED } from '../../../constants/formMessages';

export interface IDispatchProps {
  createRevisionRequest: (comments: string, history: History) => AppThunk;
}

export interface EnhancedAddOrEditRevisionRequestFormValues {
  comments: string;
}
export interface EnhancedAddOrEditRevisionRequestFormProps
  extends RouteComponentProps {
  comments?: string;
  createRevisionRequest: (comments: string, history: History) => void;
}

const EnhancedAddOrEditRevisionRequestForm = withFormik<
  EnhancedAddOrEditRevisionRequestFormProps,
  EnhancedAddOrEditRevisionRequestFormValues
>({
  mapPropsToValues: (props) => ({
    comments: props.comments || '',
  }),
  validationSchema: Yup.object().shape({
    comments: Yup.string().required(COMMENTS_ARE_REQUIRED),
  }),
  handleSubmit: (values, { setSubmitting, props }) => {
    const { createRevisionRequest, history } = props;
    const { comments } = values;
    createRevisionRequest(comments, history);

    setSubmitting(false);
  },
})(AddOrEditRevisionRequestForm);

const EnhancedAddOrEditRevisionRequestFormWithRouter = withRouter(
  EnhancedAddOrEditRevisionRequestForm
);

export default connect<null, IDispatchProps>(null, {
  createRevisionRequest,
})(EnhancedAddOrEditRevisionRequestFormWithRouter);
