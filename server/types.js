const {
  GraphQLSchema, 
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
  GraphQLFloat,
} = require('graphql');
const db = require('./graphQLmodel');

const types = {};

types.PeopleType = new GraphQLObjectType({
  name: 'Person',
  description: 'This is a starwars character',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    mass: { type: GraphQLFloat },
    hair_color: { type: GraphQLString },
    skin_color: { type: GraphQLString },
    eye_color: { type: GraphQLString },
    birth_year: { type: GraphQLString },
    gender: { type: GraphQLString },
    species_id: { type: GraphQLInt },
    species: {
      type: types.SpeciesType,
      resolve: (parent) => {
        const SQLstring = 'SELECT * FROM species WHERE _id=$1;';
        const input = [parent.species_id];
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
    homeworld_id: { type: GraphQLInt },
    homeworld: {
      type: types.PlanetsType,
      resolve: (parent) => {
        const SQLstring = 'SELECT * FROM planets WHERE _id=$1;';
        const input = [parent.homeworld_id];
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
    height: { type: GraphQLInt },
  })
})

types.PlanetsType = new GraphQLObjectType({
  name: 'Planet',
  description: 'This is a starwars planet',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    rotation_period: { type: GraphQLInt },
    orbital_period: { type: GraphQLInt },
    diameter: { type: GraphQLInt },
    climate: { type: GraphQLString },
    gravity: { type: GraphQLString },
    terrain: { type: GraphQLString },
    surface_water: { type: GraphQLInt },
    population: { type: GraphQLFloat },
  })
})

types.SpeciesType = new GraphQLObjectType({
  name: 'Species',
  description: 'This is a starwars species',
  fields: () => ({
    _id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    classification: { type: GraphQLString },
    average_height: { type: GraphQLString },
    average_lifespan: { type: GraphQLString },
    hair_colors: { type: GraphQLString },
    skin_colors: { type: GraphQLString },
    eye_colors: { type: GraphQLString },
    language: { type: GraphQLString },
    homeworld_id: { type: GraphQLInt },
    homeworld: {
      type: types.PlanetsType,
      resolve: (parent) => {
        const SQLstring = 'SELECT * FROM planets WHERE _id=$1;';
        const input = [parent.homeworld_id];
        return db.query(SQLstring, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
  })
})

module.exports = types;
