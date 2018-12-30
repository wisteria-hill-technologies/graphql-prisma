let users = [
  {
    id: '1',
    name: 'Bob',
    email: 'bob@emailemail.com',
    age: 30
  },
  {
    id: '2',
    name: 'Mike',
    email: 'mike@emailemail.com',
    age: 43
  },
  {
    id: '3',
    name: 'Bill',
    email: 'bill@emailemail.com',
    age: 45
  },
  {
    id: '4',
    name: 'Sarah',
    email: 'sarah@emailemail.com',
    age: 27
  },
];

let posts = [
  {
    id: '001',
    title: 'My first post',
    body: 'This is my first post.',
    published: true,
    author: '4'
  },
  {
    id: '002',
    title: 'How to make a pancake',
    body: 'This is how to do it.',
    published: false,
    author: '2'
  },
  {
    id: '003',
    title: 'Javascript is great!',
    body: 'It is interesting to learn javascript...',
    published: true,
    author: '2'
  },
  {
    id: '004',
    title: 'What about C++??',
    body: 'Shall I learn C++...?',
    published: true,
    author: '1'
  },
];

let comments = [
  {
    id: '100',
    text: 'This is a great post',
    author: '4',
    post: '001'
  },
  {
    id: '200',
    text: 'This post is cool!',
    author: '2',
    post: '002'
  },
  {
    id: '300',
    text: 'Here is my comments...',
    author: '1',
    post: '004'
  },
];

const db = {
  users,
  posts,
  comments
};

export { db as default };