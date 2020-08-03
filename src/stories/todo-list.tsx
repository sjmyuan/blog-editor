import React from 'react';

import {storiesOf} from '@storybook/react';
import {action} from '@storybook/addon-actions';
import ToDoList from "../components/todo-list"
import {noteDetail} from './fixture'

storiesOf('To Do List', module)
  .add('one item', () =>
    <ToDoList toDos={[noteDetail]} moveToDone={action('moveToDone')} addToDo={action('addToDo')} />)
  .add('multiple item', () =>
    <ToDoList toDos={[noteDetail, noteDetail, noteDetail]} moveToDone={action('moveToDone')} addToDo={action('addToDo')} />)
