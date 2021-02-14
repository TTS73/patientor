import React from 'react';
import { Icon } from 'semantic-ui-react';

import { Entry } from '../../types';

const OccupationalHeathCareEntry: React.FC<{entry: Entry}> = ({ entry }) => {
  return (
    <React.Fragment>
      <h2>{entry.date}<Icon name="stethoscope"/></h2>
      <p>{entry.description}</p>
    </React.Fragment>
  );
};

export default OccupationalHeathCareEntry;
