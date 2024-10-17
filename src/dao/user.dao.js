const UserModel = require("./models/user.model.js")

class UserDao {
    async findById(id){
        return await UserModel.findById(id); 
    }

    async findOne(query) {
        return await UserModel.findOne(query); 
    }

    async save(userData) {
        const user = new UserModel(userData);
        return await user.save(); 
    }
}

module.exports = new UserDao();
