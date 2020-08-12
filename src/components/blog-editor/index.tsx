import React, {useState} from 'react';
import styled from 'styled-components'
import {turndownServie, useAppContext, BlogDetail} from '../../types'
import uuidv4 from 'uuid/v4'

const BlogContainer = styled.div`
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
const BlogTextArea = styled.textarea`
    display: flex; 
    flex-grow: 1;
    width: auto;
    min-height: 100px;
    resize: vertical;
    font-size: large;
    border: 1px solid rgb(240,240,240);
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
interface BlogEditorProps {
  saveBlog: (blog: BlogDetail) => void;
}

interface BlogEditorState {
  blog: BlogDetail
  uploading: boolean
}

const BlogEditor = (props: BlogEditorProps) => {
  const context = useAppContext()

  const defaultState = {
    blog: {id: '', title: 'Untitled', content: '', lastModified: 1, createdAt: 2},
    uploading: false
  }
  const [state, setState] = useState<BlogEditorState>(defaultState)

  const saveBlog = (event: any) => {
    props.saveBlog(state.blog)
  }

  const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setState({
      ...state,
      blog: {
        ...state.blog, content: e.target.value
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
      Promise.all(files.map(file => context.actions.saveImg(file.name, file.content))).then(_ => {
        const images = files.map(file => `![server:${file.name}](server:${file.name})`).join('\n\n')
        setState({
          uploading: false,
          blog: {
            ...state.blog, content: state.blog.content + '\n' + images
          }
        })
      }).catch((e) => {
        console.log(e)
        setState({...state, uploading: false})
      })
    }
  }


  return (
    <BlogContainer >
      <BlogTextArea onPaste={onPaste} autoFocus value={state.blog.content} onChange={changeContent} disabled={state.uploading} />
      <EditButtonContainer>
        <EditButtonStyle
          onClick={saveBlog}>OK</EditButtonStyle>
      </EditButtonContainer>
    </BlogContainer >
  )
}

export default BlogEditor;
