import React, { Component } from "react";
import config from "../config";
import BookmarksContext from "../BookmarksContext";
import './EditBookmark.css'

export default class EditBookmarkForm extends Component {
  /* state for inputs etc... */
  static contextType= BookmarksContext
  state = {
    id: "",
    title: "",
    url_link: "",
    descript: "",
    rating: 1,
    error: null
  };
  componentDidMount() {
    const bookmarkId = this.props.match.params.id;
    console.log(bookmarkId);
    fetch(config.API_ENDPOINT + `${bookmarkId}`, {
      method: "GET",
      headers: {
        authorization: `bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok) {
          return res.json().then(error => {
            // then throw it
            throw error;
          });
        }
        return res.json();
      })
      .then(resJson => {
        console.log(resJson);

        this.setState({
          id: resJson.id,
          title: resJson.title,
          url_link: resJson.url_link,
          descript: resJson.descript,
          rating: resJson.rating
        });
      })

      .catch(error => {
        console.error(error);
        this.setState({ error });
      });
  }
  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  }
  handleChangeUrl = e => {
    this.setState({ url_link: e.target.value });
  }
  handleChangeDescript = e => {
    this.setState({ descript: e.target.value });
  }
  handleChangeRating = e => {
    this.setState({ rating: e.target.value });
  }
  handleClickCancel = () => {
    this.props.history.push('/')
      }
  handleSubmit = e => {
    e.preventDefault()
    const bookmarkId = this.props.match.params.id;
    const {id, title, url_link, descript, rating}= this.state
    const newBookmark = {id, title, url_link, descript, rating}
    console.log(bookmarkId);
    fetch(config.API_ENDPOINT + `${bookmarkId}`, {
      method: "PATCH",
      body: JSON.stringify(newBookmark),
      headers: {
        'authorization': `bearer ${config.API_KEY}`,
        'content-type': 'application/json',
      },
    })
    .then(res=>{
      if(!res.ok)
      return res.json().then(error=>Promise.reject(error))
    
    })
    
    .then(() => {
      this.resetFields(newBookmark)
      this.context.updateBookmark(newBookmark)
      this.props.history.push('/')
    })
    .catch(error => {
      console.error(error)
      this.setState({ error })
    })
}
resetFields = (newFields) => {
  this.setState({
    id: newFields.id || '',
    title: newFields.title || '',
    url: newFields.url || '',
    description: newFields.description || '',
    rating: newFields.rating || '',
  })
}
  render() {
    const { title, url_link, descript, rating } = this.state;
    console.log(`edit form rendered`);
    return (
      <section className="EditBookmarkForm">
        <h2>Edit Bookmark</h2>
        <form className="EditBookmarkForm" onSubmit={this.handleSubmit}>
          <div className="EditBookmark__error" role="alert">
            {this.state.error && <p>{this.state.error.message}</p>}
          </div>
          <label htmlFor="title">Title </label>
          <input
            id="title"
            type="text"
            name="title"
            placeholder="Great article!"
            required
            value={title}
            onChange={this.handleChangeTitle}
          />
          <label htmlFor="url">URL </label>
          <input
            id="url_link"
            type="text"
            name="title"
            placeholder="https://greatwebsite.com"
            required
            value={url_link}
            onChange={this.handleChangeUrl}
          />
          <label htmlFor="descript">Description </label>
          <input
            id="descript"
            type="text"
            name="descript"
            placeholder="Great description"
            required
            value={descript}
            onChange={this.handleChangeDescript}
          />
          <label htmlFor="rating">Rating </label>
          <input
            id="rating"
            type="number"
            name="rating"
            placeholder="1"
            min='1'
              max='5'
            required
            value={rating}
            onChange={this.handleChangeRating}
          />
          <div classname ='EditBookmarkButtons'>
          <button type='button' onClick={this.handleClickCancel}>
              Cancel
            </button>
          <button type='submit'>
              Save
            </button>
            </div>
        </form>

      </section>
    );
  }
}
