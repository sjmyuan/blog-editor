import React, {useEffect} from 'react';

import {storiesOf} from '@storybook/react';
import HomePage from "../components/home-page"
import {AppContext, useAppState} from '../types'
import {MemoryRouter} from 'react-router';
import {MockServerApi} from './fixture'

const Example = () => {
  const context = useAppState(MockServerApi('http://localhost:3000'))
  useEffect(() => {
    context.actions.loadContext()
  }, [])
  return (<AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}><HomePage /></MemoryRouter>
  </AppContext.Provider>)
}

storiesOf('HomePage', module)
  .add('with text', () => <Example />);
