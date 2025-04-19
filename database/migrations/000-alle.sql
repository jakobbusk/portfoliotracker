CREATE TABLE [User]
  (
     id         INT IDENTITY PRIMARY KEY,
     username   NVARCHAR(255) UNIQUE NOT NULL,
     name       NVARCHAR(255),
     email      NVARCHAR(255) UNIQUE NOT NULL,
     password   NVARCHAR(255) NOT NULL,
     created_at DATETIME DEFAULT Getdate(),
     updated_at DATETIME DEFAULT Getdate()
  );

CREATE TABLE Account
  (
     id            INT IDENTITY PRIMARY KEY,
     userID        INT NOT NULL,
     name          NVARCHAR(255) NOT NULL,
     currency      NVARCHAR(255) NOT NULL,
     balance       DECIMAL(18, 2) DEFAULT 0,
     bankReference NVARCHAR(255) DEFAULT NULL,
     closed        BIT DEFAULT 0 NOT NULL,
     created_at    DATETIME DEFAULT Getdate() NOT NULL,
     updated_at    DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_userid FOREIGN KEY (userID) REFERENCES [User](id),
  );

CREATE TABLE Portfolio
  (
     id                    INT IDENTITY PRIMARY KEY,
     name                  NVARCHAR(255) NOT NULL,
     accountID             INT NOT NULL,
     totalAcquisitionValue DECIMAL(18, 2) NOT NULL DEFAULT 0,
     totalMarketValue      DECIMAL(18, 2) NOT NULL DEFAULT 0,
     totalUnrealisedPnL    DECIMAL(18, 2) NOT NULL DEFAULT 0,
     created_at            DATETIME DEFAULT Getdate() NOT NULL,
     updated_at            DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_accountid FOREIGN KEY (accountID) REFERENCES Account(id),
  );

CREATE TABLE Asset
  (
     id         INT IDENTITY PRIMARY KEY,
     name       NVARCHAR(255) NOT NULL,
     symbol     NVARCHAR(255) NOT NULL,
     assetType  NVARCHAR(255) NOT NULL,
     currency   NVARCHAR(255) NOT NULL,
     exchange   NVARCHAR(255) NOT NULL,
     figi       NVARCHAR(255) NOT NULL,
     created_at DATETIME DEFAULT Getdate() NOT NULL,
     updated_at DATETIME DEFAULT Getdate() NOT NULL,
  );

CREATE TABLE Historicalassetprice
  (
     id         INT IDENTITY PRIMARY KEY,
     assetID    INT NOT NULL,
     date       DATETIME NOT NULL,
     assetPrice DECIMAL(18, 2) NOT NULL,
     created_at DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_assetid FOREIGN KEY (assetID) REFERENCES Asset(id),
  );

CREATE TABLE Position
  (
     id            INT IDENTITY PRIMARY KEY,
     portfolioID   INT NOT NULL,
     assetID       INT NOT NULL,
     quantity      INT NOT NULL,
     unrealisedPnL DECIMAL(18, 2) NOT NULL,
     GAK           DECIMAL(18, 2) NOT NULL,
     created_at    DATETIME DEFAULT Getdate() NOT NULL,
     updated_at    DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_position_portfolioid FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
     CONSTRAINT fk_position_assetid FOREIGN KEY (assetID) REFERENCES Asset(id),
  );

CREATE TABLE Historicalassetprice
  (
     id         INT IDENTITY PRIMARY KEY,
     assetID    INT NOT NULL,
     date       DATETIME NOT NULL,
     assetPrice DECIMAL(18, 2) NOT NULL,
     created_at DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_historicalassetprice_assetid FOREIGN KEY (assetID) REFERENCES Asset (id),
  );

CREATE TABLE Position
  (
     id            INT IDENTITY PRIMARY KEY,
     portfolioID   INT NOT NULL,
     assetID       INT NOT NULL,
     quantity      INT NOT NULL,
     unrealisedPnL DECIMAL(18, 2) NOT NULL,
     GAK           DECIMAL(18, 2) NOT NULL,
     created_at    DATETIME DEFAULT Getdate() NOT NULL,
     updated_at    DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_position_portfolioid FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
     CONSTRAINT fk_position_assetid FOREIGN KEY (assetID) REFERENCES Asset(id),
  );

CREATE TABLE Trade
  (
     id          INT IDENTITY PRIMARY KEY,
     portfolioID INT NOT NULL,
     assetID     INT NOT NULL,
     quantity    INT NOT NULL,-- number of units
     tradeRate   DECIMAL(18, 2) NOT NULL,-- price per unit
     tradingFee  DECIMAL(18, 2) NOT NULL,-- trading fee in money
     tradeType   VARCHAR(4) NOT NULL,-- buy/sell
     created_at  DATETIME DEFAULT Getdate() NOT NULL,
     updated_at  DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_trade_portfolioid FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
     CONSTRAINT fk_trade_assetid FOREIGN KEY (assetID) REFERENCES Asset(id),
  );

CREATE TABLE [Transaction]
  (
     id              INT IDENTITY PRIMARY KEY,
     portfolioID     INT NOT NULL,
     tradeID         INT,-- valgfri hvis det bare er en overførsel
     accountID       INT NOT NULL,
     amount          DECIMAL(18, 2) NOT NULL,-- beløb hævet/indsat
     currency        VARCHAR(3) NOT NULL,-- valuta på transaktionen i stedet for kontoen
     exchangeRate    DECIMAL(18, 2) NOT NULL,-- vekselkurs
     transactionType VARCHAR(8) NOT NULL,-- deposit/withdraw
     balanceBefore   DECIMAL(18, 2) NOT NULL,-- saldo før transaktionen
     balanceAfter    DECIMAL(18, 2) NOT NULL,-- saldo efter transaktionen
     created_at      DATETIME DEFAULT Getdate() NOT NULL,
     CONSTRAINT fk_transaction_portfolioid FOREIGN KEY (portfolioID) REFERENCES Portfolio(id),
     CONSTRAINT fk_transaction_tradeid FOREIGN KEY (tradeID) REFERENCES Trade(id),
     CONSTRAINT fk_transaction_accountid FOREIGN KEY (accountID) REFERENCES Account(id),
  );