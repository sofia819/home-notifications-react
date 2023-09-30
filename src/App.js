import { useState, useEffect } from 'react';
import useInterval from 'use-interval';
import wretch from 'wretch';

const App = () => {
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [time, setTime] = useState(10);

  useEffect(() => {
    wretch('https://home-notifications.onrender.com/status/alert')
      .get()
      .json((json) => setIsAlertEnabled(json.shouldSendAlert));
    wretch('https://home-notifications.onrender.com/status/door')
      .get()
      .json((json) => setIsDoorOpened(json.isDoorOpened));
  }, []);

  useInterval(() => {
    if (time > 0) {
      setTime(time - 1);
    } else {
      setTime(10);
    }
  }, 1000);

  useEffect(() => {
    if (time == 0) {
      wretch('https://home-notifications.onrender.com/status/door')
        .get()
        .json((json) => setIsDoorOpened(json.isDoorOpened));
    }
  }, [time]);

  const toggleEnableAlert = () => {
    wretch('https://home-notifications.onrender.com/status/alert')
      .put()
      .json((json) => setIsAlertEnabled(json.shouldSendAlert));
  };

  return (
    <>
      <h2>Status</h2>
      <h4>Alert is {isAlertEnabled ? 'ENABLED' : 'DISABLED'}</h4>
      <h4>
        Door is {isDoorOpened ? 'OPENED' : 'CLOSED'} -- {time}s till next update
      </h4>
      <button onClick={toggleEnableAlert}>Toggle alert</button>
    </>
  );
};

export default App;
