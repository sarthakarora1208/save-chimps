import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getUserByEmailAddress } from '../../../slices/authSlice';

interface IFinishSigningDocumentProps {}

const FinishSigningDocument: React.FC<IFinishSigningDocumentProps> = () => {
  const dispatch = useDispatch();

  function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

  const query = useQuery();

  useEffect(() => {
    let email = query.get('email');
    dispatch(getUserByEmailAddress(email));
    return () => {};
  }, []);
  return <>Thank you for signing the document!</>;
};

export default FinishSigningDocument;
