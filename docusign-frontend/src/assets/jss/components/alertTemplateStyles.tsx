import { createStyles, Theme } from '@material-ui/core';

const alertTemplateStyles = (theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(4),
      },
    },
  });

export default alertTemplateStyles;