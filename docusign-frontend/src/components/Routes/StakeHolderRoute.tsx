import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Route, RouteProps } from 'react-router-dom';
import { RootState } from '../../app/rootReducer';
import { USER_ROLE } from '../../constants/models/user';
import { STAKHOLDER_ROLE } from '../../constants/roles';

import { LOGIN } from '../../constants/routes';

interface IStakeholderRouteProps extends RouteProps {}

const StakeholderRoute: React.FC<IStakeholderRouteProps> = ({
  children,
  ...rest
}) => {
  const { isAuthenticated, user } = useSelector((state: RootState) => {
    return {
      authLoading: state.auth.loading,
      isAuthenticated: state.auth.isAuthenticated,
      user: state.auth.user,
    };
  }, shallowEqual);

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (
          isAuthenticated &&
          user &&
          user.role === USER_ROLE.STAKHOLDER_ROLE
        ) {
          return children;
        } else {
          return (
            <Redirect
              to={{
                pathname: LOGIN,
                state: {
                  from: location,
                },
              }}
            />
          );
        }
      }}
    />
  );
};

export default StakeholderRoute;
