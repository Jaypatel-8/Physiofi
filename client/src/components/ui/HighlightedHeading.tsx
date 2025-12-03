'use client'

import React from 'react'

interface HighlightedHeadingProps {
  children: React.ReactNode
  className?: string
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
  highlightWords?: string[]
}

/**
 * Component that highlights focus words in headings with the theme color
 * Usage: <HighlightedHeading>Your Path to <strong>Better</strong> Movement</HighlightedHeading>
 * Or: <HighlightedHeading highlightWords={['Better', 'Movement']}>Your Path to Better Movement</HighlightedHeading>
 */
const HighlightedHeading: React.FC<HighlightedHeadingProps> = ({
  children,
  className = '',
  as: Component = 'h2',
  highlightWords = []
}) => {
  // If children is a string and highlightWords are provided, auto-highlight
  if (typeof children === 'string' && highlightWords.length > 0) {
    const parts = children.split(new RegExp(`(${highlightWords.join('|')})`, 'gi'))
    return (
      <Component className={className}>
        {parts.map((part, index) => {
          const shouldHighlight = highlightWords.some(
            word => part.toLowerCase() === word.toLowerCase()
          )
          return shouldHighlight ? (
            <span key={index} className="text-primary-500">
              {part}
            </span>
          ) : (
            <React.Fragment key={index}>{part}</React.Fragment>
          )
        })}
      </Component>
    )
  }

  // If children contains JSX with <strong> or <span> tags, highlight those
  const highlightContent = (node: React.ReactNode): React.ReactNode => {
    if (typeof node === 'string') {
      return node
    }

    if (React.isValidElement(node)) {
      if (node.type === 'strong' || node.type === 'b' || (node.type === 'span' && node.props.className?.includes('highlight'))) {
        return (
          <span className="text-primary-500">
            {node.props.children}
          </span>
        )
      }

      if (node.props.children) {
        return React.cloneElement(node, {
          ...node.props,
          children: React.Children.map(node.props.children, highlightContent)
        })
      }
    }

    if (Array.isArray(node)) {
      return node.map(highlightContent)
    }

    return node
  }

  return (
    <Component className={className}>
      {React.Children.map(children, highlightContent)}
    </Component>
  )
}

export default HighlightedHeading



