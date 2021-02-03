-- MySQL dump 10.13  Distrib 8.0.23, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: mamumi
-- ------------------------------------------------------
-- Server version	5.5.64-MariaDB-1~trusty

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
-- Table structure for table `journeys`
--

DROP TABLE IF EXISTS `journeys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `journeys` (
  `id_journeys` int(11) NOT NULL AUTO_INCREMENT,
  `forename` varchar(65) NOT NULL,
  `surname` varchar(65) NOT NULL,
  PRIMARY KEY (`id_journeys`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_txt_de`
--

DROP TABLE IF EXISTS `point_txt_de`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_txt_de` (
  `id_point_txt_de` int(11) NOT NULL,
  `description` varchar(1200) NOT NULL,
  PRIMARY KEY (`id_point_txt_de`),
  CONSTRAINT `fk_id_points_de` FOREIGN KEY (`id_point_txt_de`) REFERENCES `points` (`id_points`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_txt_en`
--

DROP TABLE IF EXISTS `point_txt_en`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_txt_en` (
  `id_point_txt_en` int(11) NOT NULL,
  `description` varchar(1200) NOT NULL,
  PRIMARY KEY (`id_point_txt_en`),
  CONSTRAINT `fk_id_points_en` FOREIGN KEY (`id_point_txt_en`) REFERENCES `points` (`id_points`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_txt_es`
--

DROP TABLE IF EXISTS `point_txt_es`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_txt_es` (
  `id_point_txt_es` int(11) NOT NULL,
  `description` varchar(1200) NOT NULL,
  PRIMARY KEY (`id_point_txt_es`),
  CONSTRAINT `fk_id_points_es` FOREIGN KEY (`id_point_txt_es`) REFERENCES `points` (`id_points`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `point_txt_fr`
--

DROP TABLE IF EXISTS `point_txt_fr`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `point_txt_fr` (
  `id_point_txt_fr` int(11) NOT NULL,
  `description` varchar(1200) NOT NULL,
  PRIMARY KEY (`id_point_txt_fr`),
  CONSTRAINT `fk_id_points_fr` FOREIGN KEY (`id_point_txt_fr`) REFERENCES `points` (`id_points`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `points`
--

DROP TABLE IF EXISTS `points`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `points` (
  `id_points` int(11) NOT NULL AUTO_INCREMENT,
  `id_journeys` int(11) NOT NULL,
  `point_num` int(11) NOT NULL,
  `loc` point NOT NULL,
  `arrival_date` datetime DEFAULT NULL,
  `departure_date` datetime DEFAULT NULL,
  `video_link` varchar(45) NOT NULL,
  PRIMARY KEY (`id_points`),
  UNIQUE KEY `points_point_num` (`point_num`,`id_journeys`),
  KEY `fk_id_journeys_idx` (`id_journeys`),
  CONSTRAINT `fk_id_journeys` FOREIGN KEY (`id_journeys`) REFERENCES `journeys` (`id_journeys`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'mamumi'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-03 15:43:08
