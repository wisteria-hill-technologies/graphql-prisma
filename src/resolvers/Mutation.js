import uuidv4 from "uuid/v4";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email });
    if(emailTaken) {
      throw new Error('Email taken.');
    }
    return prisma.mutation.createUser({ data: args.data }, info);
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({ id: args.id });
    if(!userExists) {
      throw new Error('User not found.');
    }
    return prisma.mutation.deleteUser({
        where: {
          id: args.id
        }
      }, info);
  },
  updateUser(parent, args, { prisma }, info) {
    // You can do some validation like above, or just let prisma do it.
    return prisma.mutation.updateUser({
      where: {
        id: args.id
      },
      data: args.data
    });
  },
  createPost(parent, args, { prisma }, info) {
    return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published,
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info);
  },
  deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({
      where: {
        id: args.id
      }
    }, info);
  },
  updatePost(parent, args, { prisma }, info) {
    return prisma.mutation.updatePost({
      data: args.data,
      where: {
        id: args.id
      }
    }, info);
  },
  createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        post: {
          connect: {
            id: args.data.post
          }
        },
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info);
  },
  deleteComment(parent, args, { prisma }, info) {
    return prisma.mutation.deleteComment({
      where: {
        id: args.id
      }
    }, info);
  },
  updateComment(parent, args, { prisma }, info) {
    return prisma.mutation.updateComment({
      where: {
        id: args.id
      },
      data: args.data
    });
  }
};

export { Mutation as default };

