import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from './../types';
import { addSinglePatient } from './../state/reducer';
import EntryDetails from './Entries/EntryDetails';


const SinglePatient: React.FC = _props => {
  const [{ patient }, dispatch] = useStateValue();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (patient?.id !== id) {
      axios.get<Patient>(`${apiBaseUrl}/patients/${id}`).then(response => {
        dispatch(addSinglePatient(response.data));
      });
    }
  }, [patient, dispatch, id]);

  let gender: 'genderless' | 'mars' | 'venus' = 'genderless';
  if (patient?.gender === 'male') {
    gender = 'mars';
  } else if (patient?.gender === 'female') {
    gender = 'venus';
  }

  return (
    <React.Fragment>
      <h3>{patient?.name} <Icon name={gender} /></h3>
      <p>ssn: {patient?.ssn}</p>
      <p>occupation: {patient?.occupation}</p>
      <h4>Entries</h4>
      {patient?.entries.map((e: Entry) => (
        <div style={{ border: '2px solid grey', margin: '10px', padding: '5px', borderRadius: '10px' }}>
          <EntryDetails entry={e} />
        </div>
      ))}
    </React.Fragment>
  );
};

export default SinglePatient;
