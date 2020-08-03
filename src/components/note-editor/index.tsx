import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import Tags from '../tags-editor'
import {turndownServie, NoteContext, TagDetail, useAppContext} from '../../types'
import uuidv4 from 'uuid/v4'

const NoteContainer = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-flow: column;
    width: auto;
    height: auto;
    border: 1px solid transparent;
    border-radius: 8px;
    padding: 10px;
    overflow-wrap: break-word;
    margin-top: 10px;
    `
const NoteTextArea = styled.textarea`
    display: flex; 
    flex-grow: 1;
    width: auto;
    min-height: 100px;
    resize: vertical;
    font-size: large;
    border: 1px solid rgb(240,240,240);
    `

const TagsContainer = styled.div`
    `
const EditButtonContainer = styled.div`
    display: flex; 
    align-items: center;
    justify-content: center;
    flex-flow: row;
    width: auto;
    height: auto;
    `

const EditButtonStyle = styled.button`
    width: 100px;
    margin: 10px;
    font-size: large;
    `

interface NoteEditorOperation {
  addNote: (note: NoteContext) => void;
  cancelEdit: () => void;
}
interface NoteEditorProps {
  initialNoteContext: NoteContext;
  availableTags: TagDetail[];
  operations: NoteEditorOperation;
}

interface NoteEditorState {
  noteContext: NoteContext
  uploading: boolean
}

const NoteEditor = (props: NoteEditorProps) => {
  const context = useAppContext()

  const defaultState = {
    noteContext: props.initialNoteContext,
    uploading: false
  }
  const [state, setState] = useState<NoteEditorState>(defaultState)

  useEffect(() => {
    setState(defaultState)
  }, [props])

  const cancelEdit = (event: any) => {
    props.operations.cancelEdit()
    setState(defaultState)
  }

  const addNote = (event: any) => {
    props.operations.addNote(state.noteContext)
  }

  const changeTags = (tags: TagDetail[]) => {
    setState({
      ...state,
      noteContext: {
        note: state.noteContext.note,
        tags: tags
      }
    })
  }

  const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      noteContext: {
        note: {...state.noteContext.note, content: e.target.value},
        tags: state.noteContext.tags
      }
    })
  }

  const onPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    if (event.clipboardData.types.some(e => e === 'text/html')) {
      const markdown = turndownServie.turndown(event.clipboardData.getData('text/html'))
      const input = document.createElement('textarea');
      document.body.appendChild(input)
      input.value = markdown
      input.focus()
      input.select()
      document.execCommand('copy')
      document.body.removeChild(input)
      event.currentTarget.focus()
      document.execCommand('paste')
    }

    const files: {name: string, content: File}[] = []

    for (var i = 0; i < event.clipboardData.items.length; i++) {
      const item = event.clipboardData.items[i]
      if (['image/png', 'image/jpg', 'image/jpeg', 'image/gif'].some(e => e === item.type)) {
        const suffix = item.type.split('/')[1]
        const fileName = `files/${uuidv4()}.${suffix}`
        files.push({name: fileName, content: item.getAsFile() as File})
      }
    }

    if (files.length > 0) {
      setState({...state, uploading: true})
      Promise.all(files.map(file => context.actions.saveFile(file.name, file.content))).then(_ => {
        const images = files.map(file => `![server:${file.name}](server:${file.name})`).join('\n\n')
        setState({
          uploading: false,
          noteContext: {
            note: {...state.noteContext.note, content: state.noteContext.note.content + '\n' + images},
            tags: state.noteContext.tags
          }
        })
      }).catch((e) => {
        console.log(e)
        setState({...state, uploading: false})
      })
    }
  }


  return (
    <NoteContainer >
      <NoteTextArea onPaste={onPaste} autoFocus value={state.noteContext.note.content} onChange={changeContent} disabled={!props.operations || state.uploading} />
      <TagsContainer >
        <Tags
          currentTags={state.noteContext.tags}
          availableTags={props.availableTags}
          tagChanges={changeTags} />
      </TagsContainer>
      <EditButtonContainer>
        <EditButtonStyle onClick={cancelEdit}>Cancel</EditButtonStyle>
        <EditButtonStyle
          onClick={addNote}>OK</EditButtonStyle>
      </EditButtonContainer>
    </NoteContainer >
  )
}

export default NoteEditor;
