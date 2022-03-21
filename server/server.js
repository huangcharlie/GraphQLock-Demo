const path = require('path');
const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const { GraphQLSchema } = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const RootQueryType = require('./RootQueryType');
const RootMutationType = require('./RootMutationType');
const usersRouter = require('./routers/usersRouter');
const { validateToken, createSecrets } = require('graphqlock');
createSecrets();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// user login router
app.use('/users', usersRouter);

// graphql server
const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType
})

// const authorization = (req, res, next) => {
//   console.log('unchanged:', req.body.query);
//   console.log('request root:', req.body.query.split('{\n')[0].trim().split(' ')[0]);
//   console.log('request field:', req.body.query.split('{\n')[1].trim().split(' ')[0]);
//   // console.log('printing cookies: ', req.cookies.jwt);

//   // if (req.cookies.jwt) {
//   //   jwt.verify(req.cookies.jwt, process.env.JWT_SECRET, (err, decoded) => {
//   //     if (err) return next({
//   //       log: `Access Token not verified. ERROR: ${err}`,
//   //       message: { err: 'Error occurred in Access Token verification. Check server logs for more details.' },
//   //     });
//   //     if (decoded.role === 'admin') return next();
//   //     if (decoded.role === 'read-only' && req.body.query[0] === 'q') return next();
//   //     return res.status(200).json('Invalid Permissions');
//   //   })
//   // } else {
//   //   return res.status(200).json('Invalid Permissions');
//   // }
// }

// use of express-graphql module to connect Express server and GraphQL API
// app.use('/graphql', authorization, graphqlHTTP({
app.use('/graphql', validateToken, graphqlHTTP({
// app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}))



if(process.env.NODE_ENV === 'production') {
  // statically serve everything in the dist folder on the route '/dist'
  app.use('/dist', express.static(path.resolve(__dirname, '../dist')));
  // serve main app index.html on the route '/'
  app.get('/', (req, res) => {
    return res.status(200).sendFile(path.resolve(__dirname, '../dist/index.html'));
  });
};

// catch-all route handler for any requests to an unknown route
app.use((req, res) => res.status(404).send('This is not the page you\'re looking for...'));

// global handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 500,
    message: { err: 'An error occurred' },
  };
  const errorObj = Object.assign({}, defaultErr, err);
  console.log(errorObj.log);
  return res.status(errorObj.status).send(errorObj.message);
});

app.listen(port, () => console.log('Server running and listening on', port));
