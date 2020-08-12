import React from 'react';
import GridLayout from 'react-grid-layout';
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import BlogEditor from '../blog-editor'
import BlogPreview from '../blog-preview'
import {BlogDetail} from '../../types';

interface HomePageProps {
  saveBlog: (blog: BlogDetail) => void;
}

const HomePage = (props: HomePageProps) => {
  const blog: BlogDetail = {id: '', title: 'Untitled', content: 'Hello', lastModified: 1, createdAt: 2};

  return (
    <GridLayout className="layout" margin={[2, 0]} cols={2} rowHeight={30} width={1200}>
      <div key="editor" data-grid={{x: 0, y: 0, w: 1, h: 2}}>
        <BlogEditor saveBlog={props.saveBlog} />
      </div>
      <div key="preview" data-grid={{x: 1, y: 0, w: 1, h: 2}}>
        <BlogPreview blog={blog} />
      </div>
    </GridLayout>
  )
}

export default HomePage;
