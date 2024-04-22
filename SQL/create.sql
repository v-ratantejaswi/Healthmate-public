INSERT INTO `ept_prj`.`employee_data`
(`Name`,
`Email`,
`location`,
`rating_2023`,
`rating_2022`,
`rating_2021`,
`Salary_2023`,
`Salary_2022`,
`Salary_2021`,
`Comments`)
VALUES
('sdgfyhu','jgugu@gmail.com','Indy','10','8','9','89898000','100000','950000','bjguh' );


CREATE TABLE `employee_data` (
  `EID` INT(100) AUTO_INCREMENT PRIMARY KEY NOT NULL UNIQUE,
  `Name` varchar(45) NOT NULL,
  `Email` varchar(45) NOT NULL,
  `location` varchar(45) NOT NULL,
  `rating_2023` float(20) NOT NULL,
  `rating_2022` float(20) NOT NULL,
  `rating_2021` float(20) NOT NULL,
  `Salary_2023` float(45) NOT NULL,
  `Salary_2022` float(45) NOT NULL,
  `Salary_2021` float(45) NOT NULL,
  `Comments` varchar(200) NOT NULL
);

ALTER TABLE `employee_data` AUTO_INCREMENT = 560500;


