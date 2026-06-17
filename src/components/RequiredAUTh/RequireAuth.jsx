// RequireAuth.jsx
import { Navigate, useLocation } from 'react-router-dom';

const RequireAuth = ({ children }) => {
  const isLoggedIn = !!localStorage.getItem('swa_user');
  const location   = useLocation();

  if (!isLoggedIn) {
    // grab deep-link params from the URL
    const params    = new URLSearchParams(location.search);
    const caseType  = params.get('caseName') || params.get('casename');
    const caseId    = params.get('caseId')  || params.get('guid');

    if (caseType && caseId) {
      localStorage.setItem('deep_link_case_id',   caseId);
      localStorage.setItem('deep_link_case_type', caseType);
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default RequireAuth;