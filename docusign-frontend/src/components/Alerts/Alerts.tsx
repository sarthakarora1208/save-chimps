import React, { useEffect } from 'react';
import { resetAlert } from '../../slices/alertSlice';
import { useAlert } from 'react-alert';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { RootState } from '../../app/rootReducer';
interface IAlertsProps {}
export const Alerts: React.FC<IAlertsProps> = () => {
  const dispatch = useDispatch();
  const alert = useAlert();

  const { successMsg, errorMsg, errorStatus, infoMsg } = useSelector(
    (state: RootState) => {
      return {
        successMsg: state.alert.successMsg,
        errorMsg: state.alert.errorMsg,
        errorStatus: state.alert.errorStatus,
        infoMsg: state.alert.infoMsg,
      };
    },
    shallowEqual
  );
  useEffect(() => {
    const options = {
      timeout: 5000,
      transition: 'fade',
    };
    if (errorMsg) {
      alert.error(errorMsg, options);
    }
    if (successMsg) {
      alert.success(successMsg, options);
    }
    if (infoMsg) {
      alert.info(infoMsg, options);
    }
    if (errorMsg || successMsg || infoMsg) {
      dispatch(resetAlert());
    }
    return () => {};
  }, [successMsg, errorMsg, infoMsg, alert, dispatch]);
  return <></>;
};
