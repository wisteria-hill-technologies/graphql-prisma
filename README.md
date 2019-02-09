# GraphQL Backend Server with Prisma ORM

![Alt text](./PrismaDiagram1.svg)

First install prisma on your machine (if you have not done so yet).
``` 
npm install -g prisma
prisma -v
```

## Prisma setup
- Prerequisite:
Set up a database

1. Initialise a new project for prisma.
- create a new folder for prisma. cd into it.
- Initialise prisma.
    ```prisma init <project-name>```
    Enter details about your database.
    Don't generate Prisma client if you are making one yourself.
    It will automatically create three new files as below.
    ```
      prisma.yml           Prisma service definition
      datamodel.prisma    GraphQL SDL-based datamodel (foundation for database)
      docker-compose.yml   Docker configuration file
    ```
    If you are using Heroku, make sure to add ```ssl: true``` to docker-compose.yml file.
- Follow the instruction in the terminal.
2. ```docker-compose up -d``` This will run the docker container for prisma ORM in the background.
3. ```prisma deploy```
    For development, ```prisma deploy -e ../config/dev.env``` if the env file is already set up.
    This is to reflect the latest changes in your database.
    This will deploy the graphQL server.
    Now if you define the datamodel.prisma, prisma will automatically create query, mutation, and subscriptions for you! =)
4. When you make changes to detamodel.prisma, you need to run ```prisma deploy``` again.
* If you create User with the same name and email address multiple times, it will create multiple.... To avoid this, use ````@unique````

## Connecting to a Node Server
1. Create package.json file with all the dependencies and install them.
    ```
      "scripts": {
        "start": "node dist/index.js",
        "heroku-postbuild": "babel src --out-dir dist --copy-files",
        "dev": "env-cmd ./config/dev.env nodemon src/index.js --ext js,graphql --exec babel-node",
        "test": "echo \"Error: no test specified\" && exit 1",
        "get-schema": "graphql get-schema -p prisma --dotenv config/dev.env"
      },
    ```
    - dev: use```dev.env``` for environmental variables, then ```--ext js,graphql --exec babel-node``` run babel and tell nodemon to watch the transpiled files  which have extensions of js and graphql.

2. Install prisma-binding in the root folder.
    ```npm install prisma-binding```
3. Install graphql-cli in the root folder.
    ```npm install graphql-cli```
4. .babelrc file.
5. Create src folder.
6. Create an empty folder called generated under src.
7. Make .graphqlconfig file.
    ``` 
    {
      "projects": {
        "prisma": {  //your prisma project name
          "schemaPath": "src/generated/prisma.graphql", //this is where type definition from prisma will be saved.
          "extensions": {
            "endpoints": {
              "default": "http://localhost:4466" //This is the endpoint for prisma graphql.
            }
          }
        }
      }
    }
    ```
8. add bellow to the scripts in package.json.
```"get-schema": "graphql get-schema -p <your prisma project name here. -p stands for project>"``` 
9. run ```npm run get-schema``` generated folder will be populated with prisma schema definitions.  generated folder will be auto-populated so do not manually change its content.
10. Create prisma.js inside src folder. In prisma.js, set up a new Prisma instance and export it as default.
11. Import prisma from prisma.js file and add it to context in graphQL server in index.js in the root.<br/>
    Now, prisma is available to access in your resolvers.
12. subscription in ```schema.graphql```
   In case you use subscription with prisma, make sure the schema contains ````node```` instead of ```data``` for subscription, like below.
   ``` 
   type PostSubscriptionPayload {
       mutation: MutationType!
       node: Post
   }
   
   type CommentSubscriptionPayload {
       mutation: MutationType!
       node: Comment
   }
   ```

### Customise Type Relationships
1. Go to datamodel.prisma In prisma folder.
    ```# SET_NULL is default. or CASCADE```
    This is for example in case a record is deleted, it specifies what happens to the other records which are in relationship with the record to be deleted.
2. Add type relationships.
3. In prisma folder in terminal, ```prisma deploy```
4. Go back to the root folder. ```npm start``` to see if the changes are reflected in graphql playground for prisma (localhost:4466).

### Hiding Prisma
1. Open prisma.yml in prisma folder.
   - add your secret.
    This will lock down the prisma access.
   
2. In prisma folder, ```prisma deploy```.
3. Open prisma.js in src folder.
   - add the same secret to the prisma instance.
    This will allow the node server to access the prisma.

### Accessing prisma directly still.
1. Go to prisma folder in your terminal.
2. execute ```prisma token``` pass env variables for dev or prod environments.
    pass env to it like ```prisma token -e ../config/dev.env```
   1) This will generate an authorisation token.
   2) Copy and paste the token.
   3) add in the HTTP HEADERS the following in the prisma graphQL playground.
   ``` 
   {
     "Authorization": "Bearer <your token>"
   }
   ```
    *** For production, you can also access from Prisma Cloud -> Services -> Select your service -> Playground link on the left hand side of the screen.  This will open the playground with auth token.

