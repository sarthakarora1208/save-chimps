import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../../app/rootReducer';
import { Container, Grid, Paper, Typography } from '@material-ui/core';
import { BaseMap } from '../../../components/Maps/BaseMap';
import { EditorMap } from '../../../components/Maps/EditorMap';

interface IArcGISUserDashboardProps {}

const ArcGISUserDashboard: React.FC<IArcGISUserDashboardProps> = ({}) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => {
    return {
      user: state.auth.user,
    };
  }, shallowEqual);
  return (
    <div>
      <Container style={{ padding: 0 }}>
        <Typography
          variant="h6"
          style={{
            fontWeight: 'bold',
            fontFamily: 'Gotham',
          }}
        >
          HI, {user ? user.name : ''}
        </Typography>
        <Grid container direction="row" justifyContent="center">
          <Grid item md={12}>
            <EditorMap />
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default ArcGISUserDashboard;
