import React, {ReactNode, useState, useEffect} from 'react';
import unified from 'unified'
import parse from 'remark-parse'
import remark2rehype from 'remark-rehype'
import highlight from 'rehype-highlight'
import rehype2react from 'rehype-react'
import raw from 'rehype-raw'
import hljs from 'highlight.js/lib/highlight';
import visit from 'unist-util-visit';
import {Node} from 'unist';
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
import mermaid from 'mermaid'
import uuidv4 from 'uuid/v4'
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


  const customMarkdownTransformer = async (tree: Node) => {
    var nodeUpdates: Promise<void>[] = []
    const updateNodeUrl = async (node: Node) => {
      const match = /^server:(.*)/.exec(node.url as string)
      node.url = props.getUrl && match ? await props.getUrl(match[1]) : node.url
    }

    if (props.getUrl) {
      visit(tree, ['link', 'image'], (node: Node) => {
        nodeUpdates = [...nodeUpdates, updateNodeUrl(node)]
      })
    }

    //const updateMermaid = async (node: Node) => {
      //const svg = await new Promise((resolve, reject) => {
        //mermaid.mermaidAPI.render(`mermaid-${uuidv4()}`, node.value as string, (svg) => {
          //if (svg) {
            //resolve(svg)
          //}
          //else {
            //reject("failed to generate svg")
          //}
        //})
      //})

      //node.type = 'html'
      //node.value = svg
      //node.lang = null
      //console.log(node)
    //}

    //visit(tree, 'code', (node: Node, index: number, parent: Node) => {
      //if (node.lang === 'mermaid') {
        //nodeUpdates = [...nodeUpdates, updateMermaid(node)]
      //}
    //})

    await Promise.all(nodeUpdates)

    return tree
  }

  const customHtmlTransformer = async (tree: Node) => {
    visit(tree, 'element', (node: Node) => {
      if (node.tagName === 'img') {
        const props: any = node.properties ? node.properties as any : {}
        props.style = 'max-width: 100%;'
      }
    })
    return tree
  }

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
