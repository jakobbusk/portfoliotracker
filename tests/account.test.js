import { expect } from "chai";
import db from "../database/db.js";
import Account from "../models/Account.js";

describe("Account test", () => {
    // Opret forbindelse til databasen først
    before(async () => {
        await db.connect();
    });

    const mockAccount = {
        userID: 1,
        name: "Test Account",
        currency: "DKK",
        balance: 1000,
        bankReference: "1234567890",
    };

    it("Den bør oprette en ny konto", async () => {
        const account = new Account(mockAccount);

        const result = await account.create();
        expect(result).to.be.an("object");
        expect(result).to.have.property("rowsAffected");
        expect(result.rowsAffected[0]).to.equal(1);
    });

})