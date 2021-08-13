import { createStyles, Theme } from '@material-ui/core';

const sketchMapModalStyles = (theme: Theme) =>
  createStyles({
    root: {
      padding: '0',
      margin: '0',
      minHeight: '80vh',
      height: '100%',
      width: '100%',
    },

    appBar: {
      position: 'relative',
      backgroundColor: theme.palette.primary.dark,
      color: theme.palette.primary.light,
    },
    title: {
      marginLeft: theme.spacing(2),
      flex: 1,
    },
  });

export default sketchMapModalStyles;
