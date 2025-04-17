import db, {sql} from '../database/db.js';

//
class User {

    // Her definerer vi en statisk variabel, som indeholder navnet på tabellen i databasen.
    // Dette gør det nemmere at ændre navnet på tabellen hvis det skulle blive nødvendigt.
    // vi bruger static for at gøre variablen tilgængelig uden at skulle oprette et
    // objekt. Vi kan derfor tilgå variablen ved at skrive User.table
    static table = '[User]';
    // Her definerer vi en statisk variabel som indeholder navnene på kolonnerne i tabellen.
    static columns = ['id','username', 'name', 'email', 'password', 'created_at', 'updated_at'];

    // Her defineres vores konstruktør.
    // Vi bruger en default parameter så vi kan kalde User-klassen uden at sende data med.
    // Udover det, så tager vi et objekt som parameter, i stedet for at tage flere parametre.
    // Dette gør det nemmere at tilføje flere parametre til klassen, uden at skulle ændre i konstruktøren.
    // samt gør det nemmere at forstå hvilke data der sendes med.
    constructor(data = {}){
        this.id = data.id;
        this.name = data.name;
        this.username = data.username
        this.email = data.email;
        this.password = data.password;

    }

    // Her benytter vi os af "static", så vi kan kalde metoden uden at "oprette" et objekt.
    // Det er brugbart i situationer, hvor vi ikke har brug for at gemme data i objektet.
    static async findBy(column, value, columns = User.columns){
        const result = await db.request().input(column, value)
            .query(`SELECT TOP 1 ${columns.join(', ')} FROM ${User.table} WHERE ${column} = @${column}`);


        // Hvis der ikke er nogen resultater, så returner null
        if(result.recordset.length === 0) return null;
        // Ellers, så returner det første resultat
        return new User(result.recordset[0]);
    }

    async create(){

        // Her bruger vi db.query til at indsætte data i databasen.
        // Vi bruger User.table for at referere til tabellen. Det gør vi fordi
        // vi har defineret tabellen som en statisk variabel i klassen.
        // Og den kan derfor ikke tilgås uden at referere til klassen.

        const result = await db.request()
            .input('name', this.name)
            .input('username', this.username)
            .input('email', this.email)
            .input('password', this.password)
            .query(`INSERT INTO ${User.table} (name, username, email, password)
            VALUES (@name, @username, @email, @password)`);


        return result;
    }

    async update(){

        const result = await db.request()
            .input('id', this.id)
            .input('name', this.name)
            .input('username', this.username)
            .input('email', this.email)
            .input('password', this.password)
            .query(`UPDATE ${User.table} SET name = @name, username = @username, email = @email, password = @password WHERE id = @id`);

        console.log(result);
        return result;
    }

    static async delete(){
        const [result] = await db.query(`DELETE FROM ${this.table} WHERE id = ?`, [this.id]);
        return result;
    }



}


export default User;
