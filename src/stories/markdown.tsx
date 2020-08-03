import React from 'react';

import {storiesOf} from '@storybook/react';
import Markdown from "../components/markdown"
import {MemoryRouter} from 'react-router';

storiesOf('Markdown', module)
  .addDecorator(story => {
    return (<MemoryRouter initialEntries={['/']}>
      {story()}
    </MemoryRouter>)
  })
  .add('show javascript', () => <Markdown source={'\`\`\`javascript \n console.log(\'hello world!\') \n \`\`\`'} />)
  .add('show scala', () => <Markdown source={'\`\`\`scala \n val a="hello world!" \n \`\`\`'} />)
  .add('show json', () => <Markdown source={'\`\`\`json \n { "key": "hello world!" } \n \`\`\`'} />)
  .add('show paragraph', () => <Markdown source={'# Hello World \n\n ## Hello World \n '} />)
  .add('show link', () => <Markdown source={'[Baidu](http://www.baidu.com)'} />)
  .add('show link with transform', () => <Markdown source={'[Baidu](server:http://www.baidu.com)'} getUrl={async (url: String) => `${url}/transferred`} />)
  .add('show image with transform', () => <Markdown source={'![Baidu](server:http://www.baidu.com)'} getUrl={async (url: String) => `${url}/transferred`} />)
  .add('show diagram', () => <Markdown source={'\`\`\`mermaid \n graph LR\n Start --> Stop \n \`\`\`'} />)
