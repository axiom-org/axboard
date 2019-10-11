## Running your own Axboard

This codebase includes scripts to deploy to GitHub Pages. It's pretty straightforward
to deploy your own version of Axboard to GitHub Pages based on this repository:

1. Clone the repository to your own GitHub account. This repository will contain your source code.

2. Create a second repository on your GitHub account, named your-website-name.github.io . This repository is just a "serving repository" - it will contain the static files that are served on the website, and you won't edit these files by hand.

3. Modify `package.json`. The `deploy` script needs to point to your own serving repository. Replace `git@github.com:axiom-org/axboard.github.io.git` with the git URI of your serving repository. Also, the `homepage` field needs to contain your home page.

4. If you want to use a custom domain, follow the [GitHub Pages custom domain instructions](https://help.github.com/en/articles/quick-start-setting-up-a-custom-domain), and also replace the contents of the `public/CNAME` file with your custom domain.

5. If you don't want to use a custom domain, delete the `public/CNAME` file.

6. Run `npm run deploy` to deploy your own Axboard.

If you don't want to use GitHub Pages for hosting, you can just replace the `deploy` script in `package.json` with your own deploy script, or remove it and handle deploys differently. You just need to run `npm run build` and then get the contents of the `build` folder to your webhost.

## Available Scripts

Axboard was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) which created most of these scripts.

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm run deploy`

Deploys to GitHub pages. If you cloned the repo, you'll need to modify the command to work for you.
