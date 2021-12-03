import User from '../models/user.js';
import Role from '../models/role.js'
import Permission from '../models/permission.js';
import RolePermission from '../models/role_permission.js';

const Authorization = async (req, res, next) => {
    try {
        console.log('Authorization');
        let path = req.baseUrl;
        if (req.route.path !== '/') path += req.route.path
        const {role} = await User.findOne({_id: req.userID});
        console.log(role);

        if (role == 'MASTER') return next();


        const checkRole = await Role.findOne({name: role});
        if (checkRole === null) return res.sendStatus(403);

        
        const findPermission = await Permission.findOne({method: req.method, path}, {name: 1})
        if (findPermission === null) return res.sendStatus(403);        
        const rolePermission = await RolePermission.findOne({role, permission: findPermission.name})
        if (rolePermission !== null) {
            console.log('PASS');
            next();
        }
        else res.sendStatus(403);
    } catch (error) {
        res.sendStatus(400);
    }
}
export default Authorization;