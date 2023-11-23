import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import ClipLoader from 'react-spinners/ClipLoader';
import axios from 'axios';
const initialValues = {
  email: '',
  name: '',
};

function Auth({ socket }) {
  const [data, setData] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const { email, name } = data;
  const navigate = useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (JSON.parse(userData)?.email) {
      navigate('/home');
    }
  }, []);

  useEffect(() => {
    socket.on('connect', () => {});
  }, []);

  const onValueChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        'https://dhrumil-bingo-1hs1.onrender.com/login', // TODO Production
        // 'http://localhost:3001/login',
        data
      );
      console.log('res: ', res);
      await localStorage.setItem('userId', JSON.stringify(res.data.data));
      setLoading(false);
      navigate('/otpVerification', {
        state: {
          userId: res.data.data.id,
        },
      });
    } catch (err) {
      console.log('err: ', err);
      setLoading(false);
      toast.error(err.response.data.error, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
  };

  return (
    <>
      {loading === true ? (
        <div
          style={{
            display: 'flex',
            minHeight: '100vh',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#cfe8f3',
          }}
        >
          <ClipLoader
            color='#87CEEB'
            loading={loading}
            // cssOverride={override}
            size={50}
            aria-label='Loading Spinner'
            data-testid='loader'
          />
        </div>
      ) : (
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
                Welcome to bingo universe
              </p>
              <Form
                className='border border-2 rounded'
                style={{
                  width: '100%',
                  maxWidth: 350,
                  boxShadow: 'rgba(47, 43, 61, 0.1) 0px 4px 18px 0px',
                  minHeight: 250,
                  padding: 15,
                  backgroundColor: '#fff',
                }}
              >
                <FormGroup>
                  <Label for='email'>Email</Label>
                  <Input
                    id='email'
                    name='email'
                    placeholder='email'
                    type='email'
                    value={email}
                    onChange={(e) => onValueChange(e)}
                  />
                </FormGroup>
                <FormGroup>
                  <Label for='username'>Username</Label>
                  <Input
                    id='username'
                    name='name'
                    placeholder='username'
                    type='text'
                    value={name}
                    onChange={(e) => onValueChange(e)}
                  />
                </FormGroup>
                <Button
                  type='submit'
                  style={{ backgroundColor: '#87CEEB', border: 'none' }}
                  onClick={handleSubmit}
                >
                  Submit
                </Button>
              </Form>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default Auth;
