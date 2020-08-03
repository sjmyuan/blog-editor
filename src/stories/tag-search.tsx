import React from 'react';

import {storiesOf} from '@storybook/react';
import TagSearch from "../components/tag-search"
import {tagArray} from './fixture'
import {MemoryRouter} from 'react-router';
import {action} from '@storybook/addon-actions';

storiesOf('TagSearch', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('one tag', () => <TagSearch tags={tagArray} addTag={action('addTag')} />);
