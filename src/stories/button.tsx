import React from 'react';

import {storiesOf} from '@storybook/react';
import Button from "../components/buttons/button"
import Dropdown from "../components/buttons/drop-down"
import {action} from '@storybook/addon-actions';

storiesOf('Button', module)
  .add('normal', () => <Button onClick={action("click")}>New pull request</Button>)
  .add('drop down', () => <Dropdown onClick={action("click")}>New pull request</Dropdown>)
