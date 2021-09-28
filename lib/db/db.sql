-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- Host: mariadb
-- Generation Time: Sep 28, 2021 at 12:06 PM
-- Server version: 5.5.64-MariaDB-1~trusty
-- PHP Version: 7.4.21

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

-- --------------------------------------------------------

--
-- Table structure for table `tbl_journeys`
--

DROP TABLE IF EXISTS `tbl_journeys`;
CREATE TABLE `tbl_journeys` (
  `id_journeys` int(11) NOT NULL,
  `name` varchar(65) NOT NULL,
  `subtitle` varchar(65) NOT NULL,
  `audio_uri` varchar(256) NOT NULL,
  `desc_en` text NOT NULL,
  `desc_es` text NOT NULL,
  `desc_bg` text NOT NULL,
  `desc_el` text NOT NULL,
  `desc_no` text NOT NULL,
  `desc_it` text NOT NULL
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

-- --------------------------------------------------------

--
-- Table structure for table `tbl_sessions`
--

DROP TABLE IF EXISTS `tbl_sessions`;
CREATE TABLE `tbl_sessions` (
  `session_key` bigint(32) NOT NULL,
  `last_access` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
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
-- Indexes for table `tbl_sessions`
--
ALTER TABLE `tbl_sessions`
  ADD PRIMARY KEY (`session_key`);

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
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