### Setting up Password fields
1. add password field to User type in datamodel.prisma
```password: String!```
2. schema.graphql in src - do the same.
3. If you want to delete all the previous data, go to prisma folder in terminal.
   1) ````prisma delete```` Warning!: This will delete all the data in the database.  We do this because previous data did not have password fields.
   2) ```prisma deploy``` to deploy.
   3) We need to update schema, with get-schema
   In order to do this after the prisma lockdown with password,
   we need to point get-schema to prisma.yml file.
   In .graphqlconfig,
   ```
       ...
       "extensions": {
               "prisma": "prisma/prisma.yml",
               ...
   ```
   then, from now on we can run ```npm run get-schema``` again.

### Storing Passwords
1. Add password field in input CreateUserInput in schema.graphql file.
    ```
    input CreateUserInput {
        name: String!
        email: String!
        password: String!
    }
    ```
2. Go to Mutation.js in resolvers
   1) You can add validation here such as password length check.
   2) Install and implement bcrypt hashing for the password to be saved.
   3) Install and implement jwt token.
   4) Adjust createUser in schema.graphql to return a new type to include token with user.
   
### Logging in
1. Add login mutation to schema.graphql
2. Add login function resolver to Mutation.js.

### Authenticating endpoints
1. Pass request as parameter to context(make it a function) in graphQL server in index.js as below.
```
  context(request) {
    // need request.request.headers for Authorization (JWT) token in the headers.
    return {
      pubsub,
      prisma,
      request
    }
```
2. Create a utility function for authentication.
    1) Create utils folder under src.
    2) Create ````getUserId.js```` to authenticate the user making a request with token.
3. In Mutation.js, do something like below:
    ```
      createPost(parent, args, { prisma, request }, info) {
        const userId = getUserId(request);
    
        return prisma.mutation.createPost({
          data: {
            title: args.data.title,
            body: args.data.body,
            published: args.data.published,
            author: {
              connect: {
                id: userId  //use authenticated user's id.
              }
            }
          }
        }, info);
      },
    ```
 4. In schema.graphql, remove ```author: ID!``` from CreatePostInput
        ```
        input CreatePostInput {
            title: String!,
            body: String!,
            published: Boolean!,
           #  we don't need author here anymore.  author: ID!
        }
        ```
 
* Check Mutation.js and Query.js as well as schema.graphql

### fragment
#### Set up
1. Add fragmentReplacements in prisma.js
2. Collect all the resolvers in resolvers/index.js and pass them through fragmentReplacements and export.
3. Import resolvers and fragmentReplacements, and Set them up in src/index.js.
4. Use fragments in resolvers where you need them to make sure it always returns some specific data.  e.g. See User.js

#### Example on how to use it
```
{
  users{
    ...userFields
  }
}

fragment userFields on User {
  id
  name
  email
  posts {
    id
  }
}
```

#### Example: User
schema.graphql
```
type User {
    id: ID!
    name: String!
    email: String
    password: String!
    posts: [Post!]!
    comments: [Comment!]!
}
```

User.js
```
import getUserId from '../utils/getUserId';

const User = {
  email: {
    fragment: 'fragment userId on User { id }', //This fragment will make sure to get id in parent below (without explicitly asked by user's query from ui) and pass it on to resolve.
    resolve(parent, args, { prisma, request }, info) {
      const userId = getUserId(request, false);

      if(userId && userId === parent.id) {
        return parent.email;
      } else {
        return null;
      }
    }
  }
};
```

### Pagination
1. Add ```first```,```skip```, ```after``` to your queries in schema.graphql
    - skip: how many items to skip
    - first: (first) number of items to get (after skipping if any)
    - after: after a specific item number
    
    ```
    type Query {
             users(query: String, first: Int, skip: Int, after: String): [User!]!
             posts(query: String, first: Int, skip: Int, after: String): [Post!]!
             myPosts(query: String, first: Int, skip: Int, after: String): [Post!]!
             comments (query: String, first: Int, skip: Int, after: String): [Comment!]!
             me: User!
             post(id: ID!): Post!
         }
    ```
2. Pass them to query in resolvers
    Example, resolvers/Query.js
    ```
    const Query = {
      users (parent, args, { prisma }, info) {
        const opArgs = {
          first: args.first,
          skip: args.skip,
          after: args.after
        };
      ...
    ```
### createdAt and updatedAt
prisma automatically creates timestamps for createdAt and updatedAt.  But, we need to specify them in datamodel.graphql (also make sure to do ```prisma deploy``` in prisma folder and ```npm run get-schema``` in the root) and schema.graphql in node api.

### Sorting
- Go to the playground for prisma (localhost:4466)
- Check out input arguments called ```orderBy``` for posts for example.
1. In schema.graphql (the node api server), you can import enum for orderBy from the generated schema like below with hash:
    ```
    # import UserOrderByInput, PostOrderByInput, CommentOrderByInput from './generated/prisma.graphql'
    ```
    then, use it in the same file
    ```
    type Query {
        users(query: String, first: Int, skip: Int, after: String, orderBy: UserOrderByInput): [User!]!
        posts(query: String, first: Int, skip: Int, after: String, orderBy: PostOrderByInput): [Post!]!
        myPosts(query: String, first: Int, skip: Int, after: String, orderBy: PostOrderByInput): [Post!]!
        comments (query: String, first: Int, skip: Int, after: String, orderBy: CommentOrderByInput): [Comment!]!
        me: User!
        post(id: ID!): Post!
    }
    ```
