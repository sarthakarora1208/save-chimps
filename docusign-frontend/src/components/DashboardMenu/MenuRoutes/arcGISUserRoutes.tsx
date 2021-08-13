import React from 'react';
import {
  ARCGIS_USER_DASHBOARD,
  FINISHED_AUDITS,
  ONGOING_AUDITS,
  START_AUDIT,
} from '../../../constants/routes';
import DashboardIcon from '@material-ui/icons/Dashboard';
import MapIcon from '@material-ui/icons/Map';
import VerifiedUserIcon from '@material-ui/icons/VerifiedUser';
import GavelIcon from '@material-ui/icons/Gavel';
import AutorenewIcon from '@material-ui/icons/Autorenew';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

export const arcGISUserRoutes = [
  {
    id: 'Dashboard',
    children: [
      {
        id: 'Start Audit',
        route: START_AUDIT,
        icon: <GavelIcon />,
      },
      {
        id: 'Ongoing Audits',
        route: ONGOING_AUDITS,
        icon: <AutorenewIcon />,
      },
      {
        id: 'Finished Audits',
        route: FINISHED_AUDITS,
        icon: <CheckCircleIcon />,
      },
    ],
  },
];
