import React from 'react';
import {
  Grid,
  Container,
  Paper,
  CssBaseline,
  makeStyles,
  Typography,
} from '@material-ui/core';
import pageWrapperStyles from '../assets/jss/components/pageWrapperStyles';

const useStyles = makeStyles(pageWrapperStyles);

interface PageWrapperProps {
  //children:
}

export const PageWrapper: React.FC<PageWrapperProps> = ({ children }) => {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Container style={{ padding: 0 }}>
        <Grid container direction="row" justify="center" alignItems="center">
          <Grid item xs={12} md={6}>
            <Container maxWidth="md">
              <CssBaseline />
              <Paper elevation={3} className={classes.paper}>
                {children}
              </Paper>
            </Container>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
};
