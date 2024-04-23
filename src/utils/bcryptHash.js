import bcrypt from "bcrypt";

// Crear el hash para el password
const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

// Compara el password y retorna true o false
const isValidPassword = (password, hashedPassword) => bcrypt.compareSync(password, hashedPassword);

export { createHash, isValidPassword };
