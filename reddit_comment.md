# Fight yourself.

I'm going to assume you have `node` installed already.  If not, go read a thing and install it.  Come back when you're done.

Your roles:

1. Developer
2. Local user, or lUser for short
3. Devops.

The developer will write the initial function.  

The lUser will find creative ways to use it incorrectly.  When stuck, the lUser will just add a bug to the function (try to do this less often.)  

The developer will then come in, add tests that catch the situation, then modify the function to prevent the problem.

Devops is a rare role.  It involves automation.  It makes robots do your job for you.  It makes testing far, far less painful.

----

&nbsp;

&nbsp;

# Setting up the env

You begin as `developer`.  We'll set up the environment.

Go make a repo on github for `learning_testing` or something like that.  We use `github actions` here, so you *should* do this from `github` at the get go, not some alternative like gitlab, where you'll need to start converting my instructions.  It's fine to be on gitlab, but learn where the instructions were written, then convert, not all at once.

[I'm making one alongside the tutorial, to make sure my instructions are only somewhat bullshit.](https://github.com/StoneCypher/tutorial_learn_testing)

When you create the repo, add the README, and set `.gitgnore` to node.  License is up to you, but cool kids use MIT.  If your account is free, make it public so that you still have access to actions.  If your account is paid, do what you like about privacy.

Now pull that repo locally.  There's your dev env.

Now pull up a console and inhabit that directory.  All remaining instructions assume you're there.

Notice there's a file inside called `.gitignore`.  It's there because you created it when creating the repo, and it's full of common sense defaults for a `node` style environment.  That prevents you from committing your installed modules, and other stuff that doesn't belong in a repo.  Other files you don't want ever committed can be added there.  We'll do that for the coverage stuff later.

We'll start with an `npm` project.

    npm init

Please set the version to 0.1.0, the repo to your github repo's basic URL like you'd use in a browser, and the testing command to `jest`.  It's up to you whether to put your name in author.  If you do, the standard format is `Fullname <email>`.  The angle brackets are part of the format.  `Bob Dobbs <bob@dob.bs>` is a valid example.

I don't know how new you are, but what `npm init` actually does is write a config to disk called `package.json`.  We're gonna use that a lot here.  On windows, `type package.json`.  On Mac, linux, or windows git bash, `cat package.json`.  Those should display the contents of the file.  It should look like this:

    {
      "name": "tutorial_learn_testing",
      "version": "0.1.0",
      "description": "Teach some rando from reddit how to press testing butan",
      "main": "index.js",
      "keywords": "tutorial testing test jest setup stonecypher",
      "scripts": {
        "test": "jest"
      },
      "repository": {
        "type": "git",
        "url": "git+https://github.com/StoneCypher/tutorial_learn_testing.git"
      },
      "author": "John Haugeland <stonecypher@gmail.com>",
      "license": "MIT",
      "bugs": {
        "url": "https://github.com/StoneCypher/tutorial_learn_testing/issues"
      },
      "homepage": "https://github.com/StoneCypher/tutorial_learn_testing#readme"
    }

Cool.  We have an empty project.  We'll need to `install` it.

    npm install

`npm install` reads that config, makes a directory called `node_modules` that all the installed libraries live in, installs any that the project calls for (currently none,) validates some stuff, runs any scripts it was told to (also currently none,) checks if the libraries in use have any known vulnerabilities, and bails.

Let's commit our work and push it.

    git add . && git commit -m "0.1.0 npm init and npm install" && git push origin

----

&nbsp;

&nbsp;

# Test rig time

Now, set up a test rig.  Doesn't really matter which one.  If you're on some platform and it has an integrated testing library, eg `vite` and `vitest` or whatever, use that.  Otherwise, fuck it, `jest` isn't very good, but it's easy to get running, so get in, kid, we're using `jest`.

    npm install --save-dev jest

You actually have a working test rig right now.  If you try to run it, it'll complain that it can't find any tests to run.

The command `npx` will run a shell command you give afterwards, with all `node` stuff in context.  This is a quick and easy way to use node libraries that are written to support it without writing code yet.

So, `npx jest`.

    $ npx jest
    No tests found, exiting with code 1
    Run with `--passWithNoTests` to exit with code 0
    In C:\Users\john\projects\scratch\tutorial_learn_testing
      2 files checked.
      testMatch: **/__tests__/**/*.[jt]s?(x), **/?(*.)+(spec|test).[tj]s?(x) - 0 matches
      testPathIgnorePatterns: \\node_modules\\ - 2 matches
      testRegex:  - 0 matches
    Pattern:  - 0 matches

Nothing's broken.  That's progress.

&nbsp;

## Configure da reeg

I'm also just gonna provide a `jest` config to save time, because it's not very important and I don't feel like writing a `jest` tutorial right now.  You can actually use `jest` entirely without a config; it has reasonable defaults.  But, I wanted you to see what a regular one looks like.

    module.exports = {
    
      testEnvironment            : 'node',
    
      moduleFileExtensions       : ['js'],
      coveragePathIgnorePatterns : ["/node_modules/", "/src/js/tests/"],
      testMatch                  : ['**/*.spec.js'],
    
      verbose                    : false,
      collectCoverage            : true,
      coverageDirectory          : "coverage/spec/",
    
      coverageThreshold : {
        global : {
          branches   : 5,
          functions  : 5,
          lines      : 5,
          statements : 5,
        },
      },
    
      collectCoverageFrom: ["src/js/**/.js"],
    
      reporters: [
    
        ['default',             {}],
    
        ['jest-json-reporter2', {
          outputDir: './coverage/spec',
          outputFile: 'metrics.json',
          fullOutput: false 
        }]
    
      ]
    
    };

This goes in project root, in `./jest.config.js`.

Explaining the config, in short:

`testenvironment: node` means "Put the standard `node` globals in reach when testing."

`coveragePathIgnorePatterns` is there to prevent `jest` from trying to test your libraries, or to test your tests.

`testMatch` is our choice of filename pattern, by which `jest` can tell that this specific js file is a test file.  `**` means "any subdirectory or chain of subdirectories."  `**/*.spec.js` says "any file at any depth from here, whose name ends `.spec.js`."  In my own repos, I sometimes have different kinds of tests, and keep them under different extension collections this way.

The `coverage` stuff gives you the tools to see which of your code is and is not being tested.  This is really important.  We'll come back to this.

The `coverageThreshold`s are ridiculous.  They say you pass if just five percent of your code is tested.  In my own code, I have those set to ninety.  I always run at 100% coverage, but if it's non-passing at 100 then it's hard to develop, because the code you're in the middle of writing breaks the tests.  I cranked it way down to 5% so that it won't blow up constantly while you're getting started.  Once your coverage is higher, you should increase these numbers.

The reporters - default is the one in console that's giving you that nice little ASCII table, and `jest-json-reporter2` also writes coverage numbers into the coverage directory.  It's a pain in the ass to get multiple reporters running in jest in parallel, so just leave that be.

Incidentally, we need to install that reporter.

    npm install --save-dev jest-json-reporter2

In theory, your testing environment is now complete.  You can pretty much just install those two libraries and copy pasta that config, and you're in a reasonable state to go, in the future.

Run `jest` again.  It'll continue to complain that there are no tests, but it doesn't say the config is broken, so, it's probably correct.  (It's correct, but, "probably" is the right mindset here.)

