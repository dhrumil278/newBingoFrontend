import React, { useEffect, useState } from 'react';
import { Button, Form, FormGroup, Input, Label } from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const initialValues = {
  email: '',
  name: '',
};
function Auth({ socket }) {
  const [data, setData] = useState(initialValues);
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
    try {
      const res = await axios.post('http://localhost:3001/login', data);

      toast.success(res.data.data.message, {
        position: 'top-right',
        autoClose: 3000,
      });
      const userData = {
        name: res.data.data.name,
        email: res.data.data.email,
        id: res.data.data._id,
      };
      await localStorage.setItem('userData', JSON.stringify(userData));
      navigate('/home');
    } catch (err) {
      toast.error(err.response.data.error, {
        position: 'top-right',
        autoClose: 3000,
      });
    }
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
  );
}

export default Auth;
