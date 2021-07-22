-- phpMyAdmin SQL Dump
-- version 5.0.4
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Jul 22, 2021 at 02:49 PM
-- Server version: 5.5.64-MariaDB-1~trusty
-- PHP Version: 7.4.15

SET FOREIGN_KEY_CHECKS=0;
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `mamumi`
--
CREATE DATABASE IF NOT EXISTS `mamumi` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `mamumi`;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_journeys`
--

DROP TABLE IF EXISTS `tbl_journeys`;
CREATE TABLE `tbl_journeys` (
  `id_journeys` int(11) NOT NULL,
  `forename` varchar(65) NOT NULL,
  `surname` varchar(65) NOT NULL,
  `video_link` varchar(2048) NOT NULL,
  `desc_en` varchar(1800) NOT NULL,
  `desc_es` varchar(1800) NOT NULL,
  `desc_bg` varchar(1800) NOT NULL,
  `desc_el` varchar(1800) NOT NULL,
  `desc_no` varchar(1800) NOT NULL,
  `desc_it` varchar(1800) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `tbl_points`
--

DROP TABLE IF EXISTS `tbl_points`;
CREATE TABLE `tbl_points` (
  `id_points` int(11) NOT NULL,
  `id_journeys` int(11) NOT NULL,
  `point_num` int(11) NOT NULL,
  `loc` point NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `tbl_journeys`
--
ALTER TABLE `tbl_journeys`
  ADD PRIMARY KEY (`id_journeys`);

--
-- Indexes for table `tbl_points`
--
ALTER TABLE `tbl_points`
  ADD PRIMARY KEY (`id_points`),
  ADD UNIQUE KEY `points_point_num` (`point_num`,`id_journeys`),
  ADD KEY `fk_id_journeys_idx` (`id_journeys`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `tbl_journeys`
--
ALTER TABLE `tbl_journeys`
  MODIFY `id_journeys` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tbl_points`
--
ALTER TABLE `tbl_points`
  MODIFY `id_points` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tbl_points`
--
ALTER TABLE `tbl_points`
  ADD CONSTRAINT `fk_id_journeys` FOREIGN KEY (`id_journeys`) REFERENCES `tbl_journeys` (`id_journeys`) ON DELETE CASCADE ON UPDATE CASCADE;
SET FOREIGN_KEY_CHECKS=1;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
