import React, {useState, useEffect} from 'react';
import styled from 'styled-components'
import Markdown from '../markdown'
import { BlogDetail } from '../../types';

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
    overflow-wrap: break-word;
    `
interface BlogPreviewProps {
  blog: BlogDetail
}

const BlogPreview = (props: BlogPreviewProps) => {

  return (
    <BlogContainer >
        <Markdown source={props.blog.content} />
    </BlogContainer >
  )
}

export default BlogPreview;
