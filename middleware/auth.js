import User from '../models/User.js';

const checkAuth = async (req, res, next) => {

    if(req.headers.authorization === undefined || req.headers.authorization.startsWith('Basic') === false) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    // Vi henter authorization headeren
    // Authorization headeren er i formatet "Basic base64(username:password)"
    // Vi splitter den op i to dele og tager den anden del
    const basicauth =  Buffer.from(req.headers.authorization.split(" ")[1], "base64").toString("utf-8");
    const [username, password] = basicauth.split(":");



    if (!username || !password) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    const user = await User.findBy('username', username)
    // Hvis brugeren ikke findes så returner fejl
    if (!user) {
        return res.status(401).json({ message: 'Unauthorized' })
    }
    // Hvis password ikke matcher så returner fejl
    if (user.password !== password) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    req.user = user; // Gem brugeren i request objektet

    console.log(`User ${user.username} is authenticated`);

    next(); // Gå videre til næste middleware

}

export default checkAuth;