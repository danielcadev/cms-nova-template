import React from 'react';
import { ViewContentComponent } from './ViewContentComponent';

// Mock data
const mockData = {
  contentTypes: [],
  plans: [],
  allContentEntries: []
};

export default function ViewContentPage() {
  return (
    <ViewContentComponent 
      contentTypes={mockData.contentTypes}
      plans={mockData.plans}
      allContentEntries={mockData.allContentEntries}
    />
  );
}

export { ViewContentComponent };
