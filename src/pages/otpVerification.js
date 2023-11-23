import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation, useNavigate } from 'react-router-dom';
import OtpInput from 'react-otp-input';
import axios from 'axios';

function OtpVerification() {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  let { userId } = location.state;
  useEffect(() => {
    console.log('otpVerification called..');
    const userId = localStorage.getItem('userId');
    if (!JSON.parse(userId)?.id || !userId) {
      navigate('/home');
    }
  }, []);

  const handleSubmit = async (e) => {
    console.log('userId.id: ', userId);
    e.preventDefault();
    try {
      const res = await axios.post(
        // 'http://localhost:3001/otpVerification',
        'https://dhrumil-bingo-1hs1.onrender.com/otpVerification', // TODO Production
        { id: userId, otp: otp }
      );

      console.log('res: ', res);
      const userData = {
        name: res.data.data.userData.name,
        email: res.data.data.userData.email,
        id: res.data.data.userData._id,
      };
      await localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/home');
    } catch (err) {
      console.log('err: ', err);
      toast.error(err.response.data.error, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  const handleBack = () => {
    navigate('/home');
  };
  const handlePaste = (event) => {
    const data = event.clipboardData.getData('text');
    console.log(data);
  };
  return (
    <>
      <ToastContainer />
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#87CEEB',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <p
            style={{
              fontSize: '38px',
              fontFamily: "'Marhey', sans-serif",
              color: '#fff',
              textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
              fontWeight: '600',
              paddingBottom: '35px',
            }}
          >
            Please Enter OTP
          </p>
          <Form
            className='border border-2 rounded'
            style={{
              width: '100%',
              maxWidth: 350,
              boxShadow: 'rgba(47, 43, 61, 0.1) 0px 4px 18px 0px',
              minHeight: 150,
              padding: 15,
              backgroundColor: '#fff',
            }}
          >
            <OtpInput
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderSeparator={<span>&nbsp;</span>}
              renderInput={(props) => <input {...props} />}
              onPaste={handlePaste}
              inputType='tel'
              containerStyle={{
                display: 'flex',
                justifyContent: 'space-between',
                padding: '5px',
                paddingBottom: '15px',
              }}
              inputStyle={{
                width: '100%',
                minHeight: '46px',
                border: '2px solid #87CEEB',
                borderRadius: '5px',
                fontFamily: "'Marhey', sans-serif",
                fontWeight: '500',
              }}
            />
            <Button
              type='submit'
              style={{
                backgroundColor: '#87CEEB',
                border: 'none',
                width: '100%',
                marginBottom: '15px',
              }}
              onClick={handleSubmit}
            >
              Submit
            </Button>
            <p
              style={{
                color: '#87CEEB',
                fontSize: '15px',
                cursor: 'pointer',
                textAlign: 'center',
              }}
              onClick={handleBack}
            >
              back to login
            </p>
          </Form>
        </div>
      </div>
    </>
  );
}

export default OtpVerification;
