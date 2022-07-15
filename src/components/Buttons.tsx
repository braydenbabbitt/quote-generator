import React, { useState } from 'react';
import type * as CSS from 'csstype';
import { getHighestContrast } from '../utils/colorComparison';

type TextButtonProps = {
  onClick?: () => any,
  fontSize?: CSS.StandardLonghandProperties['fontSize'],
  fontWeight?: CSS.StandardLonghandProperties['fontWeight'],
  hasBorder?: boolean,
  primaryColor?: CSS.StandardLonghandProperties['color'],
  secondaryColor?: CSS.StandardLonghandProperties['color'],
  children?: React.ReactNode,
};
const defaultProps = {
  fontSize: '1em',
  fontWeight: 'normal',
  hasBorder: true,
  primaryColor: '#FFF',
}

export const TextButton: React.FC<TextButtonProps> = (props: TextButtonProps) => {
  const [state, setState] = useState({
    hover: false
  })

  // Implement default props
  props = {
    ...defaultProps,
    secondaryColor: getHighestContrast(props.primaryColor ? props.primaryColor : defaultProps.primaryColor, ['#FFF', '#000']),
    ...props
  }

  // Set up styles
  const styles: CSS.Properties = {
    backgroundColor: state.hover ? props.primaryColor : 'transparent',
    cursor: 'pointer',
    border: props.hasBorder ? `1px solid ${props.primaryColor}` : 'none',
    padding: '8px 12px',
    borderRadius: '5px',
    fontSize: props.fontSize,
    fontWeight: props.fontWeight,
    color: state.hover ? props.secondaryColor : props.primaryColor,
    transition: 'background-color 0.15s, color 0.15s'
  }

  // Functions and handlers
  const handleMouseEnter = () => {
    setState(prevState => ({
      ...prevState,
      hover: true
    }))
  }
  const handleMouseLeave = () => {
    setState(prevState => ({
      ...prevState,
      hover: false
    }))
  }

  return (
    <button onClick={props.onClick} style={styles} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      {props.children}
    </button>
  )
}