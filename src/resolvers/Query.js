const Query = {
  users (parent, args, { prisma }, info) {
    const opArgs = {};

    if(args.query) {
      opArgs.where = {
        OR: [
          {
            name_contains: args.query
          },
          {
            email_contains: args.query
          }
        ]
      }
    }
    return prisma.query.users(opArgs, info);
    // 1st param for request arguments, 2nd param is what we request as output.
    // Above, there are 3 options for the 2nd argument - null, string like "id name email age", or object
    // Using info, we do not manually type what is requested.

    // if(!args.query) {
    //   return db.users;
    // }
    // return db.users.filter(user => {
    //   return user.name.toLowerCase().includes(args.query.toLowerCase());
    // });
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {};
    if(args.query) {
      opArgs.where = {
        OR: [
          {
            title_contains: args.query
          },
          {
            body_contains: args.query
          }
        ]
      }
    }
    return prisma.query.posts(opArgs, info);
    // if(!args.query) {
    //   return db.posts;
    // }
    // return db.posts.filter(post => {
    //   const titleIncludesQuery = post.title.toLowerCase().includes(args.query.toLowerCase());
    //   const bodyIncludesQuery = post.body.toLowerCase().includes(args.query.toLowerCase());
    //   return titleIncludesQuery || bodyIncludesQuery;
    // });
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
    // if(!args.query) {
    //   return db.comments;
    // }
    // return db.comments.filter(comment => comment.text.includes(args.query));
  },
  me() {
    return {
      id: '123abc',
      name: 'Mike',
      email: 'mike@myemail.com',
      age: 35
    }
  },
  post() {
    return {
      id: '092',
      title: 'GraphQL 101',
      body: 'Hello, World!!!',
      published: true
    }
  },
};

export { Query as default };