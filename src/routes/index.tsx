import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { firebase } from 'firebaseConfig'
import Times from 'pages/Times'
import Todos from 'pages/Todos'
import Logs from 'pages/Logs'

interface Props {
  currentUser: firebase.User
}

const Routes = ({ currentUser }: Props) => {
  return (
    <Switch>
      <Route exact path={['/', '/times']}>
        <Times currentUser={currentUser} />
      </Route>

      <Route path={'/todos'}>
        <Todos currentUser={currentUser} />
      </Route>

      <Route exact path={'/logs'}>
        <Logs currentUser={currentUser} />
      </Route>
    </Switch>
  )
}

export default Routes
