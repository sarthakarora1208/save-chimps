import React, { useEffect } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import HelpIcon from '@material-ui/icons/Help';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/Notifications';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Toolbar from '@material-ui/core/Toolbar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import headerStyles from '../../assets/jss/components/headerStyles';
import { useHistory } from 'react-router';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../app/rootReducer';
import { logout } from '../../slices/authSlice';
interface IHeaderProps {
  onDrawerToggle: () => void;
}

const useStyles = makeStyles(headerStyles);

export const Header: React.FC<IHeaderProps> = ({ onDrawerToggle }) => {
  const classes = useStyles();
  const history = useHistory();
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => {
    return {
      user: state.auth.user,
    };
  }, shallowEqual);
  useEffect(() => {
    return () => {};
  }, []);
  let rendedredName = user ? user.name : 'name';
  return (
    <React.Fragment>
      <AppBar className={classes.root} position="sticky" elevation={2}>
        <Toolbar style={{ height: '4rem' }}>
          <Grid container spacing={1} alignItems="center">
            <Hidden smUp>
              <Grid item>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  onClick={onDrawerToggle}
                  className={classes.menuButton}
                >
                  <MenuIcon />
                </IconButton>
              </Grid>
            </Hidden>
            <Grid item xs />
            <Grid item>
              <Link
                className={classes.link}
                href="3"
                variant="body2"
                onClick={(e) => {
                  e.preventDefault();
                  dispatch(logout(history));
                }}
              >
                LOGOUT
              </Link>
            </Grid>
            <Grid item>
              <Tooltip title="No new notification">
                <IconButton color="inherit">
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item>
              <IconButton color="inherit" className={classes.iconButtonAvatar}>
                <Avatar src="/static/images/avatar/1.jpg" alt={rendedredName} />
              </IconButton>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    </React.Fragment>
  );
};
