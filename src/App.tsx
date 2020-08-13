import React from 'react';
import HomePage from './components/home-page'
import {useAppState, AppContext, AWSServerApi} from './types'
import {BrowserRouter as Router, Route} from "react-router-dom"

import {withAuthenticator} from 'aws-amplify-react'; // or 'aws-amplify-react-native';
import Amplify from 'aws-amplify';
// Get the aws resources configuration parameters
import {awsConfig} from './types'; // if you are using Amplify CLI
import {createGlobalStyle} from 'styled-components'

createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Oswald&display=swap');
`
Amplify.configure(awsConfig);

const App: React.FC = () => {
  const context = useAppState(AWSServerApi('sjmyuan-ganggang-posts', 'sjmyuan-images', 'https://images.shangjiaming.com'))
  return (
    <AppContext.Provider value={context}>
      <Router>
        <Route path='/' exact component={HomePage} />
      </Router>
    </AppContext.Provider>
  );
}

export default withAuthenticator(App);
