import React from 'react';

import { Entry, assertNever } from './../../types';
import HealthCheckEntry from './HealthCheckEntry';
import HospitalEntry from './HospitalEntry';
import OccupationalHeathCareEntry from './OccupationalHealthCareEntry';

const EntryDetails: React.FC<{entry: Entry}> = ({ entry }) => {
    switch(entry.type) {
      case 'Hospital':
        return <HospitalEntry entry={entry} />;
      case 'OccupationalHealthcare':
        return <OccupationalHeathCareEntry entry={entry} />;
      case 'HealthCheck':
        return <HealthCheckEntry entry={entry} />;
      default:
          assertNever(entry);
          return <HospitalEntry entry={entry} />;
    }
};

export default EntryDetails;
