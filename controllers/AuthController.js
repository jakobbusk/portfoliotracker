// Auth controller
import { validateLoginData, validateRegisterData } from "../helpers/validators/authData.js"
import User from '../models/User.js';

export default class AuthController {

    // Login
    static async login(req,res){
        // Dekonstruering af email og password fra req.body
        const { email, password} = req.body


        // Validering af email og passwor
        const { valid, errors } = validateLoginData({ email, password })
        // Hvis der er fejl, så returner fejl
        if (!valid) {
            return res.status(400).json({ errors })
        }

        const user = await User.findBy('email', email)

        // Hvis der ikke er nogen bruger med den email, så returner fejl
        if (!user || user.password != password) {
            return res.status(400).json({ message: 'Invalid email or password' })
        }


        return res.status(200).json({ message: 'Login successful' })
    }

    // Log ud
    static async logout(req, res ) {
        // Ingen logout funktionalitet da vi bruger basic auth og local storage
    }

    // check login
    static async checkAuth(req, res) {

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

        return res.status(200).json({ message: 'Authorized' })

    }

    // register
    static async register(req, res) {
        const { name, username, email, password } = req.body

        // Validering af email og password
        const { valid, errors } = validateRegisterData({ email, password,name, username })
        // Hvis der er fejl, så returner fejl
        if (!valid) {
            return res.status(400).json({ errors })
        }

        // Opret bruger
        const user = new User({ name, email,username, password })
        try {
            await user.create()
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'User creation failed' })
        }

        return res.status(200).json({ message: 'User created' })
    }


    static async changePassword(req, res) {
        const { oldPassword, newPassword, confirmNewPassword } = req.body


        // Validering af password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'New passwords do not match' })
        }


        // Vi henter brugeren fra database vha username som er gemt i session
        const user = await User.findBy('username', req.user.username)
        // Hvis brugeren ikke findes, så returner fejl
        if (!user) {
            return res.status(400).json({ message: 'User not found' })
        }

        // Hvis det gamle password ikke matcher, så returner fejl
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: 'Old password is incorrect' })
        }

        // Opdater password
        user.password = newPassword
        try {
            await user.update()
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Password update failed' })
        }

        return res.status(200).json({ message: 'Password updated' })
    }
}
