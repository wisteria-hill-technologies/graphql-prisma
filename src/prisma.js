import { Prisma } from 'prisma-binding'

const prisma = new Prisma({
  typeDefs: 'src/generated/prisma.graphql',
  endpoint: 'http://localhost:4466'
});

// prisma.query, prisma.mutation, prisma.subscription, prisma.exists

prisma.query.users(null, '{ id name posts { id title } }').then((data)=>{
  console.log(JSON.stringify(data));
});
//
// prisma.query.comments(null, '{ id text author { id name } }').then((data)=>{
//   console.log(data)
// });

// prisma.mutation.createPost({
//   data: {
//     title: "Javascript Is Great!",
//     body: "It is a great idea to use javascript for your app.",
//     published: true,
//     author: {
//       connect: {
//         id: "cjn6i6vvd0013094803o5bo7y"
//       }
//     }
//   }
// }, '{ id title body published author { id name } }').then((data) => {
//   console.log(data)
// });