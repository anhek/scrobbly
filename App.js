import React, { useEffect } from 'react'
import { AppLoading } from 'expo'
import AppNavigator from './navigation/AppNavigator'
import {
  Inter_400Regular,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter'
import { OverflowMenuProvider } from 'react-navigation-header-buttons'

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import ReduxThunk from 'redux-thunk'

import authReducer from './store/authReducer'
import scrobblesReducer from './store/scrobblesReducer'
import { setSpotifyToken } from './utils/spotify'

const roorReducer = combineReducers({
  auth: authReducer,
  scrobbles: scrobblesReducer,
})

const store = createStore(roorReducer, applyMiddleware(ReduxThunk))

export default function App() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  })

  useEffect(() => {
    setSpotifyToken()
  }, [])

  if (!fontsLoaded) {
    return <AppLoading />
  } else {
    return (
      <Provider store={store}>
        <OverflowMenuProvider>
          <AppNavigator />
        </OverflowMenuProvider>
      </Provider>
    )
  }
}
