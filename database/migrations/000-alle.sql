CREATE TABLE User (
    id INT IDENTITY PRIMARY KEY,
    username NVARCHAR(255) UNIQUE NOT NULL,
    name NVARCHAR(255),
    email NVARCHAR(255) UNIQUE NOT NULL,
    password NVARCHAR(255) NOT NULL,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE()
);

CREATE TABLE Account (
    id INT IDENTITY PRIMARY KEY,
    userID INT,
    name NVARCHAR(255),
    currency NVARCHAR(255),
    balance DECIMAL(18, 2),
    bankReference NVARCHAR(255),
    closed BIT DEFAULT 0,
    created_at DATETIME DEFAULT GETDATE(),
    updated_at DATETIME DEFAULT GETDATE(),

    CONSTRAINT FK_userID FOREIGN KEY (userID) REFERENCES users(id),
);