import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';

import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from './../types';
import { addSinglePatient } from './../state/reducer';


const SinglePatient: React.FC = _props => {
  const [{ patient, diagnoses }, dispatch] = useStateValue();
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
        <div key={e.description}>
          <p>{e.description}</p>
          <ul>
            {e.diagnosisCodes?.map(code => (<li key={code}>{code} {diagnoses.find(d => d.code === code)?.name}</li>))}
          </ul>
        </div>
      ))}
    </React.Fragment>
  );
};

export default SinglePatient;
