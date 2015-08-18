'use strict';
import request from 'superagent-bluebird-promise';
import Promise from 'bluebird';
import humps from 'humps';

export default function hummingbird(component) {
  /**
   *
   * Overridden functions on the base component. Saved them to a shorter name
   * because typing them all out when overriding them looks ugly.
   */
  let cdm = component.prototype.componentDidMount;
  let cwm = component.prototype.componentWillMount;
  let cwrp = component.prototype.componentWillReceiveProps;

  /**
   *
   * Fetches the given user's profile information
   *
   * @param {String} username The Hummingbird username to search for.
   *                          Will default to using base component's
   *                          `username` prop
   */
  function _fetchProfileInfo(username) {
    let _username = username || this.props.username;
    // Prevents fetching the all users endpoint
    if (_username.trim() === '') return;
    let base = 'https://hummingbird.me/api/v1';
    let url = `${base}/users/${_username}`;
    this.setState({
      hb: Object.assign(this.state.hb, {
        loading: true
      })
    });

    request.get(url)
      .then(res => {
        let { body } = res;
        // Convert the fetched profile info to camelCase and save it to the
        // state object
        this.setState({
          hb: Object.assign(this.state.hb, humps.camelizeKeys(body))
        });
        // Fetch the favorite anime objects
        return Promise.map(body.favorites, fav => {
          let url = `${base}/anime/${fav.item_id}`;
          return request.get(url)
            .then(res => {
              return res.body;
            });
        });
      })
      .then(favs => {
        // Convert the fetched favorite anime info to camelCase and merge it
        // into the state object
        this.setState({
          hb: Object.assign(this.state.hb, {
            favorites: humps.camelizeKeys(favs)
          })
        });
      })
      .catch(res => {
        // Set the `hb.error` object with the error code and message
        this.setState({
          hb: Object.assign({}, _defaults, {
            error: {
              code: res.status,
              message: res.message
            }
          })
        });
      })
      .finally(() => {
        this.setState({
          hb: Object.assign(this.state.hb, {
            loading: false
          })
        });
      })
  }

  /**
   *
   * The default values for the profile information
   */
  let _defaults = {
    loading: false,
    error: {},
    about: '',
    avatar: '',
    bio: '',
    coverImg: '',
    favorites: [],
    following: false,
    karma: 0,
    lastLibraryUpdate: Date.now(),
    lifeSpentOnAnime: 0,
    location: null,
    name: '',
    showAdultContent: true,
    titleLanguagePreference: '',
    waifu: null,
    waifuCharId: '',
    waifuOrHusbando: false,
    waifuSlug: '',
    website: null
  };

  /**
   *
   * Assigns the default values to the base component's state object.
   * Will default to using the `_defaults` object, or it will merge in
   * the object returned from the base component's `setInitialHbState`
   * function.
   */
  function _setDefaults() {
    if (component.prototype.setInitialHbState) {
      // Change the value of `_defaults`
      _defaults = Object.assign(_defaults,
        component.prototype.setInitialHbState());
    }
    // Make a copy of `_defaults` so it's not changed when state.hb is changed
    this.setState({
      hb: Object.assign({}, _defaults)
    });
  }

  /**
   *
   * Adds a function to the base component that fetches the user's
   * profile information.
   */
  component.prototype.fetchHbInfo = function() {
    _fetchProfileInfo.call(this);
  }

  /**
   *
   * Overrides the base component's `componentWillMount` function to
   * set default values in its state object.
   */
  component.prototype.componentWillMount = function() {
    _setDefaults.call(this);
    if (cwm) cwm.call(this);
  }

  /**
   *
   * Overrides the base component's `componentDidMount` function to fetch the
   * user's information.
   */
  component.prototype.componentDidMount = function() {
    _fetchProfileInfo.call(this);
    if (cdm) cdm.call(this);
  }

  /**
   *
   * Overrides the base component's `componentWillReceiveProps` function to
   * update the user's information if the `username` prop has changed.
   */
  component.prototype.componentWillReceiveProps = function(nextProps) {
    if (nextProps.username !== this.props.username) {
      _fetchProfileInfo.call(this, nextProps.username);
    }
    if (cwrp) cwrp.call(this);
  }
}