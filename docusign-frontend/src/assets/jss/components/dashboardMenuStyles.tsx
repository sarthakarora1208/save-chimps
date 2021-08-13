import { createStyles, Theme } from '@material-ui/core';
import Background from '../../images/Background.png';
const dashboardMenuStyles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      minHeight: '100vh',
    },
    drawer: {
      [theme.breakpoints.up('sm')]: {
        width: 256,
        flexShrink: 0,
      },
    },
    app: {
      flex: 1,
      display: 'flex',
      flexDirection: 'column',
    },
    main: {
      flex: 1,
      padding: theme.spacing(6, 4),
      background: '#F0FFF4',
      //background: `url(${Background})`,
      //backgroundRepeat: 'no-repeat',
      //backgroundSize: 'cover',
      //height: '100vh',
    },
    footer: {
      padding: theme.spacing(2),
      background: '#F0FFF4',
    },
  });
export default dashboardMenuStyles;
