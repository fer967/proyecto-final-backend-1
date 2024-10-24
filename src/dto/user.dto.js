class UserDto {
    constructor(user) {
        this.usuario = user.usuario;
        this.email = user.email;
        this.role = user.role; 
    }
}

module.exports = UserDto; 