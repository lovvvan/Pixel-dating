import React from 'react';
import CurrentUserContext from './CurrentUserContext';

export default class CurrentUserProvider extends React.Component {
    constructor(props) {
      super(props)
        this.state = {
          username : '',
          userID: '',
      } 
    }
    
    render() {
        return (
            <CurrentUserContext.Provider
                value={{
                    username: this.state.username,
                    userID: this.state.userID,
                    setUser: (username, userID) => {
                      this.setState({username: username, userID: userID})
                    },
                }}
            >
                {this.props.children}
            </CurrentUserContext.Provider>
        );
    }
}