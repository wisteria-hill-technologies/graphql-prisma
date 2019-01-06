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
  },
  posts: {
    fragment: 'fragment userId on User { id }',
    resolve(parent, args, { prisma }, info) {
      return prisma.query.posts({
        where: {
          author: {id: parent.id},
          published: true
        }
      })
    }
  },
  password: () => "Password is hidden"
};

export { User as default };