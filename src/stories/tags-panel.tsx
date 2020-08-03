import React from 'react';

import {storiesOf} from '@storybook/react';
import TagsPanel from "../components/tags-panel"
import {tagArray} from './fixture'
import {action} from '@storybook/addon-actions';

storiesOf('Tags Panel', module)
  .add('show tags', () => <TagsPanel tags={tagArray} onSelected={action('selected')} />);
