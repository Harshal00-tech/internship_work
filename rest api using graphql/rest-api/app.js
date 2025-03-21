import { ApolloServer } from '@apollo/server';
import typeDefs from './graphql/schema.js';
import resolvers from './graphql/resolver.js';
import mongoose from 'mongoose';
import jwt, { decode } from 'jsonwebtoken';
import { startStandaloneServer } from '@apollo/server/standalone';
import User from './models/user.model.js';
import Login from './models/login.model.js';

await mongoose.connect('mongodb+srv://harshal:admin004@cluster0.p9va5.mongodb.net/ecommerce1?retryWrites=true&w=majority&appName=Cluster0');

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

try {
  const { url } = await startStandaloneServer(server, {
    context: async ({ req }) => {
      try {
        let token = req.headers.authorization || "";
        if (!token) {
          return { user: null }
        }

        const decodedToken = await jwt.verify(token, 'secretsecretsecret');
      
        if (!decodedToken) {
          throw new Error('unauthenticated, try to login.')
        }

        const loginDetail = await Login.findOne({userId: decodedToken._id});
        if(loginDetail.isDeleted){
          throw new Error('Unauthenticated, try to login.')
        } 

        const user = await User.findById(decodedToken._id);

        return { user: user || null };

      } catch (error) {
        console.error('JWT Error:', error);
        return { user: null };  
      }
    },
  });

  console.log(`🚀 Server ready at ${url}`);
} catch (error) {
  console.error('Server Error:', error);
  throw new Error(error);
}
