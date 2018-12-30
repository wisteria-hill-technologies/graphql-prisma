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
          "schemaPath": "src/generated/prism.graphql", //this is where type definition from prisma will be saved.
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
10. Create prisma.js inside src folder. In prisma.js, you can write functions to work with data to/from prisma.

### Customise Type Relationships
1. Go to datamodel.prisma In prisma folder.
    ```# SET_NULL is default. or CASCADE```
    This is for example in case a record is deleted, it specifies what happens to the other records which are in relationship with the record to be deleted.
2. Add type relationships.
3. In prisma folder in terminal, ```prisma deploy```
4. Go back to the root folder. ```npm start``` to see if the changes are reflected in graphql playground for prisma (localhost:4466).

