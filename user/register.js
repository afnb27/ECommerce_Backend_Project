// @see https://docs.aircode.io/guide/functions/
const aircode = require('aircode');
const bcrypt = require('bcrypt');

module.exports = async function (params, context) {
  console.log('Received params:', params);
  console.log('Received params:', context);

  const {name, email, password} = params; 
  if(!name || !email || !password) {
    context.status(400);
    return{
      "message" : "Debe llenar todos los campos"
    }
  }

  const userTable = aircode.db.table('user');

  const userExist = await userTable 
  .where({email})
  .findOne()

  if(userExist){
    context.status(409);
    return {"message": "El usuario ya existe"}
  }

  try {
const count = await userTable
    .where()
    .count()

    console.log("La cuenta del usuario es : ", count);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {name, email, "password": hashedPassword, "isAdmin": false};

    if(count == 0) {
      newUser.isAdmin = true;
    }

    await userTable.save(newUser);

  const result = await userTable
    .where({email})
    .projection({password : 0, isAdmin: 0})
    .find ();

    console.log("el resultado es : ", result); 

    context.status(201);
    return {
      ... result
    }
  }catch(err) {
    context.status(500);
    return{"message" : err.message};
  }
};
  