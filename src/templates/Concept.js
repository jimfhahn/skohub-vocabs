/** @jsx jsx */
import { css, jsx } from '@emotion/core'
import { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'

import "../components/layout.css"

const Concept = ({pageContext}) => {
  const [index, setIndex] = useState(FlexSearch.create('speed'))
  const [query, setQuery] = useState(null)

  // Fetch and load the serialized index
  useEffect(() => {
    fetch(pageContext.baseURL +  getPath(pageContext.node.inScheme.id, 'index'))
      .then(response => response.json())
      .then(serialized => {
        const idx = FlexSearch.create()
        idx.import(serialized)
        setIndex(idx)
        console.log("index loaded", idx.info())
      })
  }, [])

  useEffect(() => {
    const current = document.querySelector(".current")
    current && current.scrollIntoView({behavior: "smooth", block: "center", inline: "nearest"})
  })

  return (
  <div className="Concept">

    <div className="layout"
     css={css`
      display: flex;
      max-height: 100vh;
      font-size: 16px;
      font-family: futura-pt,sans-serif,sans-serif;
      color: #3c3c3c;

      a {
        text-decoration: none;
        color: #3c3c3c;
      }

      a.current {
        color: tomato;
        font-weight: bold;
      }

      & > nav {
        flex: 1;
        border-right: 1px solid black;
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        input[type=text] {
          width: 100%;
          border: 1px solid black;
          border-left: none;
          border-right: none;
          padding: 5px 10px;
        }

        & > ul {
          overflow: auto;
          margin: 0;
          padding: 10px;
        }
      }

      .content {
        padding: 20px;
        flex: 3;
      }

      .markdown {
        padding-top: 10px;
      }
    `}>
    <nav>
      <input
        type="text"
        onChange={e => setQuery(e.target.value || null)}
        placeholder="Search"
      />
      <NestedList
        items={JSON.parse(pageContext.tree).hasTopConcept}
        current={pageContext.node.id}
        baseURL={pageContext.baseURL}
        filter={query ? index.search(query) : null}
        highlight={RegExp(escapeRegExp(query), 'gi')}
      />
    </nav>
    <div className="content">
      <h1>{t(pageContext.node.prefLabel)}</h1>
      <h2>{pageContext.node.id}</h2>
      <form action={pageContext.node.hub} method="post">
        <input type="hidden" name="hub.topic" value={pageContext.node.id} />
        <input type="hidden" name="hub.callback" value={pageContext.node.id} />
        <button type="submit" name="hub.mode" value="subscribe">Subscribe</button>
      </form>
      <p>
        <a href={pageContext.node.inbox}>Inbox</a>
      </p>
      {pageContext.node.definition
        && (
          <div className="markdown">
            <h3>Definition</h3>
            <Markdown>
              {t(pageContext.node.definition)}
            </Markdown>
          </div>
        )
      }
      {pageContext.node.scopeNote
        && (
          <div className="markdown">
            <h3>Scope Note</h3>
            <Markdown>
              {t(pageContext.node.scopeNote)}
            </Markdown>
          </div>
        )
      }
    </div>
    </div>
  </div>
)}

export default Concept
