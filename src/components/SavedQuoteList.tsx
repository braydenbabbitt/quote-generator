import { useState } from 'react';
import type * as CSS from 'csstype';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

type Quote = {
  id: string,
  text: string,
  author: string
}

interface SavedQuoteListProps {
  quotes: Quote[],
  isOpen: boolean,
  handleClose: () => void,
  handleDelete: (arg0: string) => void,
}

export const SavedQuoteList: React.FC<SavedQuoteListProps> = (props: SavedQuoteListProps) => {
  const containerStyles: CSS.Properties = {
    backgroundColor: props.isOpen ? 'rgba(0,0,0,0.15)' : 'transparent',
    zIndex: props.isOpen ? 1 : -1,
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: '0',
    right: '0',
    transition: props.isOpen ? 'background-color 0.5s' : 'background-color 0.5s, z-index 0s ease 0.5s'
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
    transition: 'transform 0.5s',
    boxShadow: props.isOpen ? '-5px 0px 5px rgba(0,0,0,0.15)' : 'none',
    overflow: 'hidden',
  }

  // TODO: Finish sidebar designs
  return (
    <>
      <div style={containerStyles} onClick={() => props.handleClose()}></div>
      <aside style={listStyles}>
        <div style={{ position: 'sticky', top: '0', padding: '25px', backgroundColor: '#FFF', boxShadow: '0 2px 10px rgba(0,0,0,0.15)', textAlign: 'right' }}>
          <FontAwesomeIcon icon={faXmark} onClick={() => props.handleClose()} style={{ color: '#232323', fontSize: '28px', cursor: 'pointer' }} />
        </div>
        <div style={{ padding: '0 25px 25px 25px', overflowY: 'auto' }}>
          {props.quotes.map(item => {
            return <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '25px', padding: '15px 0', borderBottom: '1px solid #D2D2D2' }}>
              <div>
                <h2 style={{ fontSize: '1.25em', margin: 0 }}>"{item.text}"</h2>
                <h3 style={{ fontSize: '0.9em', margin: 0 }}>- {item.author}</h3>
              </div>
              <FontAwesomeIcon icon={faXmark} onClick={() => props.handleDelete(item.id)} style={{ color: 'red', fontSize: '28px', marginLeft: 'auto', cursor: 'pointer' }} />
            </div>
          })}
        </div>
      </aside>
    </>
  )
}