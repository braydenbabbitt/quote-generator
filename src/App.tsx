import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/CustomHooks';
import './App.css'
import type * as CSS from 'csstype';
import WebFont from 'webfontloader';
import colorContrast from 'color-contrast';
import { SavedQuoteList } from './components/SavedQuoteList';

const FONTS = {
  primaryFont: 'Open Sans'
}
const QUOTE_API_URL = "https://api.quotable.io/random";
const getNewColor = (minContrast: number) => {
  let resultColor = Math.floor(Math.random() * 16777215).toString(16);
  while (colorContrast(`\#${resultColor}`, "#FFFFFF") <= minContrast) {
    resultColor = Math.floor(Math.random() * 16777215).toString(16);
  }
  return "#" + resultColor;
}

function App() {
  // Get fonts
  useEffect(() => {
    WebFont.load({
      google: {
        families: [FONTS.primaryFont]
      }
    });
  }, []);

  // Types
  type Quote = {
    id: string,
    text: string,
    author: string
  }

  // Setup initial state and localStorage
  const [savedQuotes, setSavedQuotes] = useLocalStorage<Quote[]>('quotes', []);
  const [state, setState] = useState({
    quote: {
      id: '',
      text: '',
      author: '',
    },
    color: '#232323',
    creatorButtonHover: false,
    quoteButtonHover: false,
    tweetButtonHover: false,
    saveButtonHover: false,
    savedListIsOpen: false,
  });

  // Use quotable.io API to get a new quote
  async function getQuote() {
    const response = await fetch(QUOTE_API_URL);
    return await response.json();
  }

  // Style objects
  const appStyles: CSS.Properties = {
    backgroundColor: state.color,
    fontFamily: FONTS.primaryFont,
    minHeight: '100vh',
    minWidth: '100vw',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.3s'
  }
  const cardStyles: CSS.Properties = {
    backgroundColor: state.quote.text === '' ? '#323232' : '#FAFAFA',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: '1',
    alignItems: 'center',
    padding: '35px',
    boxShadow: '2px 2px 10px rgba(0, 0, 0, 0.25)',
    borderRadius: '15px',
    width: '70vw',
    maxWidth: '800px',
    transition: 'height 0.3s, background-color 0.3s',
    gap: '35px',
  }
  const creatorButtonStyles: CSS.Properties = {
    color: (state.quote.text !== '' && state.creatorButtonHover) ? state.color : '#FAFAFA',
    textDecoration: 'none',
    backgroundColor: state.creatorButtonHover ?
      state.quote.text === '' ? '#323232' : "#FFF" :
      'transparent',
    transition: 'background-color 0.3s, color 0.3s',
    padding: '8px 12px',
    borderRadius: '8px',
    fontWeight: 'bold',
    fontSize: '0.85em',
    boxShadow: state.creatorButtonHover ? '2px 2px 4px rgba(0, 0, 0, 0.15)' : 'none'
  }
  const quoteButtonStyles: CSS.Properties = {
    backgroundColor: state.quoteButtonHover ?
      state.quote.text === '' ? '#FFF' : state.color :
      'transparent',
    cursor: 'pointer',
    border: `1px solid ${state.quote.text === '' ? '#FFF' : state.color}`,
    padding: '8px 12px',
    borderRadius: '5px',
    fontSize: '0.9em',
    color: state.quoteButtonHover ?
      state.quote.text === '' ? '#232323' : '#FFF' :
      state.quote.text === '' ? '#FFF' : '#232323',
    transition: 'background-color 0.15s, color 0.15s'
  }
  const tweetButtonStyles: CSS.Properties = {
    backgroundColor: state.tweetButtonHover ?
      state.quote.text === '' ? '#FFF' : state.color :
      'transparent',
    cursor: 'pointer',
    border: `1px solid ${state.quote.text === '' ? '#FFF' : state.color}`,
    padding: '8px 12px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.9em',
    color: state.tweetButtonHover ?
      state.quote.text === '' ? '#232323' : '#FFF' :
      state.quote.text === '' ? '#FFF' : '#232323',
    transition: 'background-color 0.15s, color 0.15s'
  }
  const saveButtonStyles: CSS.Properties = {
    backgroundColor: state.saveButtonHover ?
      state.quote.text === '' ? '#FFF' : state.color :
      'transparent',
    cursor: 'pointer',
    border: `1px solid ${state.quote.text === '' ? '#FFF' : state.color}`,
    padding: '8px 12px',
    borderRadius: '5px',
    textDecoration: 'none',
    fontSize: '0.9em',
    color: state.saveButtonHover ?
      state.quote.text === '' ? '#232323' : '#FFF' :
      state.quote.text === '' ? '#FFF' : '#232323',
    transition: 'background-color 0.15s, color 0.15s'
  }

  // Handle generating a new quote action
  const generateNewQuote = (setState: (arg0: (prevState: any) => any) => void) => {
    getQuote().then(result => {
      setState(prevState => ({
        ...prevState,
        quote: {
          id: result._id,
          text: result.content,
          author: result.author
        },
        color: getNewColor(7)
      }))
    })
  }

  const closeSavedQuoteList = () => {
    setState(prevState => ({
      ...prevState,
      savedListIsOpen: false
    }))
  }
  const openSavedQuoteList = () => {
    setState(prevState => ({
      ...prevState,
      savedListIsOpen: true
    }))
  }

  return (
    <>
      <section id='app' style={appStyles}>
        <button onClick={() => openSavedQuoteList()}>Open Side</button>
        <div id='card' style={cardStyles}>
          {state.quote.text === '' ? null : <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h2 style={{ color: state.color, fontWeight: 'bold', transition: 'color 0.3s', margin: '0' }}>"{state.quote.text}"</h2>
            <h3 style={{ color: state.color, fontWeight: 'lighter', transition: 'color 0.3s', margin: '0' }}>{state.quote.author}</h3>
          </div>}
          <div style={{ display: 'flex', gap: '15px' }}>
            {state.quote.text === '' ? null : <a onMouseEnter={() => setState(prevState => ({ ...prevState, tweetButtonHover: true }))}
              onMouseLeave={() => setState(prevState => ({ ...prevState, tweetButtonHover: false }))}
              style={tweetButtonStyles}
              target="_blank"
              href={`https://twitter.com/intent/tweet?related=braydentbabbitt&text=${encodeURIComponent(`"${state.quote.text}" - ${state.quote.author}`)}`}
            >
              Tweet
            </a>}
            <button style={quoteButtonStyles}
              onMouseEnter={() => setState(prevState => ({ ...prevState, quoteButtonHover: true }))}
              onMouseLeave={() => setState(prevState => ({ ...prevState, quoteButtonHover: false }))}
              onClick={() => generateNewQuote(setState)}
            >
              {state.quote.text === '' ? 'Get Quote' : 'Get New Quote'}
            </button>
            {state.quote.text === '' ? null : <button style={saveButtonStyles}
              onClick={() => {
                setSavedQuotes(previous => {
                  if (!previous.includes(state.quote)) {
                    return [...previous, state.quote];
                  }
                  return previous;
                })
              }}
              onMouseEnter={() => setState(prevState => ({ ...prevState, saveButtonHover: true }))}
              onMouseLeave={() => setState(prevState => ({ ...prevState, saveButtonHover: false }))}>
              Save Quote
            </button>}
          </div>
        </div>
        <a href='https://braydenbabbitt.com' id='creator-button' style={creatorButtonStyles} target='_blank' onMouseEnter={() => setState(prevState => ({ ...prevState, creatorButtonHover: true }))} onMouseLeave={() => setState(prevState => ({ ...prevState, creatorButtonHover: false }))}>
          Created by Brayden Babbitt
        </a>
      </section >
      <SavedQuoteList quotes={savedQuotes} isOpen={state.savedListIsOpen} handleClose={closeSavedQuoteList} />
    </>
  )
}

export default App;