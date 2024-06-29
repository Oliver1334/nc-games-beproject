# NC Games Backend

This is a Restful Web API built with Node.js and Express for NC Games, an aggregator website featuring board game reviews. It utilises interactions with PSQL databases created through TDD.
You can view this project here: https://nc-games-2kfx.onrender.com/api/reviews

A summary of all possible endpoint functionalities can be viewed at the [/api](https://nc-games-2kfx.onrender.com/api) endpoint.


## Features

* View all reviews
* View a specified review
* Filter, sort and/or order articles via queries
* View, post and delete comments on articles
* Upvote or downvote an article
* View all users


## Setup Instructions

0. Requirements
- Node >6.0.0
- Postgres >8.7.3

1. Clone down the project
Use ```git clone``` to create a local copy of the project

2. Install relevant packages
Use ```npm install``` to install packages when in the repos directory

3. Setup Environment Variables
Create a .env.development folder with the contents:
PGDATABASE=nc_games
Create a .env.test folder with the contents:
PGDATABASE=nc_games_test
Create these files in the main root of this repo, not in any folders.
Make sure both files are included in your ```.gitignore```.

4. Setup databases
Use ```npm run setup-dbs``` and then ```npm run seed``` to seed the local databases.


5. Start the express server and the app will start listening on 
port 9090 of your localhost
   ```
   npm start
   ```
6. Point your browser at `localhost:9090/api` to see a list of all the endpoints, how to interact with them, and example responses.

7. This app has been fully tested with the use of Jest and the Supertest library. To install the necessary dependencies and run the test suite use:
   ```
   npm install -D jest jest-sorted supertest
   npm test
   ```

8. Enjoy!





