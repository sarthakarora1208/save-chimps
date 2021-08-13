import React from 'react';
import {
  AUDIT_INVITATIONS,
  COMPLETED_AUDITS_STAKEHOLDER,
  MY_REVISION_REQUESTS,
  STAKEHOLDER_DASHBOARD,
} from '../../../constants/routes';
import DashboardIcon from '@material-ui/icons/Dashboard';
import PersonAddIcon from '@material-ui/icons/PersonAdd';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import RateReviewIcon from '@material-ui/icons/RateReview';
export const stakeholderRoutes = [
  {
    id: 'Dashboard',
    children: [
      {
        id: 'Audit Invitations',
        route: AUDIT_INVITATIONS,
        icon: <PersonAddIcon />,
      },
      {
        id: 'My Revision Requests',
        route: MY_REVISION_REQUESTS,
        icon: <RateReviewIcon />,
      },
      {
        id: 'Completed Audits',
        route: COMPLETED_AUDITS_STAKEHOLDER,
        icon: <CheckCircleIcon />,
      },
    ],
  },
];
