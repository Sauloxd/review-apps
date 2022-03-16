# Review apps action

This action manages your "github pages" branch, so you can host multiple apps inside the same app for free.
It will manage the built artifacts and organize it by branch/commit inside `github pages` branch.

See an example in this Pull Request here:
1. https://github.com/Sauloxd/review-apps/pull/20
2. https://sauloxd.github.io/review-apps/

There are 2 packages inside this monorepo, simulating projects inside a real monorepo.
In every Pull Request, the action will deploy the apps and organize them inside your `github pages` branch, and will also comment the pull request with URLs for each deployed app.

Optionally you can skip the "index.html" page, that shows all apps from all branches in all Pull Requests, since you can always access them via url in comments made by the bot.

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
     - name: Build and deploy apps to gh-pages
        uses: sauloxd/review-apps@X.X.X # replace with desired version
        with:
          branch: "gh-pages" # The branch you chose to be your github-pages source
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }} # Optional, if you want the apps URL commented in your PR
          apps: |
            {
              "platform": { # SLUG, the partial URL for your app, see step 3.
                "build": "yarn run cra:build", # Build command
                "dist": "packages/cra-example/build" # The dist folder where your "yarn build" command will place the build artifacts
              },
              "storybook": {
                "build": "yarn run cra:storybook",
                "dist": "packages/cra-example/storybook-static"
              },
              "blog": {
                "build": "yarn run gatsby:build",
                "dist": "packages/gatsby-example/public"
              }
            }
```

3. If the action succeeds, your review apps will live, respectively:

   1. `https://{ username }.github.io/{ repository }/platform/{ branchName }/{ commitId }`.
   1. `https://{ username }.github.io/{ repository }/storybook/{ branchName }/{ commitId }`.
   1. `https://{ username }.github.io/{ repository }/blog/{ branchName }/{ commitId }`.

example:
https://sauloxd.github.io/review-apps/issue-11/fix-build/dev-cra/7186f2

4. The CLEANUP will only happen when the action receives an event of PR closed. Currently there is no other way, unless you manually remove the app yourself in the github pages branch.

## Inputs

### `branch`
Default: `gh-pages`.
The GithubPages source branch. Follow this guide https://pages.github.com for more info.
⚠️This action will not work if this branch is not properly configured!

### `GITHUB_TOKEN`
**optional** This allows the action to comment the apps url in your PR

### `apps`

**Required** JSON configuring all apps built by this action:

``` typescript
type apps = {
  [slug: string]: {
    build: string;
    dist: string;
  }
}
```


#### `slug`
The name for each type of app you'll deploy (storybook, blog, platform, admin).

#### `build`

The command used for building your app.

OBS: Internally we will expose PUBLIC_URL env var with the correct path prefix, so your application can live in a nested URL. If don't use hashRouting you'll probably need to do some adjustments. See PUBLIC_URL in FAQ bellow


#### `dist`
The output directory for your build command.
It's usually the dist folder at the root of your project, but could be somewhere else (see the this [workflow](./.github/workflows/real-life-use-case.yml) in this repo)


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

This is probably because your app is not prepared to be served in a prefixed URL.
For example, in ReactRouter, if you don't configure a `basename` in `<Router />` component, it will not append the prefix in the links it generates.
See the examples in this repo:
 - Create-react-app with React-router - [link](https://github.com/Sauloxd/review-apps/tree/master/packages/cra-example)
 - Gatsby example with path-prefix config - [link](https://github.com/Sauloxd/review-apps/tree/master/packages/gatsby-example)

When building your app, we will provide an env var with the correct path prefix:
``` bash
PUBLIC_URL=`/{ repositoryName }/{ slug }/{ branchName }/{ headCommit }`;
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

When the action just finished, it might take some time to the github pages reflect that, but you can follow the deploy to gh-pages in your actions page, since Github will trigger an action of its own named "pages build and deployment"

# Contributing

Please, if you find some bugs are some usecase not covered in this README, open a issue and feel free to open a PR to fix it :)

## How to develop
1. Remember to update the action.yml (and this README) when changing arguments
1. There is a workflow just for development, called "for-testing-this-project.yml".
  1. Create a branch named `ft-*` or `issue-*` and it will trigger the github action.
  1. This workflow is getting the action directly from the src code, so remember to build before testing the action: `yarn build`
1. To explore what is possible with GH Action, you can
  1. SSH by uncommenting the `mxschmitt/action-tmate@v2` action
  1. Create a script there like `test.js`
  1. Create alias to short the feedback loop:
  ``` bash
  alias v="vim test.js"
  alias r="node test.js"
  ```


## How to release
1. Tag the commit with a bumped version
   ``` bash
   git tag -a v1.x # Tag new version
   git push origin v1.x

   # Delete from local and remote if necessary
   git tag -d v1.x v1.x2
   git push --delete origin v1.x v1.x2
   ```
1. Do a manual release to github actions marketplace referencing this new version
