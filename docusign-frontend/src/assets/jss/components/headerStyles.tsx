import { createStyles, Theme } from '@material-ui/core';

export const headerStyles = (theme: Theme) =>
  createStyles({
    root: {
      backgroundColor: theme.palette.primary.light,
    },
    secondaryBar: {
      zIndex: 0,
    },
    menuButton: {
      marginLeft: -theme.spacing(1),
    },
    iconButtonAvatar: {
      padding: 4,
    },
    link: {
      fontWeight: 'bold',
      textDecoration: 'none',
      color: theme.palette.primary.main,
      '&:hover': {
        color: theme.palette.secondary.dark,
      },
    },
    button: {
      borderColor: theme.palette.primary.light,
    },
  });
export default headerStyles;
