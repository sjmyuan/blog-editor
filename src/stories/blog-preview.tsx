import React from 'react';

import {storiesOf} from '@storybook/react';
import BlogPreview from "../components/blog-preview"
import {randomBlogContext} from './fixture';

storiesOf('BlogPreview', module)
  .add('show blog', () => <BlogPreview content={randomBlogContext()} />)
