import React from 'react';

import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import HomePage from '../components/home-page'

storiesOf('HomePage', module)
    .add('show home page', () => <HomePage />)
