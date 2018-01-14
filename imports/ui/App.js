import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { withTracker } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import StarRating from 'react-star-rating';
 
import { Tasks } from '../api/tasks.js';
import { Reviews } from '../api/tasks.js';
 
import Task from './Task.js';
import AccountsUIWrapper from './AccountsUIWrapper.js';
 
// App component - represents the whole app


class App extends Component {

   handleSubmit(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    
    //ReactDOM.findDOMNode(this.refs.ratingInput).value = '';
    


    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();

    sentiment(text, function( e, result ) { console.log( (5+result["score"])/2 )} );
    sentiment(text, function( e, result ) { this.realHandleSubmit((5+result["score"])/2)}.bind(this) );
 
  }

  realHandleSubmit(score) {

    const text = ReactDOM.findDOMNode(this.refs.textInput).value.trim();
    const rating = score


    Reviews.insert({
      text,
      rating, // current time
      createdAt: new Date(),
      owner: Meteor.userId(),           // _id of logged in user
      username: Meteor.user().username,  // username of logged in user
    });
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textInput).value = ''; 


   

  }

  renderReviews() {
    return this.props.reviews.map((review) => (
      <Task key={review.createdAt} task={review} />
    ));
  }
 
 render() {
     return (
       <div className="container">
         <header>
           <h1>Please Leave a Review</h1>

           <AccountsUIWrapper />    

          { this.props.currentUser ?
            <form className="new-task" onSubmit={this.handleSubmit.bind(this)} >
          
              <input
                type="text"
                ref="textInput"
                placeholder="Please type a review"
              />
            </form> : ''
          }

         </header>
 
         <ul>
           {this.renderReviews()}
         </ul>
       </div>
    );
  }
}

export default withTracker(() => {
  return {
    //reviews: Reviews.find({}, { sort: { rating: -1 } }).fetch(),
    reviews: Reviews.find({}, { sort: { createdAt: -1 } }).fetch(),
    currentUser: Meteor.user(),
  };
})(App);