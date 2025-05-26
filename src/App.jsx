// import './App.css'
import { Provider } from 'react-redux'
import store from './redux_setup/store'
import RoutesConfig from './routes/router'

function App() {

  return (
    <>
          <Provider store={store}>
               <RoutesConfig/>
          </Provider>
    </>
  )
}

export default App
