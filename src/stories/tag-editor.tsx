import React from 'react';

import {storiesOf} from '@storybook/react';
import TagEditor from "../components/tag-editor"
import {tagDetail} from './fixture'
import {tagArray} from './fixture'
import {action} from '@storybook/addon-actions';

storiesOf('Tag Editor', module)
  .add('without related tags', () => <TagEditor tag={tagDetail} availableTags={tagArray} updateTag={action("updateTag")} />)
