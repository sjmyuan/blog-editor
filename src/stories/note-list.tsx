import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import NoteList from "../components/note-list"
import NotePresentation from '../components/note-presentation'
import {noteContext, randomNoteContext} from './fixture'
import {MemoryRouter} from 'react-router';

storiesOf('NoteList', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('with text', () =>
    <NoteList notes={[randomNoteContext(), randomNoteContext(), randomNoteContext(), randomNoteContext()]}
      availableTags={noteContext.tags}
      addNote={action('addNote')} deleteNote={action('deleteNote')} selectNote={action('selectNote')} />)
  .add('presentation', () =>
    <NotePresentation notes={[randomNoteContext(), randomNoteContext(), randomNoteContext(), randomNoteContext()]} />)
