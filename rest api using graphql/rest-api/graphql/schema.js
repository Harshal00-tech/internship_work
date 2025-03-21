

const typeDefs = `#graphql
  type Post {
    _id: ID!
    title: String!
    content: String!
    creator: User!
    createdAt: String!
    updatedAt: String!
  }

  type User {
    _id: ID!
    name: String!
    email: String!
    createdAt: String!
    updatedAt: String!
  }

  input UserData {
    name: String!
    email: String!
    password: String!
  }

  input LoginData {
    email: String!
    password: String!
  }

  input PostData{
    title: String!
    content: String!
  }

  input updatedPostData{
    title: String!
    content: String!
    postId: String!
  }
  
  type LoginResponse {
    message: String!
    token: String!  
  }

  type logoutRes {
   message: String!
  }


  type Mutation {
    registerUser(userInput: UserData): User!
    loginUser(userInput: LoginData): LoginResponse
    createPost(userInput: PostData): Post!
    updatePost(userInput: updatedPostData): Post!
    deletePost(postId: String!): Post!
    logOut: logoutRes!
  }
  
  input pagination {
    limit : Int,
    page : Int,
  }

  type Query {
    getPost(userInput: updatedPostData): Post!
    getPosts(userInput: pagination): [Post!]!
  }
  
`;

export default typeDefs;