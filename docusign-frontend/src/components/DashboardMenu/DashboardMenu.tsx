import React, { ReactNode, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Hidden from '@material-ui/core/Hidden';
import { Navigator } from './Navigator';
import { Header } from './Header';
import dashboardMenuStyles from '../../assets/jss/components/dashboardMenuStyles';
import { useDispatch } from 'react-redux';
import { setErrorMsg } from '../../slices/alertSlice';
import { useLocation } from 'react-router-dom';
import { HOME, LOGIN, REGISTER } from '../../constants/routes';

const useStyles = makeStyles(dashboardMenuStyles);

export interface IAdminMenuProps {
  children: ReactNode;
}

export const DashboardMenu: React.FC<IAdminMenuProps> = ({ children }) => {
  const classes = useStyles();
  const location = useLocation();
  let path = location.pathname;
  const dispatch = useDispatch();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  useEffect(() => {
    return () => {};
  }, []);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  let pathsToExclude: string[] = [HOME, LOGIN, REGISTER];
  if (pathsToExclude.includes(path)) {
    return <div>{children}</div>;
  }

  return (
    <div className={classes.root}>
      <CssBaseline />
      <nav className={classes.drawer}>
        <Hidden smUp implementation="js">
          <Navigator
            PaperProps={{ style: { width: 256 } }}
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
          />
        </Hidden>
        <Hidden xsDown implementation="css">
          <Navigator PaperProps={{ style: { width: 256 } }} />
        </Hidden>
      </nav>
      <div className={classes.app}>
        <Header onDrawerToggle={handleDrawerToggle} />
        <main className={classes.main}>{children}</main>
      </div>
    </div>
  );
};
