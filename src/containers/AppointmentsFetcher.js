/* eslint-disable no-alert */
import axios from 'axios';
import { Slide } from 'react-slideshow-image';
import { useEffect, useState } from 'react';
import NavBar from '../components/NavBar';

const AppointmentsFetcher = () => {
  let responseVar = null;
  const [appointmentsState, setappointmentsState] = useState([]);
  const [currentUser, setCurrentUser] = useState('');
  let i = -1;
  let index = 0;
  let invitationNumber = 0;
  let isCancelled = false;

  const checkLoginStatus = () => {
    axios
      .get('http://localhost:3001/auth/validate_token',
        {
          headers: {
            uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
            client: JSON.parse(localStorage.getItem('currentUser')).myClient,
            'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
          },
        }).then(response => {
        if (!isCancelled) {
          setCurrentUser(response.data.data.email);
        }
      })
      .catch(error => {
        responseVar = error.response.statusText;
        setTimeout(() => { alert(responseVar); }, 500);
      });
  };

  const FetchAppointments = () => {
    axios
      .get('http://localhost:3001/appointments', {
        headers: {
          uid: JSON.parse(localStorage.getItem('currentUser')).myUid,
          client: JSON.parse(localStorage.getItem('currentUser')).myClient,
          'access-token': JSON.parse(localStorage.getItem('currentUser')).myAccessToken,
        },
      })
      .then(response => {
        const userVar = (response.data.users);
        const a = response.data.appointments;
        const b = response.data.teachers;
        const lastVersion = [];
        a.forEach(element => {
          const firstVersion = element;
          firstVersion.teacher_mail = b[index].email;
          firstVersion.user_mail = userVar[index].email;
          lastVersion.push(firstVersion);
          index += 1;
        });
        if (!isCancelled) {
          setappointmentsState(lastVersion);
        }
      });
  };

  useEffect(() => {
    checkLoginStatus();
    FetchAppointments();
    return () => {
      isCancelled = true;
    };
  }, []);

  return (
    <div>
      <NavBar />
      <Slide className="w-75 mx-auto mt-5">
        {Object.values(appointmentsState)
          .filter(element => element.user_mail === currentUser).map(element => {
            i += 1;
            invitationNumber += 1;
            return (
              <div key={i} className="card text-center w-50 mx-auto my-5 shadow-lg py-4">
                <h2 className="card-title">
                  Your invitation
                  {' '}
                  {invitationNumber}
                </h2>
                <div>
                  The Date is:
                  {' '}
                  <b>{element.date}</b>
                </div>
                <div>
                  The teacher is:
                  {' '}
                  <b>{element.teacher_mail}</b>
                </div>
                <div>
                  The invitation status is:
                  {' '}
                  <b>{element.status}</b>
                </div>
              </div>

            );
          })}
      </Slide>
    </div>
  );
};

export default AppointmentsFetcher;
