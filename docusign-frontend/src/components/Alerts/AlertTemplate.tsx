import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import alertTemplateStyles from '../../assets/jss/components/alertTemplateStyles';

const useStyles = makeStyles(alertTemplateStyles);

interface IMessageProps {
  data: string;
  severity: 'error' | 'success' | 'info';
  handleClose: any;
}

const Message: React.FC<IMessageProps> = ({ data, severity, handleClose }) => {
  const classes = useStyles();
  const [open] = React.useState(true);

  // const handleClose = (event, reason) => {
  //   if (reason === 'clickaway') {
  //     return;
  //   }

  //   setOpen(false);
  // };
  return (
    <div className={classes.root}>
      <Snackbar
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={severity} onClose={handleClose} variant="filled">
          {data}
        </Alert>
      </Snackbar>
    </div>
  );
};

interface IAlertTemplateProps {
  options: any;
  message: any;
  close: any;
}

export const AlertTemplate: React.FC<IAlertTemplateProps> = ({
  options,
  message,
  close,
}) => {
  return <Message severity={options.type} handleClose={close} data={message} />;
};
