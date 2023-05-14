## 🚀 Run This Project In Your Local Machine:

### You need:

- `yarn`
- `nodejs`
- `npm`

### Steps:

Clone this repo in your local machine with:

- `git clone https://github.com/vincentlinzhu/sbhacksIX.git`

In the project directory, you can run:

- `yarn install`
- `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

# Gift Share

![screenshot](screenshot.png)

- GiftShare is perfect for content creators create Q&A rooms for their public.
- Admins can mark questions as answered, highlighted and delete questions.
- Users can create and like gift suggestion posts.
- Login with Google authentication.
- To join rooms users need the rooms code, which can be clippboarded by the room admin.

[Gift Share](gift-share-9825e.web.app)

## 💻 Project

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

This project was developed in the Next Level Week, free program designed by [@RocketSeat](https://github.com/rocketseat-education) to help developers learn by bulding projects.

## 🧪 Built With

- React
- TypeScript
- Firebase

### Firebase:

- Change .env to include the firebase configuration to your account:

Make sure to add the following to your .env:

```
name: apiKey =>             REACT_APP_API_KEY
name: authDomain =>         REACT_APP_AUTH_DOMAIN
name: databaseURL =>        REACT_APP_DATABASE_URL
name: projectId =>          REACT_APP_PROJECT_ID
name: storageBucket =>      REACT_APP_STORAGE_BUCKET
name: messagingSenderId =>  REACT_APP_MESSAGING_SENDER_ID
name: appId =>              REACT_APP_APP_ID
```

- Update .firebaserc file to default the project ID to one created in your firebase console.

- Enable Google as an authentication option in your firebase console.
