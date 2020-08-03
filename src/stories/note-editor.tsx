import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import NoteEditor from "../components/note-editor"
import {noteContext} from './fixture'
import {MemoryRouter} from 'react-router';
import ModalNoteEditor from '../components/modal-note-editor'

storiesOf('NoteEditor', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>{story()}</MemoryRouter>)
  })
  .add('enabled', () => <NoteEditor
    initialNoteContext={noteContext}
    availableTags={noteContext.tags}
    operations={{addNote: action('addNote'), cancelEdit: action('cancelEdit')}} />)
  .add('with modal', () => <ModalNoteEditor
    noteContext={noteContext}
    availableTags={noteContext.tags}
    deleteNote={action('deleteNote')}
    selectNote={action('selectNote')}
    addNote={action('addNote')} />);