&nbsp;

## Neckbeard sidebar: `foo.spec.js`, and unit vs specification

Why is it called `spec`?

People think this is "unit testing," and they will call it that, and expect it to mean this.  This is even called a "unit testing tool."

That's bullshit.  There's no unit being tested here.  This is "specification testing."

A unit is when an entire device has been described that's exchangeable, and you want to verify the compatability standard.  If you're a car maker, and there's a standard set of plugs to hook up a radio, the unit would be the set of signals those plugs can send and receive.

It's a unit testing tool because it could test a unit.  We're not using it that way.  We're writing specs.

If you bash something with a rock or a crowbar, you're "hammering."  If you bash something with a wrench, you're still "hammering."  You name the act for the action, not the tool.

----

&nbsp;

&nbsp;

# Write some damn code

You continue as `developer`.

Now, write a simple function.  I mean simple.  Just return the square of the number, or something like that.

I'm actually going to write two, to make clear how the coverage stuff works.  You don't need to, but if you're feeling fancy, etc, etc.

    function square(x)   { return x*x; }
    function hello(name) { return `Hello, ${name}.`; }

    export { square, hello };

Simple enough, right?

Now, the layout of our source and our filename doesn't technically really matter, but for the configs we're doing it has to match whatever the configs say.  So for this tutorial, make a directory `./src/js`, and save the code in there as `index.js`.

