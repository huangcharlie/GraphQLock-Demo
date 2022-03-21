const db = require('./graphQLmodel');
const types = require('./types');
const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLString,
  GraphQLInt,
} = require('graphql');

const RootMutationType = new GraphQLObjectType({
  name: 'Mutation',
  description: 'Root Mutation',
  fields: () => ({
    addCharacter: {
      type: types.PeopleType,
      description: 'Add a character',
      args: {
        name: { type: GraphQLString },
        mass: { type: GraphQLInt },
        hair_color: { type: GraphQLString },
        skin_color: { type: GraphQLString },
        eye_color: { type: GraphQLString },
        birth_year: { type: GraphQLString },
        gender: { type: GraphQLString },
        species_id: { type: GraphQLInt },
        homeworld_id: { type: GraphQLInt },
        height: { type: GraphQLInt },
      },
      resolve: (parent, args) => {
        const { name,	mass,	hair_color,	skin_color,	eye_color,	birth_year,	gender,	species_id,	homeworld_id,	height } = args;
        const addCharSQL =   
          `INSERT INTO people (name,	mass,	hair_color,	skin_color,	eye_color,	birth_year,	gender,	species_id,	homeworld_id,	height)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
          RETURNING *`;
        const input = [ name,	mass,	hair_color,	skin_color,	eye_color,	birth_year,	gender,	species_id,	homeworld_id,	height ];
        return db.query(addCharSQL, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
    deleteCharacter: {
      type: types.PeopleType,
      description: 'Remove a character',
      args: {
        id: { type: GraphQLInt },
        name: { type: GraphQLString },
      },
      resolve: (parent, args) => {
        const { id, name } = args;
        const deleteSQL = 'DELETE FROM people WHERE _id=$1 OR name=$2 RETURNING *';
        const input = [ id, name ];
        return db.query(deleteSQL, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
    updateCharacter: {
      type: types.PeopleType,
      description: 'Update a character',
      args: {
        target_id: { type: GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        mass: { type: GraphQLInt },
        hair_color: { type: GraphQLString },
        skin_color: { type: GraphQLString },
        eye_color: { type: GraphQLString },
        birth_year: { type: GraphQLString },
        gender: { type: GraphQLString },
        species_id: { type: GraphQLInt },
        homeworld_id: { type: GraphQLInt },
        height: { type: GraphQLInt },
      },
      resolve: async (parent, args) => {
        let target;

        const resultsSQL = 'SELECT * FROM people WHERE _id=$1;';
        await db.query(resultsSQL, [ args.target_id ])
          .then(data => {
            target = data.rows[0];
          })
          .catch(err => console.log(err));
        
        for (const key in args) {
          if (args[key] != null) target[key] = args[key];
        }

        const { name,	mass,	hair_color,	skin_color,	eye_color,	birth_year,	gender,	species_id,	homeworld_id,	height } = target;

        const updateCharSQL =   
          `UPDATE people SET name=$1, mass=$2, hair_color=$3,	skin_color=$4, eye_color=$5, birth_year=$6, gender=$7, species_id=$8, homeworld_id=$9, height=$10
          WHERE _id=$11
          RETURNING *`;
        const input = [ name,	mass,	hair_color,	skin_color,	eye_color,	birth_year,	gender,	species_id,	homeworld_id,	height, args.target_id ];
        return await db.query(updateCharSQL, input)
          .then(data => {
            return data.rows[0];
          })
          .catch(err => console.log(err));
      }
    },
  })
})

module.exports = RootMutationType;
