import React from 'react';

import {storiesOf} from '@storybook/react';
import Tag from "../components/tag"
import {tagDetail} from './fixture'
import {MemoryRouter} from 'react-router';

storiesOf('Tag', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('show tag with link', () => <Tag tag={tagDetail} />)
