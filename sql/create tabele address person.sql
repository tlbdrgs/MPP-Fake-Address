CREATE TABLE Address (
    addressID int IDENTITY(1,1) PRIMARY KEY,
    street varchar(100),
    city varchar(30),
    zipCode int,
    country varchar(30),
    randomNumber float
);

CREATE TABLE Person (
    personID int IDENTITY(1,1) PRIMARY KEY,
    name varchar(50),
    surname varchar(50),
    addressID int FOREIGN KEY REFERENCES Address(addressID)
);

CREATE TABLE Users (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Username NVARCHAR(50) NOT NULL UNIQUE,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    Password NVARCHAR(255) NOT NULL,
    CreatedAt DATETIME DEFAULT GETDATE(),
    UpdatedAt DATETIME DEFAULT GETDATE()
);

INSERT INTO Address (street, city, zipCode, country, randomNumber) VALUES
('Strada libertatii 6', 'Bucuresti', '666666', 'Romania', 2),
('Strada Teodor Mihali 6', 'Cluj-Napoca', '192593', 'Romania', 3.5),
('Strada Universitatii 3', 'Timisoara', '235939', 'Romania', 10),
('Strada Revolutiei 10', 'Iasi', '215434', 'Romania', 3.343),
('Strada Lunii 55', 'Constanta', '553454', 'Romania', 0.657);

INSERT INTO Person (name, surname, addressID) VALUES
('Ion', 'Popescu', 1),
('Maria', 'Ionescu', 2),
('Mihai', 'Popa', 3),
('Ana', 'Dumitrescu', 4),
('Dan', 'Radu', 5),
('Elena', 'Constantinescu', 1),
('Cristian', 'Vasile', 2),
('Adriana', 'Stanciu', 3),
('Alexandru', 'Neagu', 4),
('Laura', 'Stan', 5),
('Andrei', 'Georgescu', 1),
('Ioana', 'Moldovan', 2),
('Gabriel', 'Dragomir', 3),
('Mihaela', 'Gheorghe', 4),
('Cătălin', 'Marin', 5);

INSERT INTO Users (Username,Email,Password) VALUES
('dragos','talaba.dragos@gmail.com','dragos')

drop table Address
drop table Person
drop table Users

select * from Address
select * from Person
select * from Users

DELETE FROM Person;
DELETE FROM Address