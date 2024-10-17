class UserDto {
    constructor(user) {
        this.email = user.email;
        this.role = user.role; 
    }
}

module.exports = UserDto; 