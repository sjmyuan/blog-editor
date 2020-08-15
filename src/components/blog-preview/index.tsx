import React from 'react';
import styled from 'styled-components'
import Markdown from '../markdown'
import {BlogContent} from '../../types';

const BlogContainer = styled.div`
    flex-grow: 1;
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-flow: column;
    width: auto;
    height: auto;
    border: 1px solid transparent;
    border-radius: 8px;
    overflow-wrap: break-word;
    overflow: scroll;
    `
interface BlogPreviewProps {
  content: BlogContent
}

const BlogPreview = (props: BlogPreviewProps) => {

  return (
    <BlogContainer >
      <Markdown source={props.content} />
    </BlogContainer >
  )
}

export default BlogPreview;
