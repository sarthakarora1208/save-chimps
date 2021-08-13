import React, { useEffect } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import { makeStyles } from '@material-ui/core/styles';
import DeleteIcon from '@material-ui/icons/Delete';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { FormikProps } from 'formik';
import formStyles from '../../../assets/jss/components/formStyles';
import { getUserFromEmail, removeAuditor } from '../../../slices/auditSlice';
import { EnhancedAddStakeholdersFormValues } from './EnhancedAddStakeholdersForm';
import { RootState } from '../../../app/rootReducer';
import { User } from '../../../constants/models/user';
import { Button, FormControl, TextField, Typography } from '@material-ui/core';
import { DisplayFormikState } from '../../../components/DisplayFormikState';
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';

const useStyles = makeStyles(formStyles);

interface IAddStakeholdersFormProps {}

export const AddStakeholdersForm: React.FC<
  IAddStakeholdersFormProps & FormikProps<EnhancedAddStakeholdersFormValues>
> = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  let debug = false;

  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleBlur,
    handleChange,
    setFieldValue,
  } = props;
  const { auditors, auditLoading } = useSelector((state: RootState) => {
    return {
      auditors: state.audit.auditors,
      auditLoading: state.audit.loading,
    };
  }, shallowEqual);

  const handleEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && values.email && !errors.email) {
      event.preventDefault();
      dispatch(getUserFromEmail(values.email));
      setFieldValue('email', '');
    }
  };

  const handleRemoveUser = (toRemove: User) => {
    dispatch(removeAuditor(toRemove));
  };
  let renderedAuditors;
  if (auditors.length > 0) {
    renderedAuditors = auditors.map((user: User) => {
      const labelId = `checkbox-list-secondary-label-${user.id}`;
      return (
        <ListItem key={user.id} button>
          <ListItemAvatar>
            <Avatar alt={`${user.name}`} src={`${user.name}`} />
          </ListItemAvatar>
          <ListItemText
            id={labelId}
            primary={<Typography color="primary">{user.name}</Typography>}
            secondary={<Typography color="secondary">{user.email}</Typography>}
          />
          <ListItemSecondaryAction>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => handleRemoveUser(user)}
              style={{ color: '#ff0000' }}
            >
              <DeleteIcon />
            </IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      );
    });
  } else {
    renderedAuditors = <></>;
  }
  return (
    <form className={classes.root} onSubmit={handleSubmit}>
      <FormControl required className={classes.formWidth}>
        <TextField
          label="Who will be a part of this audit?"
          placeholder="Eg. janedoe@gmail.com"
          type="string"
          name="email"
          variant="outlined"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          onKeyDown={handleEnter}
          error={(errors.email && touched.email) as boolean}
          helperText={errors.email && touched.email && errors.email}
          InputLabelProps={{
            classes: {
              root: classes.heading,
              focused: classes.cssFocused,
            },
          }}
        />
        <List>{renderedAuditors}</List>
      </FormControl>
      <Button
        startIcon={<SupervisorAccountIcon />}
        className={classes.secondaryButton}
        variant="outlined"
        type="submit"
        disabled={auditLoading || auditors.length < 1}
      >
        Add Stakeholders
      </Button>
      {debug ? <DisplayFormikState {...props} /> : ''}
    </form>
  );
};
