import React from 'react';

import {storiesOf} from '@storybook/react';
import HomePage from '../components/home-page'
import {AppContext, BlogDetail, useAppState} from '../types';
import {MemoryRouter} from 'react-router';

const Example = () => {
  const context = useAppState({
    saveBlog: async (blog: BlogDetail) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      if (blog.title === 'Error') {
        await Promise.reject('Some error happened')
      } else {
        await Promise.resolve('Success')
      }
    },
    saveImg: async (key: string, content: Blob) => {
      await new Promise(resolve => setTimeout(resolve, 1500))
      return await Promise.resolve('test.jpeg')
    }
  })

  return (<AppContext.Provider value={context}>
    <MemoryRouter initialEntries={['/']}><HomePage /></MemoryRouter>
  </AppContext.Provider>)
}

storiesOf('HomePage', module)
  .add('show home page', () =>
    <Example />
  )
