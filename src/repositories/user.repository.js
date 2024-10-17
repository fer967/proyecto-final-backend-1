const userDao = require("../dao/user.dao.js");

class UserRepository{
    async createUser(userData){
        return await userDao.save(userData);
    }

    async getUserById(id){
        return await userDao.findById(id);
    }

    async getUserByEmail(email){
        return await userDao.findOne({email});
    }
}

module.exports = new UserRepository();
