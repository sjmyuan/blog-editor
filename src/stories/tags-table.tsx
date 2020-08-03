import React from 'react';

import {storiesOf} from '@storybook/react';
import TagsTable from "../components/tags-table"
import {tagArray} from './fixture'
import {MemoryRouter} from 'react-router';
import {action} from '@storybook/addon-actions';

storiesOf('TagsTable', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('show tags', () => <TagsTable
    onSelected={action('onSelected')}
    currentTags={[...tagArray, ...tagArray]}
  />);