Run jest again.  `npx jest`.  Still complaining about no tests, but, nothing's broken.

Once you have `./src/js/index.js` in play, let's bump version, commit, and push.

To bump version, just change the `0.1.0` in your `package.json` to `0.2.0`.

> Why 0.2.0?

This is "semver," or `Semantic Versioning`, and the numbers have an actual meaning.

The first digit is `major`.  The second digit is `minor`.  The third digit is `patch`.

* You do `major` for breaking releases.  If you changed the API and old calling code won't work anymore (try not to do this,) then you bump major.
* You do `minor` for incremental releases.  If you just added a function, it's a minor.  Good libraries have very high minor numbers.
* You do `patch` for bugfixes, adding documentation, that kind of stuff.  They can be important - bug fixes are a big deal - but they don't change the calling API at all.

Semver is about the calling API.  It's for your users, not for you.  They need to know which release to upgrade to, automatically.

Anyway, we're in pre-release - major version 0 - which tells downstream consumers "this isn't ready to be used yet."  So we just bump minor for a while.

And then commit and push.

    git add . && git commit -m "0.2.0 two trivial functions" && git push origin

----

&nbsp;

&nbsp;

# Almost to the first goal: a running test

You continue as the `developer`.

So, cool, we're nearly there, it turns out.  We just need a simple test, to test our beans.  Let's try `square`.

    describe('square', () => {

    });

`describe` is actually optional, but it makes things readable, so use it.  This basically says "I'm making a group of tests and the group is gonna be called square."  Then, for reasons that have to do with catching things that throw correctly, the second argument is an anonymous lambda function that contains our actual testing code.

Get used to that.  You do that a lot.  When you're requiring something to fail and it's not failing the way you expect, that's usually the thing you forgot.

Let's stuff a couple tests inside.  This is what a test looks like:

    test('square of 3 is 9', () => expect( square(3) ).toBe(9) );

# Look!  A spec!

So maybe my shiny new specification says something like

    const index  = require('../index.js'),
          square = index.square;

    describe('square', () => {

      test('square of 0 is 0',       () => expect(    square(0) ).toBe(0)    );
      test('square of 3 is 9',       () => expect(    square(3) ).toBe(9)    );
      test('square of -3 is 9',      () => expect(   square(-3) ).toBe(9)    );
      test('square of 1.5 is 2.25',  () => expect(  square(1.5) ).toBe(2.25) );
      test('square of -1.5 is 2.25', () => expect( square(-1.5) ).toBe(2.25) );

    });

We'll make a directory `./src/js/tests` and throw this in as `index.spec.js`.  There's no matching up of filenames or whatever; it's just gonna run all the specs.

