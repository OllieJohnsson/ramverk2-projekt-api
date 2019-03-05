DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS depots;
DROP TABLE IF EXISTS objects;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
	`id` INT AUTO_INCREMENT,
	`username` VARCHAR(30) UNIQUE,
	`password` VARCHAR(100),
	`email` VARCHAR(30) UNIQUE,
	`firstName` VARCHAR(30),
	`lastName` VARCHAR(30),

	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS objects (
	`id` INT AUTO_INCREMENT,
	`name` VARCHAR(30) UNIQUE NOT NULL,
	`price` DECIMAL(8, 2) NOT NULL,
	`stock` INT DEFAULT 0,

	PRIMARY KEY(`id`)
);


CREATE TABLE IF NOT EXISTS depots (
	`id` INT AUTO_INCREMENT,
	`userId` INT,
	`balance` DECIMAL(8, 2) DEFAULT 0,

	PRIMARY KEY(`id`),
	FOREIGN KEY(`userId`) REFERENCES `users`(`id`)
);


CREATE TABLE IF NOT EXISTS purchases (
	`id` INT AUTO_INCREMENT,
	`amount` INT,
	`depotId` INT,
	`objectId` INT,

	PRIMARY KEY(`id`),
	FOREIGN KEY(`depotId`) REFERENCES `depots`(`id`),
	FOREIGN KEY(`objectId`) REFERENCES `objects`(`id`)
);









DELIMITER //
DROP PROCEDURE IF EXISTS register//
CREATE PROCEDURE register(
	IN `pUsername` VARCHAR(30),
	IN `pPassword` VARCHAR(100),
	IN `pEmail` VARCHAR(30),
	IN `pFirstName` VARCHAR(30),
	IN `pLastName` VARCHAR(30)
)
BEGIN
INSERT INTO users (`username`, `password`, `email`, `firstName`, `lastName`) VALUES (`pUsername`, `pPassword`, `pEmail`, `pFirstName`, `pLastName`);
INSERT INTO `depots` (`userId`) VALUES (LAST_INSERT_ID());
END//


DROP PROCEDURE IF EXISTS deposit//
CREATE PROCEDURE deposit(IN `pUserId` INT, IN `pAmount` DECIMAL(8, 2))
BEGIN
SET @depotId = (SELECT `id` FROM `depots` WHERE `userId` = `pUserId`);
UPDATE depots SET `balance` = `balance` + `pAmount` WHERE `id` = @depotId;

SELECT u.userName, d.balance, pAmount AS deposit FROM `users` u
JOIN `depots` AS d ON d.userId = u.id
WHERE u.id = `pUserId`;
END//


DROP PROCEDURE IF EXISTS buy//
CREATE PROCEDURE buy(IN `pUserId` INT, IN `pObjectId` INT, IN `pAmount` INT)
BEGIN
SET @depotId = (SELECT `id` FROM `depots` WHERE `userId` = `pUserId`);
INSERT INTO purchases (`depotId`, `objectId`, `amount`) VALUES (@depotId, `pObjectId`, `pAmount`);
UPDATE objects SET `stock` = `stock` - `pAmount` WHERE `id` = `pObjectId`;
UPDATE depots SET `balance` = `balance` - (`pAmount`*(SELECT `price` FROM `objects` WHERE `id` = `pObjectId`)) WHERE `id` = @depotId;
END//

DELIMITER ;



-- CALL register("dolan", "$2b$10$Wt1h3B6ao3nKcXbLKrjUJ.L.qMmMbs6Q9EnNS2qx3F8Z6o7sgCrMa", "kalle@me.com", "Kalle", "Anka");
-- CALL register("bobo", "$2b$10$Wt1h3B6ao3nKcXbLKrjUJ.L.qMmMbs6Q9EnNS2qx3F8Z6o7sgCrMa", "bobo@me.com", "Bobo", "Baba");
-- CALL buy(1, 2, 1);
-- CALL deposit(1, 5000);

-- select * from users;
-- select * from depots;
-- select * FROM objects;
-- select * from purchases;
