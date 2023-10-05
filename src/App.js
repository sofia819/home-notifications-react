import { useState, useEffect } from 'react';
import useInterval from 'use-interval';
import wretch from 'wretch';

const App = () => {
  const timeToUpdate = 5;
  const [isAlertEnabled, setIsAlertEnabled] = useState(false);
  const [isAlertWithinTimeFrame, setIsAlertWithinTimeFrame] = useState(false);
  const [isDoorOpened, setIsDoorOpened] = useState(false);
  const [doorOpenedSince, setDoorOpenedSince] = useState('');
  const [time, setTime] = useState(timeToUpdate);

  useEffect(() => {
    wretch('https://home-notifications.onrender.com/status/alert')
      .get()
      .json((json) => {
        setIsAlertEnabled(json.isAlertEnabled);
        setIsAlertWithinTimeFrame(json.isWithinTimeframe);
      });
    wretch('https://home-notifications.onrender.com/status/door')
      .get()
      .json((json) => {
        setIsDoorOpened(json.isDoorOpened);
        setDoorOpenedSince(json.doorOpenedSince);
      });
  }, []);

  useInterval(() => {
    if (time > 0) {
      setTime(time - 1);
    } else {
      setTime(timeToUpdate);
    }
  }, 1000);

  useEffect(() => {
    if (time === 0) {
      wretch('https://home-notifications.onrender.com/status/door')
        .get()
        .json((json) => {
          setIsDoorOpened(json.isDoorOpened);
          setDoorOpenedSince(json.doorOpenedSince);
        });
    }
  }, [time]);

  const toggleEnableAlert = () => {
    wretch('https://home-notifications.onrender.com/status/alert')
      .put()
      .json((json) => {
        setIsAlertEnabled(json.isAlertEnabled);
        setIsAlertWithinTimeFrame(json.isWithinTimeframe);
      });
  };

  return (
    <>
      <h2>Status</h2>
      <h4>Alert is {isAlertEnabled ? 'ENABLED' : 'DISABLED'}</h4>
      <h4>Alert is {isAlertWithinTimeFrame ? '' : 'not'} within timeframe</h4>
      <h4>
        Door is {isDoorOpened ? 'OPENED' : 'CLOSED'} -- {time}s till next update
      </h4>
      {doorOpenedSince.length > 0 && (
        <h4>Door has been opened since {doorOpenedSince}</h4>
      )}
      <button onClick={toggleEnableAlert}>Toggle alert</button>
    </>
  );
};

export default App;
