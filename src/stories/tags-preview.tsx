import React from 'react';

import {storiesOf} from '@storybook/react';
import TagsPreview from "../components/tags-preview"
import {tagArray} from './fixture'
import {MemoryRouter} from 'react-router';

storiesOf('TagsPreview', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('show tags', () => <TagsPreview
    currentTags={tagArray}
  />);
