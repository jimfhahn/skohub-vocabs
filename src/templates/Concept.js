/** @jsx jsx */
import { jsx } from '@emotion/core'
import { useEffect, useState } from 'react'
import Markdown from 'markdown-to-jsx'
import FlexSearch from 'flexsearch'
import escapeRegExp from 'lodash.escaperegexp'
import { t, getPath } from '../common'
import NestedList from '../components/nestedList'
import TreeControls from '../components/TreeControls'
import Layout from "../components/layout"
import SEO from "../components/seo"

import { style } from '../styles/concepts.css.js'

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
  <Layout>
  <SEO title={t(pageContext.node.prefLabel)} keywords={['Concept', t(pageContext.node.prefLabel)]} />
  <div
    className="Concept"
    css={style}
  >
    <nav className="block">
      <input
        type="text"
        className="inputStyle"
        onChange={e => setQuery(e.target.value || null)}
        placeholder="Search"
        autoFocus
      />
      <TreeControls/>
      <NestedList
        items={JSON.parse(pageContext.tree).hasTopConcept}
        current={pageContext.node.id}
        baseURL={pageContext.baseURL}
        filter={query ? index.search(query) : null}
        highlight={query ? RegExp(escapeRegExp(query), 'gi'): null}
      />
    </nav>
    <div className="content block">
      <h1>
        {pageContext.node.notation &&
          <span>{pageContext.node.notation.join(',')}&nbsp;</span>
        }
        {t(pageContext.node.prefLabel)}
      </h1>
      <h2>{pageContext.node.id}</h2>
      <p>
        <a href={`/deck/?hub=wss://test.skohub.io&topic=${encodeURIComponent(pageContext.node.id)}`}>Subscribe</a>
      </p>
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
      {pageContext.node.note
        && (
          <div className="markdown">
            <h3>Note</h3>
            <Markdown>
              {t(pageContext.node.note)}
            </Markdown>
          </div>
        )
      }
    </div>
    </div>
  </Layout>
)}

export default Concept
