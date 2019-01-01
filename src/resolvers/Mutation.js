import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    // const emailTaken = await prisma.exists.User({ email: args.data.email });
    // if(emailTaken) {
    //   throw new Error('Email taken.');
    // }
    if(args.data.password.length < 8) {
      throw new Error("Password must be 8 characters or longer.");
    }

    const hashedPassword = await bcrypt.hash(args.data.password, 10);
    const user = await prisma.mutation.createUser({
      data: {
        ...args.data,
        password: hashedPassword
      }
    }); // do not add info here as a second param for output. This will return all scalar fields. The info argument are the fields specified by the client that they want returned.  We specified that we wanted:
    //
    // user {
    //   id
    //   name
    //   email
    // }
    // But you can't pass that into prisma.mutation.createUser because there is no user field on the User type.

    return {
      user,
      token: jwt.sign({ userId: user.id }, 'thisismysecretkey') //Create a new JWT token.
    }
  },
  async login(parent, args, { prisma }, info) {
    const user  = await prisma.query.user({
      where: {
        email: args.data.email
      }
    });
    if(!user) {
      throw new Error('Unable to login');
    }
    const isMatch = await bcrypt.compare(args.data.password, user.password);
    console.log(isMatch);
    if(!isMatch) {
      throw new Error('Unable to login');
    }
    return {
      user,
      token: jwt.sign({ userId: user.id }, 'thisismysecretkey') //Create a new JWT token.
    }
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