And you run the test!  And ... and it's `module.exports`, not `export`.  We're in CommonJS.

     FAIL  src/js/tests/index.spec.js
      ● Test suite failed to run

        Jest encountered an unexpected token

        Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

        Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

        By default "node_modules" folder is ignored by transformers.

        Here's what you can do:
         • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
         • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
         • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
         • If you need a custom transformation specify a "transform" option in your config.
         • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

        You'll find more details and examples of these config options in the docs:
        https://jestjs.io/docs/configuration
        For information about custom transformations, see:
        https://jestjs.io/docs/code-transformation

        Details:

        C:\Users\john\projects\scratch\tutorial_learn_testing\src\js\index.js:7
        export { square, hello };
        ^^^^^^

        SyntaxError: Unexpected token 'export'

        > 1 | const index  = require('../index.js'),
            |                                      ^
          2 |       square = index.square;
          3 |
          4 | describe('square', () => {

          at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1496:14)
          at Object.<anonymous> (src/js/tests/index.spec.js:1:38)

    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    ----------|---------|----------|---------|---------|-------------------
    All files |       0 |        0 |       0 |       0 |
    ----------|---------|----------|---------|---------|-------------------
    Test Suites: 1 failed, 1 total
    Tests:       0 total
    Snapshots:   0 total
    Time:        0.732 s
    Ran all test suites.

God damnit John.  ... but this is why we test.

With that fixed?  The tests run.

    $ npx jest
     PASS  src/js/tests/index.spec.js
    ----------|---------|----------|---------|---------|-------------------
    File      | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
    ----------|---------|----------|---------|---------|-------------------
    All files |       0 |        0 |       0 |       0 |
    ----------|---------|----------|---------|---------|-------------------

    Test Suites: 1 passed, 1 total
    Tests:       5 passed, 5 total
    Snapshots:   0 total
    Time:        0.686 s
    Ran all test suites.

We have a working test environment.  Bump to `0.3.0`, commit, and push.

&nbsp;

&nbsp;

# Scripting this appropriately

A well behaved `node` module has a couple standard behaviors.  It will build when you `npm run build`.  It will test when you `npm run test`.  It will do both of those on its own when it is installed the first time.

We haven't set any of that up yet.

&nbsp;

# npm run build

The build is where you do any "making the thing" type of steps: typescript, bundling, documentation extraction, that kind of stuff.

We have two functions.  There's no real build here.  So ... let's set up documentation generation, so we have an excuse for that step to exist.  Lol.

&nbsp;

## documentation

We'll install a package called `documentation`, which admittedly is a little confusing.

    npm install --save-dev documentation

Next we'll try to use it, and it'll seem to do nothing.

    npx documentation

So we read the docs.  It has to be told what directory to build, what format to output in, and what directory to output in.  We'll try to use it again, and it'll kersplode.

    npx documentation build src/js/** -f html -o docs/docs/

    Error: ENOENT: no such file or directory, open 'docs/docs/'
        at Object.openSync (node:fs:589:3)
        at Object.writeFileSync (node:fs:2247:35)
        at onFormatted (file:///C:/Users/john/projects/scratch/tutorial_learn_testing/node_modules/documentation/src/commands/build.js:92:10)

This basically says "the directory you told me to target doesn't exist."  This is because `documentation` is smart enough to make the directory it's told to if it doesn't exist, but not if the parent also doesn't exist, and we targeted `docs/docs/`, and the parent `docs/` isn't there either.

> Wait.  Why `docs/docs/`?

Because Github Pages.  We'll get back to that.

So, make the directory `docs`, then the directory `docs/docs` (because most shells also can't make the parent at the same time, and --ensure is uncommon.)  And try again

    mkdir docs
    mkdir docs/docs
    npx documentation build src/js/** -f html -o docs/docs/

And would you look at that?  There's a webpage in `docs/docs/` explaining our dumb two little functions to us.

We have use of a build step 😁

Let's go back into `package.json` and write our first `script`.  See that block in the middle?

      "scripts": {
        "test": "jest"
      },

Let's add another row to that object called `"docs"`.

      "scripts": {
        "test": "jest",
        "docs": "documentation build src/js/** -f html -o docs/docs/"
      },

Their order doesn't matter; javascript objects aren't ordered.  But I like to keep the ones being called above, and the ones doing the calling below, because I think that's more readable.

Notice we're not writing `npx` in here.  That's because all that does is load the node environment, and that's already happening by the `scripts` block, so there's no reason to do it a second time.

We can now write `npm run docs` (not npx, npm - we're running a script, not executing a command) and it'll do whatever we said in the script block.

Bump version in `package.json` while you're there - we're on 0.4.0 now - and commit.

    git add . && git commit -m "0.4.0 documentation extraction" && git push origin

&nbsp;

## Run the tests in the build

Now we just need to update the build to also run the tests.  Tests are actually already in the scripts block - it's the only one it creates automatically, from back when you make the project.

So it's enough to just write the build script now.

      "scripts": {
        "test": "jest",
        "docs": "documentation build src/js/** -f html -o docs/docs/",
        "build": "npm run test && npm run docs"
      },

And now, all you do is write `npm run build`, and your tests will be run and your documentation extracted.

Bump `package.json` to 0.5.0 and commit and push

    git add . && git commit -m "0.5.0 build script" && git push origin

## Run build post-install

And this one's quite easy.  There are a handful of standard `script` titles which will be invoked when `node` gets to certain steps.  One of those is `post-install`, which gets run after a module is installed.

As a result, we can just add one line (and the comma on the previous line:)

    "postinstall": "npm run build"

This means that `node` will automatically run the build process when the module is installed, which is appropriate for our setup.

Since we haven't added any libraries, `npm install` is a no-op for us, so we can test by just running `npm install` again, and seeing if it triggers a build.  It does.

Bump package to 0.6.0, commit, and push anew.

    git add . && git commit -m "0.6.0 build script" && git push origin

&nbsp;

## Set up Github Actions

And now we make the robot test your stuff for you.  You'll still run your tests locally to make sure things are running well while you're working, but every single time you check in from here on in after this, the robot will try them on a bunch of platforms for you silently in the background.

This is called "continuous integration."  When people say CI/CD, this is the CI part.

Go to your repo on the web.  Go to the `actions` tab.

There's a bunch with "node.js" in the name.  You want the one that's *just* called node.js.  Use the search widget.  Le click.

It will put you in a weird code editor with approximately this:

    # This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
    # For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

    name: Node.js CI

    on:
      push:
        branches: [ "main" ]
      pull_request:
        branches: [ "main" ]

    jobs:
      build:

        runs-on: ubuntu-latest

        strategy:
          matrix:
            node-version: [14.x, 16.x, 18.x]
            # See supported Node.js release schedule at https://nodejs.org/en/about/releases/

        steps:
        - uses: actions/checkout@v3
        - name: Use Node.js ${{ matrix.node-version }}
          uses: actions/setup-node@v3
          with:
            node-version: ${{ matrix.node-version }}
            cache: 'npm'
        - run: npm ci
        - run: npm run build --if-present
        - run: npm test

Cool.  We're gonna change it.

First off, nobody runs three steps in three separate contexts to install.  Let's change that last three lines of `run` to just:

        - run: npm install

Since we have a proper NPM module, which runs the build after being installed, and runs the tests on build, we're done with that part.  However, those node versions are out of date - 20 exists - and we're only testing one operating system.  These are only testing even numbered node versions because odd versions are development versions, and aren't considered stable.  I think that's silly.

The thing is, testing on Windows is slow on Github, and testing on Mac is agonizingly slow.  So we'll do *most* of our testing in Linux.  We'll test all the `node` versions in Linux, and also the current version only in Windows and Mac.

We'll just wholesale replace the strategy block, with this one:


        strategy:
          matrix:
            include:
              - node-version: 20.x   # fastest, so run first, to error fast
                os: ubuntu-latest
              - node-version: 20.x   # slowest, so run next. sort by slowest from here to get earliest end through parallelism
                os: macos-latest
              - node-version: 20.x   # finish check big-3 on latest current
                os: windows-latest
              - node-version: 14.x   # lastly check just ubuntu on historic node versions because speed, oldest (slowest) first
                os: ubuntu-latest
              - node-version: 15.x
                os: ubuntu-latest
              - node-version: 16.x
                os: ubuntu-latest
              - node-version: 17.x
                os: ubuntu-latest
              - node-version: 18.x
                os: ubuntu-latest
              - node-version: 19.x
                os: ubuntu-latest

As you can see, the first three rows test windows, mac, and ubuntu on node 20.  The remainder rest older node on ubuntu.

Github is going to fire up a separate virtual machine for each of these - up to ten in parallel - and run the whole stack for each one, and fail the build if *any* of them fail.

After that, you replace the `runs-on` directive with one that invokes the operating system named in the strategy matrix:

    runs-on: ${{ matrix.os }}

The result should look like this:

    # This workflow will do a clean installation of node dependencies, cache/restore them, build the source code and run tests across different versions of node
    # For more information see: https://docs.github.com/en/actions/automating-builds-and-tests/building-and-testing-nodejs

    name: Node.js CI

    on:
      push:
        branches: [ "main" ]
      pull_request:
        branches: [ "main" ]

    jobs:
      build:

        strategy:
          matrix:
            include:
              - node-version: 20.x   # fastest, so run first, to error fast
                os: ubuntu-latest
              - node-version: 20.x   # slowest, so run next. sort by slowest from here to get earliest end through parallelism
                os: macos-latest
              - node-version: 20.x   # finish check big-3 on latest current
                os: windows-latest
              - node-version: 14.x   # lastly check just ubuntu on historic node versions because speed, oldest (slowest) first
                os: ubuntu-latest
              - node-version: 15.x
                os: ubuntu-latest
              - node-version: 16.x
                os: ubuntu-latest
              - node-version: 17.x
                os: ubuntu-latest
              - node-version: 18.x
                os: ubuntu-latest
              - node-version: 19.x
                os: ubuntu-latest

        runs-on: ${{ matrix.os }}

        steps:
        - uses: actions/checkout@v3
        - name: Use Node.js ${{ matrix.node-version }}
          uses: actions/setup-node@v3
          with:
            node-version: ${{ matrix.node-version }}
            cache: 'npm'
        - run: npm install

Commit that shit.  You've now got test robots.  Wait a couple seconds and go back to the actions tab (it takes like five seconds for the VMs to start spawning.)



