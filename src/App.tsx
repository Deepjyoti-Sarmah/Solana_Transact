// import './App.css'
import WalletContextProvider from './context/WalletContextProvider'
import AppBar from './componets/AppBar'
import HomePage from './componets/HomePage'
import Footer from './componets/Footer'

function App() {

  return (
    <>
      <WalletContextProvider cluster={'devnet'}>
        <AppBar />
        <HomePage />
        <Footer />
      </WalletContextProvider>
    </>
  )
}

export default App
