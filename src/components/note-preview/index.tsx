import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import TagsPreview from '../tags-preview'
import CloseIcon from '../../close.png'
import {NoteContext, NoteId, TagId} from '../../types'
import Markdown from '../markdown'

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
    overflow-wrap: break-word;
    `
const NotePreviewDiv = styled.div`
    display: flex;
    flex-direction: column;
    align-iterm: flex-start;
    `

const TagsContainer = styled.div<{showButton: boolean}>`
    opacity: ${props => props.showButton ? 100 : 0};
    `
const ButtonContainerDiv = styled.div`
     display: flex;
     flex-flow: row;
     justify-content: space-between;
     align-iterms: center;
    `
const CloseButtonDiv = styled.div<{showButton: boolean}>`
    width: 12px;
    height: 12px;
    background-image: url(${CloseIcon});
    background-size: 12px 12px;
    opacity: ${props => props.showButton ? 100 : 0};
    `

const SelectBoxInput = styled.input<{show: boolean}>`
    opacity: ${props => props.show ? 100 : 0};
    `

interface NotePreviewProps {
  initialNoteContext: NoteContext;
  hideTags?: TagId[]
  deleteNote: (id: NoteId) => void;
  selectNote: (noteContext: NoteContext, selected: boolean) => void;
  getUrl?: (key: string) => Promise<string>;
}

interface NotePreviewState {
  showButton: boolean
  selected: boolean
}

const NotePreview = (props: NotePreviewProps) => {
  const defaultState = {
    showButton: false,
    selected: false
  }
  const [state, setState] = useState<NotePreviewState>(defaultState)

  useEffect(() => {
    setState(defaultState)
  }, [props.initialNoteContext])

  const mouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setState({
      showButton: true,
      selected: state.selected
    })
  }

  const mouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setState({
      showButton: false,
      selected: state.selected
    })
  }

  const selectNote = (e: React.ChangeEvent<HTMLInputElement>) => {
    props.selectNote(props.initialNoteContext, e.target.checked)
    setState({
      showButton: state.showButton,
      selected: e.target.checked
    })
  }

  const showedTags = () => {
    return props.initialNoteContext.tags.filter(tag => props.hideTags ? !props.hideTags.some(id => tag.id === id) : true)
  }

  return (
    <NoteContainer >
        <Markdown source={props.initialNoteContext.note.content} getUrl={props.getUrl} />
    </NoteContainer >
  )
}

export default NotePreview;
