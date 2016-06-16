DROP TABLE IF EXISTS lists;
DROP TABLE IF EXISTS subscribers;

CREATE TABLE lists(
    name    VARCHAR(50) NOT NULL,
    PRIMARY KEY(name)
)ENGINE=InnoDB;

CREATE TABLE subscribers(
    list    VARCHAR(50) NOT NULL,
    address VARCHAR(100) NOT NULL,
    PRIMARY KEY(address, list)
)ENGINE=InnoDB;

ALTER TABLE subscribers ADD CONSTRAINT FK_list FOREIGN KEY (list) REFERENCES lists(name) ON DELETE CASCADE ON UPDATE CASCADE;