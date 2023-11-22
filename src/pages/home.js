import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'reactstrap';
import { ToastContainer, toast } from 'react-toastify';

const a = {
  width: '150px',
  minHeight: '100px',
  margin: '15px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  fontSize: '20px',
  backgroundColor: '#fff',
  boxShadow: 'rgba(47, 43, 61, 0.1) 0px 4px 18px 0px',
  cursor: 'pointer',
  fontFamily: "'Marhey', sans-serif",
  fontWeight: '600',
};
function Home({ socket }) {
  const [createModal, setCreateModal] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [capacity, setCapacity] = useState(2);
  const [roomId, setRoomId] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      navigate('/');
    }
  }, []);
  useEffect(() => {
    socket.on('roomJoin-response', async (res) => {
      if (res.hasError === false) {
        // await localStorage.setItem('game', JSON.stringify(res));
        navigate('/game', {
          state: {
            game: res.data.game,
          },
        });
      } else {
        toast.error(res.error, { position: 'top-right', autoClose: 3000 });
      }
    });
    socket.on('roomCreate-response', async (res) => {
      if (res.hasError === false) {
        // await localStorage.setItem('game', JSON.stringify(res));
        navigate('/game', {
          state: {
            game: res.data.game,
          },
        });
      } else {
        toast.error(res.error, { position: 'top-right', autoClose: 3000 });
      }
    });
  }, []);

  /**
   * Create Room Code Starts
   */
  const onValueChangeOfCapacity = (e) => {
    setCapacity(e.target.value);
  };
  const openCreateModel = () => {
    setCreateModal(!createModal);
  };
  const handleCreateRoom = async (e) => {
    e.preventDefault();

    setCreateModal(!createModal);
    const userData = await JSON.parse(localStorage.getItem('userData'));
    socket.emit('craeteRoom', { capacity: capacity, ...userData });
  };
  /**
   * Create Room Code Ends
   */

  /**
   * Join Room Code Starts
   */
  const openJoinModel = () => {
    setJoinModal(!joinModal);
  };
  const handleJoinRoom = async (e) => {
    e.preventDefault();
    if (roomId !== '') {
      setJoinModal(!joinModal);
      const userData = await JSON.parse(localStorage.getItem('userData'));

      socket.emit('joinRoom', { roomId: roomId, ...userData });
    }
  };
  const onValueChangeOfRoomId = (e) => {
    setRoomId(e.target.value);
  };
  /**
   * Join Room Code Ends
   */
  return (
    <>
      <ToastContainer />

      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#87CEEB',
        }}
      >
        <p
          style={{
            fontSize: '38px',
            fontFamily: "'Marhey', sans-serif",
            color: '#fff',
            textShadow: '2px 4px 3px rgba(0,0,0,0.3)',
            fontWeight: '600',
          }}
        >
          What you want to do?
        </p>
        <div className='d-flex'>
          <div
            style={a}
            className='rounded-4'
            onClick={openCreateModel}
          >
            Create
          </div>
          <Modal
            isOpen={createModal}
            toggle={openCreateModel}
            centered={true}
          >
            <ModalHeader>Create Room</ModalHeader>
            <ModalBody>
              <Form>
                {/* <FormGroup>
                  <Label for='capacity'>capacity</Label>
                  <Input
                    id='capacity'
                    name='capacity'
                    placeholder='capacity'
                    type='capacity'
                    value={capacity}
                    onChange={(e) => onValueChangeOfCapacity(e)}
                  />
                </FormGroup> */}
                <FormGroup row>
                  <Label
                    for='exampleSelect'
                    sm={2}
                  >
                    Capacity
                  </Label>
                  <Col sm={10}>
                    <Input
                      id='exampleSelect'
                      name='capacity'
                      type='select'
                      placeholder='capacity'
                      value={capacity}
                      onChange={onValueChangeOfCapacity}
                    >
                      <option value={2}>2</option>
                      <option value={3}>3</option>
                      <option value={4}>4</option>
                      <option value={5}>5</option>
                    </Input>
                  </Col>
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                style={{
                  backgroundColor: '#87CEEB',
                  border: 'none',
                }}
                onClick={(e) => handleCreateRoom(e)}
              >
                Submit
              </Button>{' '}
              <Button
                color='secondary'
                onClick={() => setCreateModal(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
          <div
            style={a}
            className='rounded-4'
            onClick={openJoinModel}
          >
            Join
          </div>
          <Modal
            isOpen={joinModal}
            toggle={openJoinModel}
            centered={true}
          >
            <ModalHeader>Create Room</ModalHeader>
            <ModalBody>
              <Form>
                <FormGroup>
                  <Label for='roomId'>roomId</Label>
                  <Input
                    id='roomId'
                    name='roomId'
                    placeholder='roomId'
                    type='roomId'
                    value={roomId}
                    onChange={(e) => onValueChangeOfRoomId(e)}
                    required
                  />
                </FormGroup>
              </Form>
            </ModalBody>
            <ModalFooter>
              <Button
                style={{
                  backgroundColor: '#87CEEB',
                  border: 'none',
                }}
                onClick={(e) => handleJoinRoom(e)}
              >
                Submit
              </Button>{' '}
              <Button
                color='secondary'
                onClick={() => setJoinModal(false)}
              >
                Cancel
              </Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    </>
  );
}

export default Home;
