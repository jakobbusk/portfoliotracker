// Auth controller
import { validateLoginData, validateRegisterData } from "../helpers/validators/authData.js"
import User from '../models/User.js';

export default class AuthController {

    // Login
    static async login(req,res){
        // Dekonstruering af email og password fra req.body
        const { username, password} = req.body


        // Validering af email og passwor
        const { valid, errors } = validateLoginData({ username, password })
        // Hvis der er fejl, så returner fejl
        if (!valid) {
            return res.status(400).json({ errors })
        }

        const user = await User.findBy('username', username)

        // Hvis der ikke er nogen bruger med det brugernavn, så returner fejl
        if (!user || user.password != password) {
            return res.status(400).json({ message: 'Invalid username or password' })
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
        // Authorization headeren er i formatet "Basic base64(email:password)"
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
            console.log(await user.create());


        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'User creation failed' })
        }

        return res.status(200).json({ message: 'User created' })
    }


    static async changePassword(req, res) {
        const { oldPassword, newPassword, confirmNewPassword, email } = req.body

        // Validering af password
        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: 'Nye passwords matcher ikke' })
        }
        if (!newPassword || newPassword.trim() === '' || newPassword.length < 5 || newPassword.length > 50) {
            return res.status(400).json({ message: 'Fejl på password' })
        }


        // Vi henter brugeren fra database vha username som er gemt i session
        const user = await User.findBy('email', email)
        // Hvis brugeren ikke findes, så returner fejl
        if (!user) {
            return res.status(400).json({ message: 'Bruger ikke fundet' })
        }

        // Hvis det gamle password ikke matcher, så returner fejl
        if (user.password !== oldPassword) {
            return res.status(400).json({ message: 'Gammelt password er forkert' })
        }

        // Opdater password
        user.password = newPassword
        try {
            await user.update()
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Passwordopdatering fejlede' })
        }

        return res.status(200).json({ message: 'Password opdateret' })
    }
}
