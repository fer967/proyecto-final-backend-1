function soloAdmin(req, res, next) {
    if(req.user.role === "admin") {
        next(); 
    } else {
        res.status(403).send("Acceso denegado, solo para administrador"); 
    }
}

function soloUser(req, res, next) {
    if(req.user.role === "user") {
        next(); 
    } else {
        res.status(403).send("Acceso denegado, solo para usuarios");
    }
}

module.exports = {soloAdmin, soloUser}