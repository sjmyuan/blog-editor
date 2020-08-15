import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import HomePage from '../components/home-page'
import {AppContext, BlogDetail} from '../types';
import {MemoryRouter} from 'react-router';

const Example = () => {
  const context = {
    state: {info: 'This is info message', error: 'This is error message', inProgress: false}, actions: {
      saveBlog: async (blog: BlogDetail) => {action('saveBlog')},
      saveImg: async (key: string, img: Blob) => {action('saveImg'); return ''},
      showInfo: (message?: string) => {action('showInfo')},
      showError: (message?: string) => {action('showError')},
      setProgess: (inProgress: boolean) => {action('setProgess')}
    }
  }
  return (<AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}><HomePage /></MemoryRouter>
  </AppContext.Provider>)
}

storiesOf('HomePage', module)
  .add('show home page', () =>
    <Example />
  )
