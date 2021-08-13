import { createStyles, Theme } from '@material-ui/core';

const pageWrapperStyles = (theme: Theme) =>
  createStyles({
    root: {},
    formWidth: {
      width: '100%',
    },
    typography: {
      textAlign: 'center',
      backgroundColor: theme.palette.secondary.main,
    },
    cssFocused: {
      color: '#94DD8B',
    },
    heading: {
      color: '#94DD8B',
    },
    grid: {
      minWidth: '350px',
      maxWidth: '550px',
      marginTop: '50px',
    },
    paper: {
      background: '#F0FFF4',
    },
  });

export default pageWrapperStyles;
