const jwt = require('jsonwebtoken');

//===========================================
//      Verificar el token
//===========================================
let verificaToken = (req, res, next) => {
    let token = req.get('token');
 
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok:false,
                err
            });
        }

        req.usuario = decoded.usuario;

        next();
    });

    
};

//===============================================
//    Verificar el rol de admin
//===============================================
let verificaAdmin_role = (req, res, next) => {
    let usuario = req.usuario;
    
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        res.json({
            ok: true,
            err: {
                message: 'El usuario no es un Admin'
            }
        })
    }
};


module.exports = {
    verificaToken,
    verificaAdmin_role
}