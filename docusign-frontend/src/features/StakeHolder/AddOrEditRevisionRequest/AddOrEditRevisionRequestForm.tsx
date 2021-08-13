import React from 'react';
import { EnhancedAddOrEditRevisionRequestFormValues } from './EnhancedAddOrEditRevisionRequestForm';
import { makeStyles } from '@material-ui/core/styles';
import { FormikProps } from 'formik';
import { useSelector, shallowEqual, useDispatch } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import AddIcon from '@material-ui/icons/Add';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import formStyles from '../../../assets/jss/components/formStyles';
import { Button, FormControl, TextField } from '@material-ui/core';
import { DisplayFormikState } from '../../../components/DisplayFormikState';
import { DropzoneDialog } from 'material-ui-dropzone';
import {
  addAttachmentToS3,
  setAddedAttachment,
  setImageBinary,
} from '../../../slices/revisionRequestSlice';

const useStyles = makeStyles(formStyles);

interface IAddOrEditRevisionRequestFormProps {}

export const AddOrEditRevisionRequestForm: React.FC<
  IAddOrEditRevisionRequestFormProps &
    FormikProps<EnhancedAddOrEditRevisionRequestFormValues>
> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState(false);
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
  const { revisionRequestLoading } = useSelector((state: RootState) => {
    return {
      revisionRequestLoading: state.revisionRequest.loading,
    };
  }, shallowEqual);

  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl required className={classes.formWidth}>
        <TextField
          label="Comments"
          placeholder="Why are these changes necessary?"
          type="string"
          name="comments"
          value={values.comments}
          variant="outlined"
          onChange={handleChange}
          onBlur={handleBlur}
          error={(errors.comments && touched.comments) as boolean}
          helperText={errors.comments && touched.comments && errors.comments}
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
      </FormControl>
      <Button
        startIcon={<PhotoCamera />}
        variant="contained"
        component="span"
        className={classes.button}
        onClick={() => {
          setOpen(true);
        }}
      >
        Upload Images
      </Button>
      <Button
        className={classes.secondaryButton}
        startIcon={<AddIcon />}
        variant="outlined"
        type="submit"
        disabled={revisionRequestLoading}
      >
        Request Changes
      </Button>
      {debug ? <DisplayFormikState {...props} /> : ''}

      <DropzoneDialog
        acceptedFiles={['image/*']}
        cancelButtonText={'cancel'}
        submitButtonText={'submit'}
        maxFileSize={102400}
        filesLimit={1}
        open={open}
        onClose={() => setOpen(false)}
        onSave={(files) => {
          if (files.length > 0) {
            let file = files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              let base64string = reader.result as string;
              dispatch(setImageBinary(base64string));
              dispatch(setAddedAttachment(true));
            };
          }
          setOpen(false);
        }}
        showPreviews={true}
        showFileNamesInPreview={true}
      />
    </form>
  );
};
