DROP TABLE IF EXISTS purchases;
DROP TABLE IF EXISTS depots;
DROP TABLE IF EXISTS priceHistory;
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
	`rate` DECIMAL(4, 3),
	`variance` DECIMAL(2, 1),

	PRIMARY KEY(`id`)
);

CREATE TABLE IF NOT EXISTS priceHistory (
	`objectId` INT NOT NULL,
	`price` DECIMAL(8, 2) NOT NULL,
	`date` DATETIME DEFAULT NOW(),

	PRIMARY KEY(`objectId`, `date`),
	FOREIGN KEY(`objectId`) REFERENCES `objects`(`id`)
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
	`date` DATETIME DEFAULT NOW(),

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
SET @totalValue = (`pAmount`*(SELECT `price` FROM `objects` WHERE `id` = `pObjectId`));
SET @balance = (SELECT `balance` FROM `depots` WHERE `id` = @depotId);
SET @availableObjects = (SELECT `stock` FROM `objects` WHERE `id` = `pObjectId`);

IF @totalValue > @balance THEN
   SELECT "Du har för lite pengar på ditt konto." AS `error`;
ELSEIF `pAmount` > @availableObjects THEN
	SELECT "Det finns inte så många objekt tillgängligt." AS `error`;
ELSE
	INSERT INTO purchases (`depotId`, `objectId`, `amount`) VALUES (@depotId, `pObjectId`, `pAmount`);
	UPDATE objects SET `stock` = `stock` - `pAmount` WHERE `id` = `pObjectId`;
	UPDATE depots SET `balance` = (`balance` - @totalValue) WHERE `id` = @depotId;
	SELECT `name`, @totalValue AS totalValue FROM `objects` WHERE `id` = `pObjectId`;
END IF;
END//

DROP PROCEDURE IF EXISTS depot//
CREATE PROCEDURE depot(`pUserId` INT)
BEGIN
SELECT d.balance, u.username FROM `depots` d
JOIN `users` AS u ON u.id = `pUserId`
WHERE d.`userId` = `pUserId`;
END//

DROP PROCEDURE IF EXISTS boughtObjects//
CREATE PROCEDURE boughtObjects(`pUserId` INT)
BEGIN
SET @depotId = (SELECT id from `depots` WHERE `userId` = `pUserId`);
SELECT p.objectId AS id, SUM(p.amount) AS amount, o.name, SUM(o.price * p.amount) AS value FROM `purchases` p
JOIN `objects` AS o ON o.id = p.objectId
WHERE p.depotId = @depotId
GROUP BY `objectId`
HAVING SUM(p.amount) > 0;
END//


DROP PROCEDURE IF EXISTS sell//
CREATE PROCEDURE sell(IN `pUserId` INT, IN `pObjectId` INT, IN `pAmount` INT)
BEGIN
SET @depotId = (SELECT `id` FROM `depots` WHERE `userId` = `pUserId`);
SET @myAmount = (SELECT SUM(p.amount) FROM `purchases` p WHERE `depotId` = @depotId AND `objectId` = `pObjectId` GROUP BY `objectId`);
SET @totalValue = (`pAmount`*(SELECT `price` FROM `objects` WHERE `id` = `pObjectId`));

IF `pAmount` > @myAmount OR @myAmount IS NULL THEN
   SELECT "Du har inte så många objekt att sälja" AS `error`;
ELSE
	INSERT INTO purchases (`depotId`, `objectId`, `amount`) VALUES (@depotId, `pObjectId`, -`pAmount`);
	UPDATE objects SET `stock` = `stock` + `pAmount` WHERE `id` = `pObjectId`;
	UPDATE depots SET `balance` = (`balance` + @totalValue) WHERE `id` = @depotId;
	SELECT `name`, @totalValue AS totalValue FROM `objects` WHERE `id` = `pObjectId`;
END IF;
END//



DROP PROCEDURE IF EXISTS updatePrice//
CREATE PROCEDURE updatePrice(`pObjectId` INT, `pPrice` DECIMAL(8, 2))
BEGIN
UPDATE objects SET `price` = `pPrice` WHERE `id` = `pObjectId`;
INSERT INTO `priceHistory` (`objectId`, `price`) VALUES (`pObjectId`, `pPrice`);
DELETE FROM `priceHistory` where `date` < DATE_SUB(NOW() , INTERVAL 1 MINUTE);
SELECT * FROM `objects` WHERE `id` = `pObjectId`;
SELECT * FROM `priceHistory` WHERE `objectId` = `pObjectId`;
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
