import React from 'react'
import { createRoot } from 'react-dom/client'
import './styles.css'
import Component from '/private/tmp/mcp-template-bumps/mcp-i18n-adaptive/resources/context-display/widget.tsx'

const container = document.getElementById('widget-root')
if (container && Component) {
  const root = createRoot(container)
  root.render(<Component />)
}
