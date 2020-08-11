import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import BlogEditor from "../components/blog-editor"
import {MemoryRouter} from 'react-router';

storiesOf('BlogEditor', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('enabled', () => <NoteEditor
    initialNoteContext={noteContext}
    availableTags={noteContext.tags}
    operations={{addNote: action('addNote'), cancelEdit: action('cancelEdit')}} />)
