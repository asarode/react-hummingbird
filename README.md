# react-hummingbird
React decorator that gives your component information about a Hummingbird (the anime site) user

## Usage
Install with `npm install react-hummingbird --save`

Hummingbird will give your decorated component access to a user's [Hummingbird](https://hummingbird.me/) profile information. Just decorate your class and include an initial username in the component's default props.

**!important:** When developing locally, your component will need to be served from port 4000 to access the Hummingbird API. The Hummingbird folks have their CORS headers set so only port 4000 works on localhost.

```
import hummingbird from 'hummingbird'

@hummingbird
class App extends React.component {
  ...
}

App.PropTypes = {
  username: 'React.PropTypes.string
}
App.defaultProps = {
  username: 'arjun_sarode' // That's me on Hummingbird if you're curious :)
}
```
## Added state object
Applying the decorator will add an `hb` object to your component's state. You can access whatever Hummingbird info by using `this.state.hb.whatever` Here's an example of what the object will look like:
```
hb: {
  loading: false, // true if currently fetching the data
  error: {}, // empty if no errors, else has `status` and `message` fields
  about: 'email@address',
  avatar: 'https://link/to/user/avatar/img',
  bio: '',
  coverImg: 'https://link/to/user/cover/img,
  favorites: [
    {
      ageRating: 'R17+',
      alternateTitle: null,
      comunityRating: 3.65983294882102,
      coverImg: 'https://link/to/anime/cover/img',
      episodeCount: 12,
      episodeLength: 24,
      finishedAiring: '2011-07-03',
      genres: [
        {
          name: 'Action'
        }
      ]
    }
  ],
  following: false, // honestly not too sure what this field does
  karma: 0,
  lastLibraryUpdate: Date object,
  lifeSpentOnAnime: 0, // time in minutes
  location: null,
  name: 'arjun_sarode', // the user's username
  showAdultContent: true,
  titleLanguagePreference: 'canonical',
  waifu: null,
  waifuCharId: '',
  waifuOrHusbando: false,
  waifuSlug: '#',
  website: null
}
```

## Default state
By default the hb object will be this:
```
{
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
  }
```
If you need to change this for any reason, the decorated component will get a `setInitialHbState()` function. You can return an object inside this function and it will be merged into the default state.
```
class App extends React.Component {
  ...
  setInitialHbState() {
    return {
      bio: 'I am overriding the default state' // now the default object will use this for its bio field instead of ''
    };
  }
}
```
## Manual fetching
react-hummingbird will trigger a new fetch whenever the component's `username` prop is changed. Your component will also receive a `fetchHbInfo()` function. You can call it to send out a request to fetch the user's information.
