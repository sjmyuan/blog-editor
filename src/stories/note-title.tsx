import React from 'react';

import {storiesOf} from '@storybook/react';
import NoteTitle from "../components/note-title"

storiesOf('NoteTitle', module)
  .add('without link', () => <NoteTitle title="Functional Programming in Scala" />)
  .add('with link', () => <NoteTitle title="Functional Programming in Scala" link='http://www.baidu.com' />);
