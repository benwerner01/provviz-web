# ProvViz Application

The *ProvViz Application* is an intuitive PROV editor and visualiser, hosted at [https://provviz.com](https://provviz.com). It makes use of the [ProvViz Visualiser](https://www.npmjs.com/package/provviz), maintained in a [separate repository](https://github.com/benwerner01/provviz). To run this project locally:
- use `yarn install` to install the dependencies
- use `yarn start` to run the application in the development mode at [http://localhost:3000](http://localhost:3000)

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Future Work 👷‍♂️

### *PROV-N* Tokenising the Text-Editor 🔨
The text-editor component of the ProvViz application currently only implements syntax highlighting for the *JSON* and *RDF* PROV formats, where existing tokenisation rules could be taken from the [monaco-languages GitHub
repository](https://github.com/microsoft/monaco-languages). Additional tokenisation rules for the prominent PROV format *PROV-N*
would serve as a “quality-of-life” improvement for users of the application.

### Integrate Cloud Storage Providers 🔨
Users could link a cloud storage provider such as [DropBox](https://dropbox.com) or [Google Drive](https://drive.google.com) to load and save modified PROV documents directly. This would better integrate ProvViz into a user’s personal file-storage system, without the need for explicitly uploading and downloading PROV documents in the browser, which would provide a more seamless user experience.

## Available Scripts 💻

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
