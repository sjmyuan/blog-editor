import React from 'react';

import {storiesOf} from '@storybook/react';
import ResizableContainer from "../components/resizable-container"

storiesOf('Resizable Container', module)
  .add('can be resizable', () => {
    return (<ResizableContainer> Hello World!</ResizableContainer>)
  })
