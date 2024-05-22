const sql = require("mssql/msnodesqlv8");
const User = require('../model/user');

class UserRepository {
    constructor() {
        this.users = [];
        this.loadData();
    }

    async getAll() {
        return this.users;
    }

    async addUser(newUser) {
        const config = {
            server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
            database: "MPP",
            options: {
                trustedConnection: true
            }
        };
    
        try {
            await sql.connect(config);
    
            const existingUser = await this.getByUsernameOrEmail(newUser.username, newUser.email);
            if (existingUser) {
                throw new Error(existingUser.username === newUser.username ? 'Username already exists' : 'Email already exists');
            }
    
            const request = new sql.Request();
            const result = await request.query(`INSERT INTO Users (Username, Email, Password, CreatedAt, UpdatedAt) 
                                                VALUES ('${newUser.username}', '${newUser.email}', '${newUser.password}', GETDATE(), GETDATE())`);
            console.log('User added successfully:', newUser);
            console.log('User registered successfully');
            this.loadData();
        } catch (error) {
            console.error('Error adding user:', error.message);
            throw error;
        } finally {
            sql.close();
        }
    }
    

    async getByUsername(username) {
        const user = this.users.find(user => user.username === username);
        return user;
    }

    async getByUsernameOrEmail(username, email) {
        const user = this.users.find(user => user.username === username || user.email === email);
        return user;
    }

    async loadData() {
        try {
            const pool = await sql.connect({
                server: "DESKTOP-UNPDD2B\\SQLEXPRESS01",
                database: "MPP",
                driver: "msnodesqlv8",
                options: {
                    trustedConnection: true
                }
            });
            const request = pool.request();
            const result = await request.query("SELECT * FROM Users");

            if (result.recordset.length > 0) {
                this.users = result.recordset.map(record => new User(
                    record.Id,
                    record.Username,
                    record.Email,
                    record.Password,
                    record.CreatedAt,
                    record.UpdatedAt
                ));

            }
        } catch (error) {
            console.error('Error loading users:', error);
        }
    }
}

module.exports = UserRepository;
