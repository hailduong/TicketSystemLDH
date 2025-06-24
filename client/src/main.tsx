// client/src/main.tsx
import * as ReactDOM from 'react-dom/client'
import {BrowserRouter} from 'react-router-dom'
import {Provider} from 'react-redux'
import {ThemeProvider} from 'styled-components' // Import ThemeProvider
import {theme} from './styles' // Import your theme
import {store} from './app/slices/store'
import App from './app/app'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <App/>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
)
