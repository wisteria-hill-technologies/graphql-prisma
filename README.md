# GraphQL Server with Prisma ORM

First install prisma on your machine (if you have not done so yet).
``` 
npm install -g prisma
prisma -v
```

## Prisma setup
1. Initialise a new project for prisma.
- create a new folder for prisma. cd into it.
- Initialise prisma.
    ```prisma init <project-name>```
    Enter details about your database.
    Don't generate Prisma client if you are making one yourself.
    It will create three new files as below.
    ```
      prisma.yml           Prisma service definition
      datamodel.prisma    GraphQL SDL-based datamodel (foundation for database)
      docker-compose.yml   Docker configuration file
    ```
- Follow the instruction in the terminal.
2. ```docker-compose up -d``` This will run the docker container for prisma ORM in the background.
3. ```prisma deploy```
    This is to reflect the latest changes in your database.
    This will deploy the graphQL server.
    Now if you define the datamodel.prisma, prisma will automatically create query, mutation, and subscriptions for you! =)
4. When you make changes to detamodel.prisma, you need to run ```prisma deploy``` again.
* If you create User with the same name and email address multiple times, it will create multiple.... To avoid this, use ````@unique````

## Connecting to a Node Server
1. Create package.json file with all the dependencies and install them.
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
   
2. In prisma folder, ```deploy prisma```.
3. Open prisma.js in src folder.
   - add the same secret to the prisma instance.
    This will allow the node server to access the prisma.

### Accessing prisma directly still.
1. Go to prisma folder in your terminal.
2. execute ```prisma token```
   1) This will generate an authorisation token.
   2) Copy and paste the token.
   3) add in the HTTP HEADERS the following in the prisma graphQL playground.
   ``` 
   {
     "Authorization": "Bearer <your token>"
   }
   ```

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
    2) Create ````etUserId.js```` to authenticate the user making a request with token.
    3) In Mutation.js, do something like below:
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
    4) In schema.graphql, remove ```author: ID!``` from CreatePostInput
        ```
        input CreatePostInput {
            title: String!,
            body: String!,
            published: Boolean!,
           #  we don't need author here anymore.  author: ID!
        }
        ```