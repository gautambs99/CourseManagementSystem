-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: localhost    Database: collegedb
-- ------------------------------------------------------
-- Server version	8.3.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `course`
--

DROP TABLE IF EXISTS `course`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `course` (
  `course_id` varchar(10) NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `department_id` int DEFAULT NULL,
  `faculty_id` int DEFAULT NULL,
  `prerequisite_id` varchar(10) DEFAULT NULL,
  PRIMARY KEY (`course_id`),
  KEY `department_id` (`department_id`),
  KEY `faculty_id` (`faculty_id`),
  KEY `prerequisite_id` (`prerequisite_id`),
  CONSTRAINT `course_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`department_id`),
  CONSTRAINT `course_ibfk_2` FOREIGN KEY (`faculty_id`) REFERENCES `faculty` (`user_id`),
  CONSTRAINT `course_ibfk_3` FOREIGN KEY (`prerequisite_id`) REFERENCES `course` (`course_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `course`
--

LOCK TABLES `course` WRITE;
/*!40000 ALTER TABLE `course` DISABLE KEYS */;
INSERT INTO `course` VALUES ('BIO101','Introduction to Biology',4,11,NULL),('BIO201','Genetics',4,11,'BIO101'),('BIO202','Molecular Biology',4,11,'BIO201'),('CHEM101','General Chemistry',5,14,NULL),('CHEM201','Organic Chemistry',5,14,'CHEM101'),('CS101','Introduction to Computer Science',1,2,NULL),('CS102','Data Structures',1,2,'CS101'),('CS201','Algorithms',1,2,'CS102'),('CS202','Operating Systems',1,2,'CS102'),('CS203','Database Systems',1,2,'CS102'),('CS301','Artificial Intelligence',1,2,'CS201'),('CS302','Machine Learning',1,2,'CS301'),('MATH101','Calculus I',2,5,NULL),('MATH102','Linear Algebra',2,5,'MATH101'),('MATH201','Probability and Statistics',2,5,'MATH102'),('MATH202','Discrete Mathematics',2,5,'MATH101'),('PHYS101','General Physics',3,8,NULL),('PHYS201','Electromagnetism',3,8,'PHYS101'),('PHYS202','Quantum Mechanics',3,8,'PHYS201'),('PHYS301','Statistical Physics',3,8,'PHYS202');
/*!40000 ALTER TABLE `course` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-03-05 15:23:09
