// require('dotenv').config();

// const serviceName = process.env.DB_SERVICE_NAME;
// let objectConfig = {
//   database: process.env.DB_DATABASE,
// };
// if (serviceName) {
//   objectConfig = {
//     dialectOptions: {
//       connectString: `(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL=TCP)(HOST=${process.env.DB_HOST})(PORT=${process.env.DB_PORT})))(CONNECT_DATA=(SERVICE_NAME=${process.env.DB_SERVICE_NAME})))`,
//       connectTimeout: 60000,
//     },
//   };
// }

// module.exports = {
//   development: {
//     dialect: process.env.DB_DIALECT || 'postgres',
//     host: process.env.DB_HOST || 'localhost',
//     port: process.env.DB_PORT || 5432,
//     username: process.env.DB_USER || 'postgres',
//     password: process.env.DB_PASSWORD || '',
//     ...objectConfig,
//     dialectOptions: {
//       connectTimeout: 60000,
//     },
//   },
// };
