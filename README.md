# GraphQL Server with Prisma ORM

First install prisma on your machine (if you have not done so yet).
``` 
npm install -g prisma
prisma -v
```
1. Initialise a new project.
- create a new folder for your project. cd into it.
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


