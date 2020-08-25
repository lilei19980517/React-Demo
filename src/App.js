import React from 'react';
import { BrowserRouter, Route,Redirect } from 'react-router-dom'
import Home from './pages/Home'
import Map from './components/Map/Map'
import CityList from './pages/CityList'
import Login from './pages/Login'
import Registe from './pages/Registe'
import './assets/fonts/iconfont.css'
class App extends React.Component {
  componentDidMount(){console.clear()}
  render() {
    return (
          <BrowserRouter>
            <Route  path='/' exact render={()=><Redirect to='/home' />}/>
            <Route  path='/home' component={Home}/>
            <Route  path='/map' component={Map}/>
            <Route exact path='/citylist' component={CityList} />
            <Route path="/registe" component={Registe} />
            <Route path="/login" component={Login} />
          </BrowserRouter>
    )
  }
}

export default App;
