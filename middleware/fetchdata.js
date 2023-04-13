var jwt = require('jsonwebtoken');
const jwt_secret = 'don$don$don$don$mehudon'

const fetchdata = (req, res, next) => {
    const token = req.header('user-token')

    if (!token) {
        return res.status(401).json({ error: 'invalid user' })
    }
    try {
        const data = jwt.verify(token, jwt_secret);
        req.user = data.user
        // console.log(req.user);
        next();

    } catch (error) {
        return res.status(401).json({ error: 'invalid user' })
    }

}

module.exports = fetchdata 