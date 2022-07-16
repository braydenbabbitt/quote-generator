import { useEffect, useState } from 'react';
import { useLocalStorage } from './hooks/CustomHooks';
import './App.css'
import type * as CSS from 'csstype';
import WebFont from 'webfontloader';
import colorContrast from 'color-contrast';
import { SavedQuoteList } from './components/SavedQuoteList';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { TextButton } from './components/Buttons';
import IconButton from '@mui/material/IconButton';
import { Favorite, FavoriteBorderOutlined, Key } from '@mui/icons-material';

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
  const toggleCurrentQuoteSave = () => {
    setSavedQuotes(previous => {
      if (!previous.includes(state.quote)) {
        return [...previous, state.quote];
      } else {
        return [...previous.filter(item => item.id !== state.quote.id)];
      }
    })
  }
  const openQuote = (quote: Quote) => {
    if (state.quote.id !== quote.id) {
      setState(previous => ({
        ...previous,
        quote: quote,
        color: getNewColor(7),
        savedListIsOpen: false,
      }));
    }
  }
  const deleteQuote = (id: string) => {
    setSavedQuotes(previous => [...previous.filter(item => item.id !== id)]);
  }

  useEffect(() => {
    window.addEventListener("keydown", (e) => { if (e.key === 'Enter') generateNewQuote(setState); });
    return () => { window.removeEventListener("keydown", (e) => { if (e.key === 'Enter') generateNewQuote(setState) }); }
  }, []);

  return (
    <>
      <section id='app' style={appStyles}>
        <FontAwesomeIcon icon={faBars} onClick={() => openSavedQuoteList()} style={{ color: '#FFF', fontSize: '24px', position: 'absolute', right: '25px', top: '25px', cursor: 'pointer' }} />
        <div id='card' style={cardStyles}>
          {state.quote.text === '' ? null : <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <h2 style={{ color: state.color, fontWeight: 'bold', transition: 'color 0.3s', margin: '0' }}>"{state.quote.text}"</h2>
            <h3 style={{ color: state.color, fontWeight: 'lighter', transition: 'color 0.3s', margin: '0' }}>{state.quote.author}</h3>
          </div>}
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            {state.quote.text === '' ? null : <a href={`https://twitter.com/intent/tweet?related=braydentbabbitt&text=${encodeURIComponent(`"${state.quote.text}" - ${state.quote.author}`)}`}>
              <TextButton fontSize='0.9em' primaryColor={state.quote.text === '' ? '#FFF' : state.color}>Tweet</TextButton>
            </a>}
            <TextButton fontSize='0.9em' onClick={() => generateNewQuote(setState)} primaryColor={state.quote.text === '' ? '#FFF' : state.color}>{state.quote.text === '' ? 'Get Quote' : 'Get New Quote'}</TextButton>
            {state.quote.text === '' ? null : <IconButton onClick={toggleCurrentQuoteSave} >{savedQuotes.includes(state.quote) ? <Favorite sx={{ fontSize: '1.15em' }} htmlColor="#e40ce8" /> : <FavoriteBorderOutlined sx={{ fontSize: '1.15em' }} htmlColor={state.color} />}</IconButton>}
          </div>
        </div>
        <a href="https://braydenbabbitt.com" id='creator-button' target='_blank'><TextButton fontSize='0.85em' fontWeight='bold' hasBorder={false}>Created by Brayden Babbitt</TextButton></a>
      </section >
      <SavedQuoteList quotes={savedQuotes} isOpen={state.savedListIsOpen} handleClose={closeSavedQuoteList} handleDelete={deleteQuote} handleOpenQuote={openQuote} />
    </>
  )
}

export default App;