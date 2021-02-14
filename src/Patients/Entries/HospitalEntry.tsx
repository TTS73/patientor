import React from 'react';
import { Icon } from 'semantic-ui-react';

import { Entry } from '../../types';

const HospitalEntry: React.FC<{entry: Entry}> = ({ entry }) => {
  return (
    <React.Fragment>
      <h2>{entry.date}<Icon name="hospital"/></h2>
      <p>{entry.description}</p>
    </React.Fragment>
  );
};

export default HospitalEntry;
