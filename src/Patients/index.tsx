import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import axios from 'axios';
import { Icon } from 'semantic-ui-react';
import { Formik, Form, Field } from 'formik';
import { Grid, Button, Form as SForm } from "semantic-ui-react";

import { useStateValue } from "../state";
import { apiBaseUrl } from "../constants";
import { Patient, Entry } from './../types';
import { addSinglePatient } from './../state/reducer';
import EntryDetails from './Entries/EntryDetails';
import { TextField, DiagnosisSelection } from "./../AddPatientModal/FormField";

const ratingOptions = [{value: 1, label: 1}, {value: 2, label: 2}, {value: 3, label: 3}, {value: 4, label: 4}, {value: 5, label: 5}];

const SinglePatient: React.FC = _props => {
  const [{ patient }, dispatch] = useStateValue();
  const [ diagnoses, setDiagnoses ] = useState([]);
  const { id } = useParams<{ id: string }>();
  const [patientDiagnoses, setPatientDiagnoses] = useState([]);

  useEffect(() => {
    if (patient?.id !== id) {
      axios.get<Patient>(`${apiBaseUrl}/patients/${id}`).then(response => {
        dispatch(addSinglePatient(response.data));
      });
    }
  }, [patient, dispatch, id]);

  useEffect(() => {
    axios.get(`${apiBaseUrl}/diagnoses`).then(response => {
      setDiagnoses(response.data);
    });
  }, []);

  let gender: 'genderless' | 'mars' | 'venus' = 'genderless';
  if (patient?.gender === 'male') {
    gender = 'mars';
  } else if (patient?.gender === 'female') {
    gender = 'venus';
  }
  const onSubmit = async (values: any) => {
    console.log('submit ', values);
    try {
      await axios.post(`${apiBaseUrl}/patients/${patient?.id}/entries`, {
        ...values,
        diagnosisCodes: patientDiagnoses,
        type: 'HealthCheck'
      });
    } catch (e) {
      console.log(e);
    }
  };
  const onCancel = () => { console.log('submit '); };

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
      <Formik
        initialValues={{
          date: "",
          specialist: "",
          diagnosisCodes: [],
          description: "",
          healthCheckRating: 0
        }}
        onSubmit={onSubmit}
        validate={values => {
          const requiredError = "Field is required";
          const errors: { [field: string]: string } = {};
          if (!values.date) {
            errors.date = requiredError;
          }
          if (!values.specialist) {
            errors.specialist = requiredError;
          }
          if (!values.description) {
            errors.description = requiredError;
          }
          if (!values.healthCheckRating) {
            errors.healthCheckRating = requiredError;
          }
          return errors;
        }}
      >
        {({ isValid, dirty }) => {
          return (
            <Form className="form ui">
              <Field
                label="Description"
                placeholder="description"
                name="description"
                component={TextField}
              />
              <Field
                label="Specialist"
                placeholder="specialist"
                name="specialist"
                component={TextField}
              />
              <Field
                label="Date"
                placeholder="YYYY-MM-DD"
                name="date"
                component={TextField}
              />
              <SForm.Field>
                <label>Healthcheck rating</label>
                <Field as="select" name="healthCheckRating" className="ui dropdown">
                  {ratingOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label || option.value}
                    </option>
                  ))}
                </Field>
              </SForm.Field>
              <DiagnosisSelection
                diagnoses={diagnoses}
                setFieldValue={(field: "diagnosisCodes", value) => {setPatientDiagnoses(value);}}
                setFieldTouched={(field: "diagnosisCodes") => {console.log(field);}}
                // setFieldValue={{ field: diagnoses }} //FormikProps<{ diagnosisCodes: string[] }>["setFieldValue"];
                // setFieldTouched={[]} //FormikProps<{ diagnosisCodes: string[] }>["setFieldTouched"];
              />
              <Grid>
                <Grid.Column floated="left" width={5}>
                  <Button type="button" onClick={onCancel} color="red">
                    Cancel
                  </Button>
                </Grid.Column>
                <Grid.Column floated="right" width={5}>
                  <Button
                    type="submit"
                    floated="right"
                    color="green"
                    disabled={!dirty || !isValid}
                  >
                    Add
                  </Button>
                </Grid.Column>
              </Grid>
            </Form>
          );
        }}
      </Formik>

    </React.Fragment>
  );
};

export default SinglePatient;
