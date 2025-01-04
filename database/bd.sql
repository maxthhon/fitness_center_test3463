-- MySQL Script for creating fitness_center database
SET @OLD_UNIQUE_CHECKS = @@ UNIQUE_CHECKS, UNIQUE_CHECKS = 0;

SET @OLD_FOREIGN_KEY_CHECKS = @@ FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS = 0;

SET @OLD_SQL_MODE = @@ SQL_MODE, SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

CREATE SCHEMA IF NOT EXISTS `fitness_center` DEFAULT CHARACTER
SET utf8;

USE `fitness_center`;

CREATE TABLE IF NOT EXISTS `client`(
    `id` int NOT NULL AUTO_INCREMENT,
    `firstName` varchar(15) NOT NULL,
    `lastName` varchar(15) NOT NULL,
    `phone` varchar(15) NOT NULL,
    `email` varchar(20) NOT NULL,
    `password` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `trainer`(
    `id` int NOT NULL AUTO_INCREMENT,
    `firstName` varchar(15) NOT NULL,
    `lastName` varchar(15) NOT NULL,
    `phone` varchar(15) NOT NULL,
    `speciality` varchar(25) NOT NULL,
    PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `hall`(
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(25) NOT NULL,
    `capacity` int NOT NULL,
    PRIMARY KEY (`id`)) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `class`(
    `id` int NOT NULL AUTO_INCREMENT,
    `name` varchar(45) NOT NULL,
    `duration` DECIMAL(1, 2) NOT NULL,
    `beginAt` DATETIME NOT NULL,
    `price` int NOT NULL,
    `hall_id` int NOT NULL,
    `trainer_id` int NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`hall_id`) REFERENCES `hall`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`trainer_id`) REFERENCES `trainer`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `sign_for_class`(
    `id` int NOT NULL AUTO_INCREMENT,
    `client_id` int NOT NULL,
    `class_id` int NOT NULL,
    `date` DATETIME NOT NULL,
    PRIMARY KEY (`id`),
    FOREIGN KEY (`client_id`) REFERENCES `client`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
    FOREIGN KEY (`class_id`) REFERENCES `class`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION) ENGINE = InnoDB;

SET SQL_MODE = @OLD_SQL_MODE;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;

SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;

