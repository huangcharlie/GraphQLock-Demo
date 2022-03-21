const db = require('./graphQLmodel');
const types = require('./types');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const RootQueryType = new GraphQLObjectType({
  name: 'Query',
  description: 'Root Query',
  fields: () => ({
    character: {
      type: types.PeopleType,
      description: 'Specific starwars character',
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString }
      },
      resolve: (parent, args) => {
        const SQLstring = 'SELECT * FROM people WHERE _id=$1 OR name=$2;';
        const input = [ args.id, args.name ];
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
    people: {
      type: GraphQLList(types.PeopleType),
      description: 'List of starwars people',
      args: {
        limit: { type: GraphQLInt }
      },
      resolve: (parent, args) => {
        const SQLstring = 'SELECT * FROM people LIMIT $1;';
        const input = [ args.limit ];
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows;
          })
          .catch(err => console.log(err));
      }
    },
    planets: {
      type: GraphQLList(types.PlanetsType),
      description: 'List of starwars planets',
      args: {
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const SQLstring = 'SELECT * FROM planets LIMIT $1;';
        const input = [ args.limit ];
        // console.log(input);
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows;
          })
          .catch(err => console.log(err));
      }
    },
    species: {
      type: GraphQLList(types.SpeciesType),
      description: 'List of starwars species',
      args: {
        limit: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const SQLstring = 'SELECT * FROM species LIMIT $1;';
        const input = [args.limit];
        // console.log(input);
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows;
          })
          .catch(err => console.log(err));
      }
    }
  })
})

module.exports = RootQueryType;
