import React, {useState} from 'react';
import styled from 'styled-components'
import {turndownServie, useAppContext, BlogContent} from '../../types'
import uuidv4 from 'uuid/v4'

const BlogContainer = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-flow: column;
    width: auto;
    height: auto;
    border: none;
    overflow-wrap: break-word;
    `
const BlogTextArea = styled.textarea`
    flex-grow: 1;
    width: auto;
    height: auto;
    min-height: 100px;
    resize: none;
    font-size: large;
    border: none;
    `
interface BlogEditorProps {
  content: BlogContent
  onContentChanged: (content: BlogContent) => void;
}

const BlogEditor = (props: BlogEditorProps) => {
  const context = useAppContext()

  const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onContentChanged(e.target.value)
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
        const fileName = `${uuidv4()}.${suffix}`
        files.push({name: fileName, content: item.getAsFile() as File})
      }
    }

    if (files.length > 0) {
      context.actions.setProgess(true)
      Promise.all(files.map(file => context.actions.saveImg(file.name, file.content))).then(url => {
        const images = files.map(file => `![server:${file.name}](${url})`).join('\n\n')
        props.onContentChanged(props.content + '\n' + images)
      }).catch((e) => {
        console.log(e)
        context.actions.showError(e.toString())
      }).finally(() => {
        context.actions.setProgess(false)
      })
    }
  }


  return (
    <BlogContainer >
      <BlogTextArea onPaste={onPaste} autoFocus value={props.content} onChange={changeContent} />
    </BlogContainer >
  )
}

export default BlogEditor;
