import { expect } from "chai";
import db from "../database/db.js";
import User from "../models/User.js";
// Her laver vi en test hvor vi test prøver

describe("", () => {
    // Opret forbindelse til databasen først
    before(async () => {
        await db.connect();
    })


    it("Den bør oprette en ny bruger", async () => {
        const user = new User(mockUser)

        const result = await user.create();
        expect(result).to.be.an("object");
        expect(result).to.have.property("rowsAffected");
        expect(result.rowsAffected[0]).to.equal(1);
    })

    it("Vi bør kunne finde brugeren i databasen", async() => {
        const user = await User.findBy("username", mockUser.username);
        expect(user).to.be.an("object");
        expect(user).to.have.property("username");
        expect(user.username).to.equal(mockUser.username);
        expect(user).to.have.property("email");
        expect(user.email).to.equal(mockUser.email);
    })

    it("Vi bør kunne opdatere brugeren", async() => {
        const user = await User.findBy("username", mockUser.username);
        user.name = "Updated Test User";
        const result = await user.update();
        expect(result).to.be.an("object");
        expect(result).to.have.property("rowsAffected");
        expect(result.rowsAffected[0]).to.equal(1);
    })

    // Ryd op i databasen efter testen
    after("Ryd op i databasen", async () => {
        const result = await db.request()
            .input("username", mockUser.username)
            .query(`DELETE FROM ${User.table} WHERE username = @username`);
        expect(result).to.be.an("object");
        expect(result).to.have.property("rowsAffected");
        expect(result.rowsAffected[0]).to.equal(1);
    })
})