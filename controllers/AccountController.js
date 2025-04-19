// Auth controller
import { validateAccountData } from '../helpers/validators/AccountData.js';
import Account from '../models/Account.js';

export default class AccountController {

    // Hent alle konti for brugeren
    static async getAllAccounts(req, res) {
        const userID = req.user.id;

        try {
            const accounts = await Account.all(userID);
            return res.status(200).json(accounts);
        } catch (error) {
            return res.status(500).json({ message: 'Error fetching accounts', error });
        }
    }

    // Hent en konto og porteføljerne for kontoen
    static async getAccount(req, res) {
        const userID = req.user.id;
        const accountID = req.params.id;
        console.log(`Account ID: ${accountID}`);


        try {
            const account = await Account.findByIDWithTransactions(accountID, userID);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            return res.status(200).json(account);
        } catch (error) {
            console.error('Error fetching account:', error);
            return res.status(500).json({ message: 'Error fetching account', error });
        }
    }

    // Hent alle transaktioner for en konto
    static async getAccountTransactions(req, res) {
        const userID = req.user.id;
        const accountID = req.params.id;
    }



    // Opret en konto
    static async createAccount(req, res) {
        // TODO
        const userID = req.user.id;
        const { name, currency, balance, bankReference } = req.body;


        // Validering af input
        const { valid, errors } = validateAccountData({ name, currency, balance, bankReference });
        if(!valid) {
            return res.status(400).json({ message: 'Invalid input', errors });
        }



        const account = new Account({ userID, name, currency, balance, bankReference });
        try {
            const result = await account.create();
            return res.status(201).json({ message: 'Account created successfully' });
        } catch (error) {
            return res.status(500).json({ message: 'Error creating account', error });
        }
    }

    // Luk konto
    static async closeAccount(req, res) {
        const userID = req.user.id;
        const accountID = req.params.id;
        try {
            const account = await Account.findByID(accountID, userID);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            account.closed = true;
            await account.update();
            return res.status(200).json({ message: 'Account closed successfully' });
        } catch (error) {
            console.error('Error closing account:', error);
            return res.status(500).json({ message: 'Error closing account', error });

        }
    }

    // Åbner en lukket konto
    static async openAccount(req, res) {
        const userID = req.user.id;
        const accountID = req.params.id;
        try {
            const account = await Account.findByID(accountID, userID);
            if (!account) {
                return res.status(404).json({ message: 'Account not found' });
            }
            account.closed = false;
            await account.update();
            return res.status(200).json({ message: 'Account opened successfully' });
        } catch (error) {
            console.error('Error opening account:', error);
            return res.status(500).json({ message: 'Error opening account', error });
        }
    }




}


