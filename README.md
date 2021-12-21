# Review apps action

This action manages your "github pages" branch, so you can host multiple apps inside the same app for free.
It will manage the build artifacts and organize it by branch/commit inside the `github pages` branch.

For example, imagine you have a *blog*, a *landing page* and your *design system* inside the same monorepo.
And you want to see how the changes in your button is affecting all your apps.
After pushing to GH, this action will create the following urls:

- https://sauloxd.github.io/my-monorepo/blog/ft-button-v2/90fc94
- https://sauloxd.github.io/my-monorepo/landing-page/ft-button-v2/90fc94
- https://sauloxd.github.io/my-monorepo/design-system/ft-button-v2/90fc94

And after your PR is closed, it will delete these static assets for you!

## Why?
Have ever seen yourself in this situation, where you are developing a `Select` component, and you're not quite right the interaction you've built is good enough? So you need to share what you've built so far with your UX/UI/QA team, just to see if you're following in the right direction?

You probably solved this by having a call with your designer or maybe sharing the link via `ngrok`. But everyone know how time consuming it is to do those things everytime you introduce a new change.

So why not deploy a new version of your app automatically? If your application is mainly static, this should be super easy, right? You could host it in S3, Netlify and even in Github-Pages.

And that's what this action do. The main difference is that it organizes your apps, by branch, so every developer working in your repo can have it's dedicated app!

## How to use it:

1. Enable github-pages source branch by following this guide: https://pages.github.com

2. Create a new workflow with all the proper build preparations and add the following step. (the build will happen inside the action, but make sure all dependencies are installed previously)

Example of usage:
``` yml
# See .github/workflows/example.yml
  steps:
     - name: Build and deploy to gh-pages
        uses: sauloxd/review-apps@X.X.X # replace with correct version
        with:
          build-cmd: 'yarn build'
          branch: 'gh-pages' # The branch you chose to be your github-pages source
          dist: 'build' # The dist folder where your "yarn build" command will place the build artifacts
          slug: 'react' # The partial URL where your apps will live. This is useful if you want to deploy both your react app and storybook app inside the same repository
```
3. If the action succeeds, your review apps will live in `https://{ username }.github.io/{ repository }/react/{ branchName }/{ commitId }`.

If you want to also deploy, for example, a storybook app, just add another step with a *different slug* and it will have it's unique url for it!

4. The CLEANUP will only happen when the action receives an event of PR closed. Currently there is no other way, unless you manually remove the app yourself in the github pages branch.

## Inputs

### `build-cmd`

**Required** The command used for building your app. Internally we will pass a PUBLIC_URL env var with the correct path prefix, so your application can live in a nested URL besides the root. If don't use hashRouting you'll probably need to do some adjustments. See PUBLIC_URL in FAQ bellow

### `branch`
Default: `gh-pages`.
The GithubPages source branch. Follow this guide https://pages.github.com for more info.
⚠️This action will not work if this branch is not properly configured!

### `dist`
Default: `dist`
The output directory for your build command.
It's usually the dist folder at the root of your project, but could be somewhere else (see the example.yml workflow in this repo)

### `slug`
Default: `review-apps`
The name for each type of app you'll deploy. This needs to be unique per repository.
This is only useful if you want to deploy multiple apps (e.g. you `main app` and a `storybook app`)

## FAQ

1. How to set an empty branch for my github-pages source branch?

I recommend using an `orphan-branch`, to avoid some collisions with file/dir names etc.
``` bash
BRANCH_NAME=gh-pages # Change to a desired branch name
git checkout --orphan $BRANCH_NAME
git rm -rf .
echo "Github pages branch" > README.md
git add README.md
git commit -m "Add readme"
git push origin $BRANCH_NAME
```

2. My images and my navigation links inside my app is not working

This is probably because you're app is not prepared to be served in a prefixed URL.
For example, in ReactRouter, if you don't configure a `basename` in `<Router />` component, it will not append the prefix in the links it generates.
See the examples in this repo:
 - Create-react-app with React-router - [link](https://github.com/Sauloxd/review-apps/tree/master/packages/cra-example)
 - Gatsby example with path-prefix config - [link](https://github.com/Sauloxd/review-apps/tree/master/packages/gatsby-example)

When building your app, we will provide a env var with the correct path prefix:
``` bash
PUBLIC_URL=`/{ repositoryName }/{ slug }/{ branchName }/{ headCommit }`);
```

So you can consume it in your app, like:
``` js
import {BrowserRouter} from 'react-router-dom';
...
const Router = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Route path='/home' component={Home} />
  </BrowserRouter>
)

```

3. The cleanup action didn't happen and now the index page is polluted! What do I do?

Since everything is inside your github pages branch, you can checkout to that branch and manually fix it:
- git checkout to your github pages branch (be sure to *pull* the latest version)
- Remove the directory for the app you don't want to see anymore
- Remove the app from manifest.json

The next time this action runs, it will generate the correct index.html based on manifest.json.
Probably this will be automated in next releases.

4. It's taking too long to update the index page for my new commit!

When the action just finished, it might take some time to the github pages reflect that.
Even though the correct index.html was generated and is inside the updated github pages branch.
I'm not sure how to burst the cache immediatly :/

# Contributing

Please, if you find some bugs are some usecase not covered in this README, open a issue and feel free to open a PR to fix it :)

## How to develop
- Remember to update the action.yml (and this README) when changing arguments
- There is a workflow just for development, called "for-testing-this-project.yml".
 - Create a branch named `ft-*` or `issue-*` and it will trigger the github action.
 - This workflow is getting the action directly from the src code, so remember to build before testing the action: `yarn build`


## How to release
