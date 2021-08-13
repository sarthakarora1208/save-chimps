import { createTheme } from '@material-ui/core/styles';

import OxygenRegular from '../assets/fonts/Oxygen-Regular.ttf';
import GothamBlack from '../assets/fonts/Gotham-Black.ttf';

const Oxygen = {
  fontFamily: 'Oxygen',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('Oxygen'),
    local('Oxygen-Regular'),
    url(${OxygenRegular}) format('truetype')
  `,
};

const Gotham = {
  fontFamily: 'Gotham',
  fontStyle: 'normal',
  fontWeight: 400,
  src: `
    local('Gotham'),
    local('Gotham-Black'),
    url(${GothamBlack}) format('truetype')
  `,
};

let theme = createTheme({
  palette: {
    primary: {
      light: '#F0FFF4',
      main: '#0BB68C',
      dark: '#038175',
    },
    secondary: {
      main: '#94DD8B',
    },
  },
  typography: {
    fontFamily: ['Oxygen', 'Gotham'].join(','),
    h5: {
      fontWeight: 500,
      fontSize: 26,
      letterSpacing: 0.5,
    },
  },
  shape: {
    borderRadius: 8,
  },
  props: {
    MuiTab: {
      disableRipple: true,
    },
  },
  mixins: {
    toolbar: {
      minHeight: 48,
    },
  },
});
theme = {
  ...theme,
  overrides: {
    MuiCssBaseline: {
      '@global': {
        '@font-face': [Oxygen, Gotham],
      },
    },
    MuiDrawer: {
      paper: {
        backgroundColor: '#038175',
      },
    },
    MuiButton: {
      label: {
        textTransform: 'none',
      },
      contained: {
        boxShadow: 'none',
        '&:active': {
          boxShadow: 'none',
        },
      },
    },
    MuiTabs: {
      root: {
        marginLeft: theme.spacing(1),
      },
      indicator: {
        height: 3,
        borderTopLeftRadius: 3,
        borderTopRightRadius: 3,
        backgroundColor: theme.palette.common.white,
      },
    },
    MuiTab: {
      root: {
        textTransform: 'none',
        margin: '0 16px',
        minWidth: 0,
        padding: 0,
        [theme.breakpoints.up('md')]: {
          padding: 0,
          minWidth: 0,
        },
      },
    },
    MuiIconButton: {
      root: {
        padding: theme.spacing(1),
      },
    },
    MuiTooltip: {
      tooltip: {
        borderRadius: 4,
      },
    },
    MuiDivider: {
      root: {
        backgroundColor: '#0BB68C',
      },
    },
    MuiListItemText: {
      primary: {
        fontWeight: theme.typography.fontWeightMedium,
      },
    },
    MuiListItemIcon: {
      root: {
        color: 'inherit',
        marginRight: 0,
        '& svg': {
          fontSize: 20,
        },
      },
    },
    MuiAvatar: {
      root: {
        width: 32,
        height: 32,
      },
    },
  },
};

export default theme;
