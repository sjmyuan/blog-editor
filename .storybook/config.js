import { configure } from '@storybook/react';

const req = require.context('../src/stories', true);

function loadStories() {
  req.keys().forEach(req)
}

configure(loadStories, module);
    
