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

export { User as default };