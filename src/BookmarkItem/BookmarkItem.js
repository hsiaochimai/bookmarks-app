import React from 'react';
import Rating from '../Rating/Rating';
import config from '../config';
import {Link} from 'react-router-dom'
import BookmarksContext from '../BookmarksContext'
import './BookmarkItem.css';

function deleteBookmarkRequest(bookmarkId, callback) {
  fetch(config.API_ENDPOINT + `/${bookmarkId}`, {
    method: 'DELETE',
    headers: {
      'authorization': `bearer ${config.API_KEY}`,
      'content-type': 'application/json',
    }
  })
    .then(res => {
      if (!res.ok) {
        // get the error message from the response,
        return res.json().then(error => {
          // then throw it
          throw error
        })
      }
      
    })
    .then(()=> {
      // call the callback when the request is successful
      // this is where the App component can remove it from state
      callback(bookmarkId)
    
    })
    .catch(error => {
      console.error(error)
    })
}

export default function BookmarkItem(props) {
  return (
    <BookmarksContext.Consumer>
      {(context)=>(
    <li className='BookmarkItem'>
      <div className='BookmarkItem__row'>
        <h3 className='BookmarkItem__title'>
          <a
            href={props.url}
            target='_blank'
            rel='noopener noreferrer'>
            {props.title}
          </a>
          
        </h3>
        <Rating value={props.rating} />
      </div>
      <p className='BookmarkItem__description'>
        {props.description}
      </p>
      <Link to={`/edit/bookmark/${props.id}`}>Edit Bookmark</Link>
      <div className='BookmarkItem__buttons'>
        <button
          className='BookmarkItem__description'
          onClick={() => {
            deleteBookmarkRequest(
              props.id,
              context.deleteBookmark,
            )
          }}
        >
          Delete
        </button>
      </div>
    </li>
    )} 
    </BookmarksContext.Consumer>
  )
}

BookmarkItem.defaultProps = {
  onClickDelete: () => {},
}