2. In resolver, pass it through like below:
    ```
    const Query = {
         users (parent, args, { prisma }, info) {
           const opArgs = {
             first: args.first,
             skip: args.skip,
             after: args.after,
             orderBy: args.orderBy
           };
           ....
    ```
## Production Deployment
### 1. Host/Deploy Prisma Docker container - Deployment to Prisma Cloud
AND
### 2. Production Database - e.g. Heroku
1. Sign up/log in
2. Create (add) a server
3. **Create a new database** (connect to your service provider e.g. Heroku) - you can do this inside the Create Server process in Prisma Cloud.
4. Set up and create a server (heroku)
5. Set up database: Provide details to your database admin panel (e.g. pgAdmin for postgres) - details will be available in Heroku, for example.
6. Deploy prisma to the server - make prisma deploy work.
   1) create a 'config' folder in the root of the project.
   2) Inside the config folder, create dev.env.
   3) dev.env
      - create ```PRISMA_ENDPOINT=http://localhost:4466`` inside dev.env
      - now inside prisma folder you can do: ```prisma deploy -e ../config/dev.env```
   4) prod.env
      - in prisma folder in terminal, ```prisma login``` and grant permission.
      - in the same terminal, now do ```prisma deploy -e ../config/prod.env```
      - First time, it will say it cannot find the environmental variables.
      - Answer the questions in the terminal for the setup. Select the prisma server you created in Prisma Cloud earlier.
      ```
      ➜  prisma git:(master) ✗ prisma deploy -e ../config/prod.env
       ▸    [WARNING] in /Users/nobuyukifujioka/Documents/noby-coding/graphql-prisma/prisma/prisma.yml: A valid environment variable to satisfy the declaration
       ▸    'env:PRISMA_ENDPOINT' could not be found.
      
      ? Set up a new Prisma server or deploy to an existing server? <select it>
      ? Choose a name for your service <type here>
      ? Choose a name for your stage <type prod>
      ```
      - Then, endpoint will be written in prisma.yml.  Swap with env and copy the original to prod.env.
      - prisma.yml as below:
          ```
          endpoint: ${env:PRISMA_ENDPOINT}
          datamodel: datamodel.prisma
          secret: <whatever is your secret>
          ```
      - From now on, you can do in the prisma folder in the terminal: ```prisma deploy -e ../config/prod.env```
   5) See if the prisma server is deployed: Go to prisma cloud. (You can open playground!)
   6) check database admin panel (e.g. pgAdmin) and Data Browser in prisma cloud, to see if all working correctly if you create a data in the playground.
   
### 3. Host/Deploy the node.js api app (on Heroku)
1. ```npm install -g heroku``` if you have not got heroku cli yet.
2. In terminal, ```heroku login```
3. Adjust the port in index.js in the node.js app as below:
    ```
    server.start({ port: process.env.PORT || 4000 }, () => {
      console.log('The server is up!');
    });
    ```
4. In Prisma.js, set
    ```
    endpoint: process.env.PRISMA_ENDPOINT,
    ```
5. Install env-cmd to pass environmental variable above.
   ```
   npm install env-cmd
   ```
5. In package.json, pass the environmental variable.
    ```
    "dev": "env-cmd ./config/dev.env nodemon src/index.js --ext js,graphql --exec babel-node",
    ```
6. Below for transpiling the code
    ```
    "heroku-postbuild": "babel src --out-dir dist --copy-files", // babel transpiles the src files and output to dist folder. --copy-files will copy files that are not js files as well.
    ```
7. babel (for prod) vs babel-node (for dev)
    - babel does not come with below so need to install
        ```
        npm install @babel/polyfill
        ```
    - import the polyfill in index.js
    ```
    import '@babel/polyfill';
    ```
    
8. Start command for production
    ```
    "start": "node dist/index.js",
    ```
7. ```heroku create```
8. Set environmental variable in Heroku for production
    ```heroku config:set PRISMA_ENDPOINT=<your endpoint here for production>```<br />
     ```heroku config:set PRISMA_SECRET=<your secret>```<br />
     ```heroku config:set JWTSECRET=<your secret>```
9. Commit and push your changes to Heroku ```git push heroku master```
      
## Testing
1. Create test.env in config
    ```
    PRISMA_ENDPOINT=http://localhost:4466/defaut/test
    PRISMA_SECRET=<your_secret>
    JWTSECRET=<your_secret>
    ```
2. Go to the prisma folder, then deploy
    ```
    prisma deploy -e ../config/test.env
    ```
3. Install jest for dev in the root
    ```npm install jest --save-dev```
4. package.json
    ```"test": "env-cmd ./config/test.env jest --watch"```
5. create a 'tests' folder in the root
6. Inside the 'tests' folder, create 'jest' folder.
7. Move out the server from index.js and create server.js and import it to index.js.
7. Inside the jest folder, create globalSetup.js and globalTeardown.js




