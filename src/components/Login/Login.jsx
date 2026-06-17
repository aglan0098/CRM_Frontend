import React, { useState, useEffect } from 'react';
import AuthWrapper from './DesignWrapper/DesignWrapper';
import PhoneLoginPage from './PhoneNumber/Phone';
import OTPVerification from './PhoneNumOTP/PhoneOTP';
import Nafath from './Nafath/Nafath';
import NafathOTPVerification from './NafathOTP/NafathOTP';
import CreateAccount from './CreateAccount/CreateAccount';
import AccountSelection from './AccountSelection/Accsel';
const Login = () => {
  return (
      <PhoneLoginPage />
  );
}

export default Login;