import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type User {
    _id: ID!
    username: String!
    fullName: String!
    role: String!
  }

  type Query {
    users(name: String): [User!]!
  }
`);

export default schema;