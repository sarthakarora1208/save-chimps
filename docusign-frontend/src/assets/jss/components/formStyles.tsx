import { createStyles, Theme } from '@material-ui/core';

const formStyles = (theme: Theme) =>
  createStyles({
    root: {
      '& > * ': {
        marginTop: theme.spacing(4),
        width: '25ch',
      },
    },
    button: {
      width: '95%',
      padding: '0.5rem',
      border: '1px solid #038175',
      margin: theme.spacing(1),
      fontWeight: 'bold',
      color: theme.palette.primary.main,
      backgroundColor: 'white',
      borderColor: theme.palette.primary.main,
      borderRadius: '6px',
    },
    secondaryButton: {
      width: '95%',
      padding: '0.5rem',
      margin: theme.spacing(1),
      fontWeight: 'bold',
      color: 'white',
      borderColor: 'white',
      backgroundColor: theme.palette.primary.main,
      '&:hover': {
        backgroundColor: theme.palette.secondary.dark,
      },
      borderRadius: '6px',
    },
    formWidth: {
      marginTop: '1rem',
      width: '100%',
      padding: '0.4rem 3% ',
    },
    selectLabel: {
      left: 'auto',
      top: 'auto',
    },

    typography: {
      textAlign: 'center',
      fontWeight: 'bold',
      fontFamily: 'Gotham',
      padding: '0.4rem 1.6rem',
    },
    headingText: {
      fontWeight: 'bold',
      fontFamily: 'Gotham',
    },
    cssFocused: {
      color: '#94DD8B',
    },
    heading: {
      color: '#00000',
    },
    link: {
      textDecoration: 'none',
      color: '#94DD8B',
    },
    wrapper: {
      padding: '2rem 4rem',
      marginTop: '2.5rem',
    },
    formWrapper: {
      padding: '0rem 2rem 0rem 2rem',
    },
    signin: {
      textAlign: 'center',
    },
    backButton: {
      margin: '0.2rem auto auto 0.2rem',
    },
  });
export default formStyles;
