class UserDto {
    constructor(user) {
        this.usuario = user.usuario;
        this.email = user.email;
        this.role = user.role;
        this.cart = user.cart; 
    }
}

module.exports = UserDto; 