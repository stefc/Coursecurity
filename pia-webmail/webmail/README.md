## Project SetUp

`npx create-react-app . --template redux-typescript`

Remove the following files from project 

* package-lock.json
* src/App.test.tsx
* src/reportWebVitals.ts
* src/setupTests.ts
* public/index.html

Copy the following files into project 

* .vscode/settings.json
* .editorconfig
* .gitignore
* tsconfig.json
* vite.config.js
* index.html 

`yarn`

`yarn start`

If it works makes your first commit to the local repo 

## Development Workflow 

I'm using Git Flow as development workflow, so the `main` Branch is only for releasing. The work would be done on the branch `develop`. 


`git flow init`


