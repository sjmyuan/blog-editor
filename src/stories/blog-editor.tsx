import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import BlogEditor from "../components/blog-editor"

storiesOf('BlogEditor', module)
  .add('enabled', () => <BlogEditor content='' onContentChanged={action('contentChanged')} />)
