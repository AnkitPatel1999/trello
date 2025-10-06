import './App.css'
import Header from './components/header/Header'
import Board from './components/board/Board'

function App() {

  return (
    <>
      <div className='app-container'>
        <Header></Header>
        <div style={{ padding: 16 }}>
          <Board />
        </div>
      </div>
      
    </>
  )
}

export default App
