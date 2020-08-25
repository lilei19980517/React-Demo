import React from 'react';
import { BrowserRouter, Route,Redirect } from 'react-router-dom'
import Home from './pages/Home'
import CityList from './pages/CityList'
import './assets/fonts/iconfont.css'

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <Route  path='/' exact render={()=><Redirect to='/home' />}/>
        <Route  path='/home' component={Home}/>
      </BrowserRouter>
    )
  }
}

export default App;
