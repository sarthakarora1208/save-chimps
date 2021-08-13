import React from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import { Link, useLocation } from 'react-router-dom';
import Divider from '@material-ui/core/Divider';
import Drawer, { DrawerProps } from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import Typography from '@material-ui/core/Typography';
import Logo from '../../assets/images/Logo.svg';

import { Omit } from '@material-ui/types';
import navigatorStyles from '../../assets/jss/components/navigatorStyles';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from '../../app/rootReducer';
import { ARCGIS_USER_ROLE } from '../../constants/roles';
import {
  ARCGIS_USER_DASHBOARD,
  STAKEHOLDER_DASHBOARD,
} from '../../constants/routes';
import { arcGISUserRoutes } from './MenuRoutes/arcGISUserRoutes';
import { stakeholderRoutes } from './MenuRoutes/stakeholderRoutes';
import { USER_ROLE } from '../../constants/models/user';

const useStyles = makeStyles(navigatorStyles);

export interface INavigatorProps extends Omit<DrawerProps, 'classes'> {}

export const Navigator: React.FC<INavigatorProps> = (
  props: INavigatorProps
) => {
  const classes = useStyles();
  const location = useLocation();

  const { user } = useSelector((state: RootState) => {
    return {
      user: state.auth.user,
    };
  }, shallowEqual);

  let routes;
  let homeLink;

  if (user && user.role === USER_ROLE.ARCGIS_USER_ROLE) {
    homeLink = ARCGIS_USER_DASHBOARD;
    routes = arcGISUserRoutes;
  } else {
    homeLink = STAKEHOLDER_DASHBOARD;
    routes = stakeholderRoutes;
  }

  return (
    <Drawer variant="permanent" {...props}>
      <List disablePadding>
        <ListItem
          className={clsx(classes.title, classes.item, classes.itemRoute)}
        >
          <img src={Logo} height={'40px'} />
          <Typography
            variant="h6"
            style={{
              fontFamily: 'Gotham',
              padding: '0.4rem',
            }}
          >
            SAVE CHIMPS
          </Typography>
        </ListItem>

        <Link to={homeLink} style={{ textDecoration: 'none' }}>
          <ListItem
            className={clsx(
              classes.item,
              classes.itemRoute,
              location.pathname === homeLink && classes.itemActiveItem
            )}
          >
            <ListItemIcon className={classes.itemIcon}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText
              classes={{
                primary: classes.itemPrimary,
              }}
            >
              Dashboard
            </ListItemText>
          </ListItem>
        </Link>
        {routes.map(({ id, children }) => (
          <React.Fragment key={id}>
            <ListItem className={classes.routeHeader}>
              <ListItemText
                classes={{
                  primary: classes.routeHeaderPrimary,
                }}
              >
                {id}
              </ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, route }) => (
              <Link key={childId} to={route} style={{ textDecoration: 'none' }}>
                <ListItem
                  button
                  className={clsx(
                    classes.item,
                    location.pathname === route && classes.itemActiveItem
                  )}
                >
                  <ListItemIcon className={classes.itemIcon}>
                    {icon}
                  </ListItemIcon>
                  <ListItemText
                    classes={{
                      primary: classes.itemPrimary,
                    }}
                  >
                    {childId}
                  </ListItemText>
                </ListItem>
              </Link>
            ))}
            <Divider className={classes.divider} />
          </React.Fragment>
        ))}
      </List>
    </Drawer>
  );
};
