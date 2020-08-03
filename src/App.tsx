import React, {useEffect} from 'react';
import TagPage from './components/tag-page'
import HomePage from './components/home-page'
import {useAppState, AppContext, AWSServerApi} from './types'
import {BrowserRouter as Router, Route} from "react-router-dom"

import {withAuthenticator} from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
// Get the aws resources configuration parameters
import {awsConfig} from './types'; // if you are using Amplify CLI
import Modal from 'react-modal'
import {createGlobalStyle} from 'styled-components'

createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Oswald&display=swap');
`

Modal.setAppElement('#root');

Amplify.configure(awsConfig);

const App: React.FC = () => {
  const context = useAppState(AWSServerApi())
  useEffect(() => {
    context.actions.loadContext()
  }, [])
  return (
    <AppContext.Provider value={context}>
      <Router>
        <Route path='/tag/:tagId' exact render={(props) => (<TagPage tagId={props.match.params.tagId} />)} />
        <Route path='/' exact component={HomePage} />
      </Router>
    </AppContext.Provider>
  );
}

export default withAuthenticator(App);
