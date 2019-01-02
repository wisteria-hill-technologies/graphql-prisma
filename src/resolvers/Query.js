import getUserId from '../utils/getUserId';

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
  myPosts(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    const opArgs = {
      where: {
        author: {
          id: userId
        }
      }
    };
    if(args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  posts(parent, args, { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    };
    if(args.query) {
      opArgs.where.OR = [
        {
          title_contains: args.query
        },
        {
          body_contains: args.query
        }
      ];
    }
    return prisma.query.posts(opArgs, info);
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
    // if(!args.query) {
    //   return db.comments;
    // }
    // return db.comments.filter(comment => comment.text.includes(args.query));
  },
  me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request);
    return prisma.query.user({
      where: {
        id: userId
      }
    }, info);
  },
  async post(parent, args, { prisma, request }, info) {
    const requireAuth = false;
    const userId = getUserId(request, requireAuth);

    const posts = await prisma.query.posts({
      where: {
        id: args.id,  // where id matches and published or author is the user himself/herself.
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info);

    if (posts.length === 0) {
      throw new Error('Post not found');
    }
    return posts[0];
  },
};

export { Query as default };