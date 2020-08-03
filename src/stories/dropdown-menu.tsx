import React from 'react';

import {storiesOf} from '@storybook/react';
import DropdwonMenu from "../components/dropdwon-menu"
import DropdownMenuItem from "../components/dropdwon-menu-item"
import {action} from '@storybook/addon-actions';

storiesOf('Dropdwon Menu', module)
  .add('show menu item', () => <DropdwonMenu text='Move To'>
    <DropdownMenuItem text="Scala" onClick={action("move to scala")} />
    <DropdownMenuItem text="Functional Programming" onClick={action("move to fp")} />
  </DropdwonMenu>)
