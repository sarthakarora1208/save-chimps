import React, { useEffect } from 'react';
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@material-ui/core/styles';
import { Provider as AlertProvider } from 'react-alert';
import { Alerts } from '../components/Alerts/Alerts';
import * as ROUTES from '../constants/routes';
import Theme from './theme';
import esriConfig from '@arcgis/core/config';
import store from './store';

import { AlertTemplate } from '../components/Alerts/AlertTemplate';
import { DashboardMenu } from '../components/DashboardMenu/DashboardMenu';
import ArcGISUserRoute from '../components/Routes/GISUserRoute';
import StakeholderRoute from '../components/Routes/StakeHolderRoute';

import Home from '../features/Home/Home';
import Login from '../features/Auth/Login/Login';

import ArcGISUserDashboard from '../features/ArcGisUser/ArcGISUserDashboard/ArcGISUserDashboard';

import { Loading } from '../components/Loading';
import ViewAudit from '../features/ArcGisUser/ViewAudit/ViewAudit';
import ReviewAudit from '../features/StakeHolder/ReviewAudit/ReviewAudit';
import AuditInvitations from '../features/StakeHolder/AuditInvitations/AuditInvitations';
import MyRevisionRequests from '../features/StakeHolder/MyRevisionRequests/MyRevisionRequests';
import OngoingAudits from '../features/ArcGisUser/OngoingAudits/OngoingAudits';
import ViewRevisionRequest from '../features/ArcGisUser/ViewRevisionRequest/ViewRevisionRequest';
import FinishedAuditsArcGISUser from '../features/ArcGisUser/FinishedAuditsArcGISUser/FinishedAuditsArcGISUser';
import ViewFinalAudit from '../features/ArcGisUser/ViewFinalAudit/ViewFinalAudit';
import CompletedAudits from '../features/StakeHolder/CompletedAudits/CompletedAudits';
import FinishSigningDocument from '../features/StakeHolder/FinishSigningDocument/FinishSigningDocument';
import Register from '../features/Auth/Register/Register';
import { LOGIN } from '../constants/routes';
import AddOrEditRevsionRequest from '../features/StakeHolder/AddOrEditRevisionRequest/AddOrEditRevsionRequest';
import StartAudit from '../features/ArcGisUser/StartAudit/StartAudit';
import StakeholderDashboard from '../features/StakeHolder/StakeHolderDashboard/StakeHolderDashboard';

interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  const API_KEY =
    'AAPK74963c8488bc45109841f65a8894400f8Tb_cu2RT-vt632jdSxsQcNJ8DBHCkdFqXRB-ghfOfvo5qXMI2UgU0EIXntXem84';

  useEffect(() => {
    esriConfig.apiKey = API_KEY;
    return () => {};
  }, []);

  return (
    <Provider store={store}>
      <AlertProvider template={AlertTemplate}>
        <ThemeProvider theme={Theme}>
          <div className="App">
            <Alerts />
            <Router>
              <Loading>
                <DashboardMenu>
                  <Switch>
                    <Route exact path={ROUTES.LOGIN}>
                      <Login />
                    </Route>
                    <Route exact path={ROUTES.REGISTER}>
                      <Register />
                    </Route>
                    <ArcGISUserRoute exact path={ROUTES.ARCGIS_USER_DASHBOARD}>
                      <ArcGISUserDashboard />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.START_AUDIT}>
                      <StartAudit />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.viewAudit()}>
                      <ViewAudit />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.ONGOING_AUDITS}>
                      <OngoingAudits />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.viewRevisionRequest()}>
                      <ViewRevisionRequest />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.FINISHED_AUDITS}>
                      <FinishedAuditsArcGISUser />
                    </ArcGISUserRoute>
                    <ArcGISUserRoute exact path={ROUTES.viewFinalAudit()}>
                      <ViewFinalAudit />
                    </ArcGISUserRoute>

                    <StakeholderRoute exact path={ROUTES.STAKEHOLDER_DASHBOARD}>
                      <StakeholderDashboard />
                    </StakeholderRoute>
                    <StakeholderRoute exact path={ROUTES.AUDIT_INVITATIONS}>
                      <AuditInvitations />
                    </StakeholderRoute>
                    <StakeholderRoute exact path={ROUTES.MY_REVISION_REQUESTS}>
                      <MyRevisionRequests />
                    </StakeholderRoute>
                    <StakeholderRoute exact path={ROUTES.reviewAudit()}>
                      <ReviewAudit />
                    </StakeholderRoute>
                    <StakeholderRoute exact path={ROUTES.addRevisionRequest()}>
                      <AddOrEditRevsionRequest />
                    </StakeholderRoute>
                    <StakeholderRoute
                      exact
                      path={ROUTES.COMPLETED_AUDITS_STAKEHOLDER}
                    >
                      <CompletedAudits />
                    </StakeholderRoute>
                    <StakeholderRoute
                      exact
                      path={ROUTES.FINISH_SIGNING_DOCUMENT}
                    >
                      <FinishSigningDocument />
                    </StakeholderRoute>
                    <Route exact path={ROUTES.FINISH_SIGNING_DOCUMENT}>
                      <FinishSigningDocument />
                    </Route>
                    <Route exact path={ROUTES.HOME}>
                      <Redirect to={LOGIN} />
                    </Route>
                  </Switch>
                </DashboardMenu>
              </Loading>
            </Router>
          </div>
        </ThemeProvider>
      </AlertProvider>
    </Provider>
  );
};

export default App;
