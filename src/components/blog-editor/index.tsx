import React, {useState, ChangeEvent} from 'react';
import styled from 'styled-components'
import {turndownServie, useAppContext, BlogContent} from '../../types'
import uuidv4 from 'uuid/v4'
import reduce from 'image-blob-reduce'
import {makeStyles, createStyles, Theme} from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import PhotoCamera from '@material-ui/icons/PhotoCamera';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
      display: 'none',
    },
  }),
);

const imgReduce = reduce()

imgReduce._create_blob = function (env: any) {
  return this.pica.toBlob(env.out_canvas, 'image/jpeg', 0.95)
    .then(function (blob: any) {
      env.out_blob = blob;
      return env;
    });
};

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
const BlogButtonContainer = styled.div`
    display: flex;
    flex-flow: row nowrap;
    width: auto;
    height: auto;
    border-bottom: 1px solid;
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

  const classes = useStyles()

  const changeContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    props.onContentChanged(e.target.value)
  }

  const uploadImg = (files: {name: string, content: File}[]) => {
    if (files.length > 0) {
      context.actions.setProgess(true)
      Promise.all(files.map(file =>
        imgReduce.toBlob(file.content, {max: 480})
          .then((blob: Blob) => context.actions.saveImg(file.name, blob as Blob))
          .then((url: string) => `![server:${file.name}](${url})`)
      )).then(markdowns => props.onContentChanged(props.content + '\n' + markdowns.join('\n\n')))
        .catch((e) => {
          console.log(e)
          context.actions.showError(e.toString())
        }).finally(() => {
          context.actions.setProgess(false)
        })
    }
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
      uploadImg(files)
    }
  }

  const handleUploadClick = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      var file = event.target.files[0];
      if (file) {
        const suffix = file.type.split('/')[1]
        const fileName = `${uuidv4()}.${suffix}`
        uploadImg([{name: fileName, content: file}])
      }
    }
  };


  return (
    <BlogContainer >
      <BlogButtonContainer>
        <input accept="image/*" className={classes.input} id="icon-button-file" type="file" onChange={handleUploadClick} />
        <label htmlFor="icon-button-file">
          <IconButton color="primary" aria-label="upload picture" component="span">
            <PhotoCamera />
          </IconButton>
        </label>
      </BlogButtonContainer>
      <BlogTextArea onPaste={onPaste} autoFocus value={props.content} onChange={changeContent} />
    </BlogContainer >
  )
}

export default BlogEditor;
