import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import NotePreview from "../components/note-preview"
import {noteContext} from './fixture'
import {MemoryRouter} from 'react-router';

storiesOf('NotePreview', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('show note', () => <NotePreview initialNoteContext={noteContext} deleteNote={action('deleteNote')} selectNote={action('selectNote')} />)
  .add('hide scala tag', () => <NotePreview initialNoteContext={noteContext} hideTags={['id1']} deleteNote={action('deleteNote')} selectNote={action('selectNote')} />)
  .add('hide all tag', () => <NotePreview initialNoteContext={noteContext} hideTags={['id1', 'id2', 'id3', 'id4', 'id5', 'id6', 'id7']} deleteNote={action('deleteNote')} selectNote={action('selectNote')} />)
