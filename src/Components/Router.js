import React from 'react'
import { Switch, Route } from 'react-router-dom'
import BrowserSpecs from './BrowserSpecs'
import MainSearchBox from './MainSearchBox'


const Router = () => (
  <main>
    <Switch>
      <Route exact path='/' component={MainSearchBox}/>
      <Route path='/browserspecs' component={BrowserSpecs}/>
    </Switch>
  </main>
)

export default Router