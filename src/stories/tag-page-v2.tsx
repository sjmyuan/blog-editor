import React, {useEffect} from 'react';

import {storiesOf} from '@storybook/react';
import TagPage from "../components/tag-page-v2"
import {mockMemoryAppContext} from './fixture'

storiesOf('TagPageV2', module)
  .add('with text', () => <TagPage currentTag='id1' context={mockMemoryAppContext} />);
