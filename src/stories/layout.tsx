import React from 'react';

import {storiesOf} from '@storybook/react';
import Layout from "../components/layout"

storiesOf('layout', module)
  .add('show layout', () => {
    const dock = <a>Dock</a>
    const content = <a>Content</a>
    return (<Layout dock={dock} content={content} />)
  })
