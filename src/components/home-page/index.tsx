import React, {useState} from 'react';
import {Responsive, WidthProvider} from 'react-grid-layout';
import styled from 'styled-components'
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'
import BlogEditor from '../blog-editor'
import BlogPreview from '../blog-preview'
import {BlogDetail, useAppContext} from '../../types';
import Button from '@material-ui/core/Button';
import uuidv4 from 'uuid/v4'
import {CircularProgress, Snackbar} from '@material-ui/core';
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const ResponsiveGridLayout = WidthProvider(Responsive);

const ItemContainer = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: stretch;
    flex-flow: column;
    border: 1px solid;
    overflow: scroll;
    `
const TitleContainer = styled.div`
    display: flex;
    align-items: stretch;
    justify-content: center;
    flex-flow: column;
    font-size: large;
    `

const OperationContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    flex-flow: column;
    `

const InProgressContainer = styled.div<{inProgress: boolean}>`
    position: fixed;
    display: ${props => props.inProgress ? 'flex' : 'none'};
    flex-flow: row nowrap;
    align-items: center;
    justify-content: center;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    `



interface HomePageState {
  blog: BlogDetail
}

const HomePage = () => {
  const context = useAppContext()
  const defaultState = {
    blog: {
      id: uuidv4(),
      content: ''
    }
  }
  const [state, setState] = useState<HomePageState>(defaultState)

  const saveBlog = () => {
    context.actions.startProcess()
    context.actions.saveBlog(state.blog)
      .then(() => {
        context.actions.showInfo('Succeed to save blog!')
        setState(defaultState)
      })
      .catch(e => context.actions.showError(e.toString()))
  }

  const largeLayout = [
    {i: 'title', x: 0, y: 0, w: 2, h: 0.2},
    {i: 'editor', x: 0, y: 1, w: 1, h: 2},
    {i: 'preview', x: 1, y: 1, w: 1, h: 2},
    {i: 'operation', x: 0, y: 2, w: 2, h: 0.5},
  ];

  const smallLayout = [
    {i: 'title', x: 0, y: 0, w: 1, h: 0.2},
    {i: 'editor', x: 0, y: 1, w: 1, h: 2},
    {i: 'preview', x: 0, y: 2, w: 1, h: 2},
    {i: 'operation', x: 0, y: 3, w: 1, h: 0.5},
  ];

  const layouts = {lg: largeLayout, md: largeLayout, sm: smallLayout, xs: smallLayout, xxs: smallLayout}

  return (
    <div>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={!!context.state.info} autoHideDuration={6000} onClose={() => context.actions.showInfo()}>
        <Alert onClose={() => context.actions.showInfo()} severity="info">
          {context.state.info}
        </Alert>
      </Snackbar>
      <Snackbar anchorOrigin={{vertical: 'top', horizontal: 'center'}} open={!!context.state.error} autoHideDuration={6000} onClose={() => context.actions.showError()}>
        <Alert onClose={() => context.actions.showError()} severity="error">
          {context.state.error}
        </Alert>
      </Snackbar>
      <ResponsiveGridLayout className='layout'
        layouts={layouts}
        breakpoints={{lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0}}
        cols={{lg: 2, md: 2, sm: 1, xs: 1, xxs: 1}}
        isDraggable={false}
        isDroppable={false}
        isResizable={false}
        compactType={'vertical'}>
        <TitleContainer key='title' >
          <input placeholder='Untitled' type='text' value={state.blog.title ? state.blog.title : ''} onChange={(x) => setState({...state, blog: {...state.blog, title: x.target.value}})} />
        </TitleContainer>
        <ItemContainer key='editor' >
          <BlogEditor content={state.blog.content} onContentChanged={(x) => setState({...state, blog: {...state.blog, content: x}})} />
        </ItemContainer>
        <ItemContainer key='preview' >
          <BlogPreview content={state.blog.content} />
        </ItemContainer>
        <OperationContainer key='operation'>
          <Button variant='contained' color='primary' onClick={saveBlog} disabled={!state.blog.title || state.blog.title === ''}> Save </Button>
        </OperationContainer>
      </ResponsiveGridLayout>
      <InProgressContainer inProgress={context.state.inProgress}>
        <CircularProgress />
      </InProgressContainer>
    </div >
  )
}

export default HomePage;
