import '../App.css';
import React from 'react';
import { Card } from 'semantic-ui-react';
import { Button } from 'semantic-ui-react';


const Main = () => {

  const items = [
    {
      header: 'Project Report - April',
      description:
        'Leverage agile frameworks to provide a robust synopsis for high level overviews.',
      meta: 'ROI: 30%',
    },
    {
      header: 'Project Report - May',
      description:
        'Bring to the table win-win survival strategies to ensure proactive domination.',
      meta: 'ROI: 34%',
    },
  ]

  return (
    <div>
        <Card.Group centered items={items} />        
    </div>
  );
}

export default Main;