// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const { verifyToken } = require ('../helper/verifyToken');

module.exports = async function (params, context) {
  const tokenUser = await verifyToken(context);
  console.log(tokenUser);
  if(tokenUser != null && tokenUser.isAdmin) {

    const {_id, title, description, inStock, category, price, color, size} = params;
    const productTable = aircode.db.table ('product');
    
    const user = await productTable
    .where({_id})
    .findOne(); 


    try {
    const result = await productTable.save(params);
      context.status(200);
      return {
        ...result
      }
    }catch(err) {
      context.status(500);
      return {
        'message': err.message
      }
    }
  } else {
    context.status(401);
    return {
      'message' : "token no es válido o usuario no está autenticado"
    }
  }
};
