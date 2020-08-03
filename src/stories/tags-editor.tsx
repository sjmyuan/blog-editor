import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import TagsEditor from "../components/tags-editor"
import {tagArray} from './fixture'
import {MemoryRouter} from 'react-router';

storiesOf('TagsEditor', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('edit tag', () => <TagsEditor
    currentTags={[tagArray[0]]}
    tagChanges={action('tagChanges')}
    availableTags={tagArray}
  />);
