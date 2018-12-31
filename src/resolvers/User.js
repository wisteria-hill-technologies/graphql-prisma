const User = {
  // // Below becomes unnecessary with prisma as prisma automatically works out the relationship for you.
  // posts(parent, args, { db }, info) {
  //   return db.posts.filter(post => post.author === parent.id);
  // },
  // comments(parent, args, { db }, info) {
  //   return db.comments.filter(comment => comment.author === parent.id);
  // }
};

export { User as default };