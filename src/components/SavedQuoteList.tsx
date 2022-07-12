import { useState } from 'react';
import type * as CSS from 'csstype';

type Quote = {
  id: string,
  text: string,
  author: string
}

interface SavedQuoteListProps {
  quotes: Quote[],
  isOpen: boolean,
  handleClose: () => void
}

export const SavedQuoteList: React.FC<SavedQuoteListProps> = (props: SavedQuoteListProps) => {
  const containerStyles: CSS.Properties = {
    backgroundColor: props.isOpen ? 'rgba(0,0,0,0.33)' : 'transparent',
    transform: props.isOpen ? 'translateX(0)' : 'translateX(100vw)',
    zIndex: 1,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    right: '0',
    transition: 'background-color 0.5s'
  }
  const listStyles: CSS.Properties = {
    zIndex: 2,
    width: '85vw',
    height: '100vh',
    maxWidth: '500px',
    display: 'flex',
    position: 'fixed',
    right: '0',
    top: '0',
    flexDirection: 'column',
    transform: props.isOpen ? 'translateX(0)' : 'translateX(100vw)',
    backgroundColor: 'white',
    transition: 'transform 0.5s'
  }

  // TODO: Finish sidebar designs
  return (
    <>
      {props.isOpen ? <aside style={containerStyles}>
      </aside> : null}
      <div style={listStyles}>
        <button onClick={() => props.handleClose()}>X</button>
        {props.quotes.map(item => {
          return <div key={item.id}>
            <h2>{item.text}</h2>
            <h3>{item.author}</h3>
          </div>
        })
        }
      </div>
    </>
  )
}