import React from 'react'
import './App.css'

function App() {

  const animateWord = (text:string)=>{
    return text.split("").map((char, i)=>{
      return <span className='animate-letters' key={i} style={{'--i': i} as React.CSSProperties}>{char}</span>
    })
  }

  return (
    <h1 className='animate' aria-label='Yiğit Ziştoylu'>
      {animateWord("Yiğit Ziştoylu")}
      </h1>
  )
}

export default App
