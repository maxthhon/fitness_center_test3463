-- Процедура для добавления нового тренера
DELIMITER //

CREATE PROCEDURE add_trainer(IN firstName VARCHAR(15), IN lastName VARCHAR(15), IN phone VARCHAR(15), IN speciality VARCHAR(25))
BEGIN
    INSERT INTO fitness_center.trainer(firstName, lastName, phone, speciality)
        VALUES(firstName, lastName, phone, speciality);
END //

DELIMITER ;

-- Процедура для удаления тренера
DELIMITER //

CREATE PROCEDURE delete_trainer(IN trainer_id INT)
BEGIN
    DELETE FROM fitness_center.trainer
    WHERE id = trainer_id;
END //

DELIMITER ;

-- Процедура для регистрации клиента на занятие
DELIMITER //

CREATE PROCEDURE register_for_class(IN client_id INT, IN class_id INT, IN registration_date DATETIME)
BEGIN
    INSERT INTO fitness_center.sign_for_class(client_id, class_id, date)
        VALUES(client_id, class_id, registration_date);
END //

DELIMITER ;

-- Процедура для добавления нового клиента
DELIMITER //

CREATE PROCEDURE add_client(IN firstName VARCHAR(15), IN lastName VARCHAR(15), IN phone VARCHAR(15), IN email VARCHAR(20), IN password VARCHAR(255))
BEGIN
    INSERT INTO fitness_center.client(firstName, lastName, phone, email, password)
        VALUES(firstName, lastName, phone, email, password);
END //

DELIMITER ;

-- Процедура для добавления занятия с проверками
DELIMITER //

CREATE PROCEDURE add_class_with_checks(IN p_name VARCHAR(45), IN p_duration DECIMAL(5, 2), IN p_beginAt DATETIME, IN p_price INT, IN p_hall_id INT, IN p_trainer_id INT)
BEGIN
    DECLARE trainer_exists INT;
    DECLARE hall_exists INT;
    DECLARE time_conflict INT;

    -- Проверка существования тренера
    SELECT COUNT(*) INTO trainer_exists
    FROM fitness_center.trainer
    WHERE id = p_trainer_id;

    IF trainer_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Тренер не существует.';
    END IF;

    -- Проверка существования зала
    SELECT COUNT(*) INTO hall_exists
    FROM fitness_center.hall
    WHERE id = p_hall_id;

    IF hall_exists = 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Зал не существует.';
    END IF;

    -- Проверка на пересечение времени
    SELECT COUNT(*) INTO time_conflict
    FROM fitness_center.class
    WHERE hall_id = p_hall_id
    AND ((beginAt < DATE_ADD(p_beginAt, INTERVAL p_duration HOUR)
            AND DATE_ADD(beginAt, INTERVAL duration HOUR) > p_beginAt));

    IF time_conflict > 0 THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Время занятия пересекается с другим занятием в этом зале.';
    END IF;

    -- Если все проверки пройдены, добавляем занятие
    INSERT INTO fitness_center.class(name, duration, beginAt, price, hall_id, trainer_id)
        VALUES (p_name, p_duration, p_beginAt, p_price, p_hall_id, p_trainer_id);
END //

DELIMITER ;

-- Представление для удобного просмотра расписания и тренеров
CREATE OR REPLACE VIEW schedule_view AS
SELECT
    c.id AS class_id,
    c.name AS class_name,
    c.duration,
    c.beginAt,
    c.price,
    t.firstName AS trainer_firstName,
    t.lastName AS trainer_lastName,
    h.name AS hall_name,
    h.capacity
FROM
    fitness_center.class c
    JOIN fitness_center.trainer t ON c.trainer_id = t.id
    JOIN fitness_center.hall h ON c.hall_id = h.id;