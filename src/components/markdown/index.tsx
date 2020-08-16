import React, {ReactNode, useState, useEffect} from 'react';
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import highlight from 'rehype-highlight'
import rehype2react from 'rehype-react'
import raw from 'rehype-raw'
import hljs from 'highlight.js/lib/highlight';
import javascript from 'highlight.js/lib/languages/javascript';
import scala from 'highlight.js/lib/languages/scala'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import shell from 'highlight.js/lib/languages/shell'
import typescript from 'highlight.js/lib/languages/typescript'
import python from 'highlight.js/lib/languages/python'
import xml from 'highlight.js/lib/languages/xml'
import http from 'highlight.js/lib/languages/http'
import 'highlight.js/styles/github.css';
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('scala', scala);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('json', json);
hljs.registerLanguage('shell', shell);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('python', python);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('http', http);

interface MarkdownProps {
  source: string;
  getUrl?: (url: string) => Promise<string>
}

interface MarkdownState {
  renderedNode?: ReactNode
}

const Markdown = (props: MarkdownProps) => {

  const [state, setState] = useState<MarkdownState>({renderedNode: undefined})

  useEffect(() => {
    unified()
      .use(parse)
      //.use<any[]>((processor, settings) => customMarkdownTransformer)
      .use(remark2rehype, {allowDangerousHTML: true})
      .use(highlight)
      //.use<any[]>((processor, settings) => customHtmlTransformer)
      .use(raw)
      .use(rehype2react, {createElement: React.createElement})
      .process(props.source).then(result => {
        setState({renderedNode: result.contents})
      })
  }, [props.source])

  return (
    <div>
      {
        state.renderedNode
      }
    </div>
  )
}

export default Markdown;
