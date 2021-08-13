import React from 'react';
import { shallowEqual, useSelector } from 'react-redux';
import { Redirect, Route } from 'react-router-dom';
import { RootState } from '../../app/rootReducer';
import { LOGIN } from '../../constants/routes';

interface IPrivateRouteProps {}

export const PrivateRoute: React.FC<IPrivateRouteProps> = ({
  children,
  ...rest
}) => {
  const { isAuthenticated } = useSelector((state: RootState) => {
    return {
      authLoading: state.auth.loading,
      isAuthenticated: state.auth.isAuthenticated,
    };
  }, shallowEqual);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (isAuthenticated) {
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
