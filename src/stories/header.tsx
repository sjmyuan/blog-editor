import React from 'react';

import {storiesOf} from '@storybook/react';
import {MemoryRouter} from 'react-router';
import Header from '../components/header'

storiesOf('Header', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('enabled', () => <Header />)
