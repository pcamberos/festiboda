-- MySQL dump 10.13  Distrib 5.7.27, for Linux (x86_64)
--
-- Host: localhost    Database: bd_festiboda
-- ------------------------------------------------------
-- Server version	5.7.27-0ubuntu0.18.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `line_items`
--

USE bd_festiboda;

DROP TABLE IF EXISTS `line_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `line_items` (
  `id` varchar(30) NOT NULL ,
  `order_id` varchar(30) DEFAULT NULL,
  `product_keyword` varchar(30) NOT NULL,
  `product_unitprice` decimal(13,2) NOT NULL,
  `product_quantity` int(6) unsigned DEFAULT NULL,
  `product_total` decimal(13,2) NOT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`id`),
  KEY `line_items_ibfk_1` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `line_items`
--

LOCK TABLES `line_items` WRITE;
/*!40000 ALTER TABLE `line_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `line_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orden_compra`
--

DROP TABLE IF EXISTS `orden_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `orden_compra` (
  `id` varchar(30) NOT NULL ,
  `folio` varchar(30) NOT NULL,
  `nombre_cliente` varchar(30) NOT NULL,
  `fecha_evento` date NOT NULL,
  `envio_selected` varchar(30) NOT NULL,
  `price_envio_selected` decimal(13,2) NOT NULL,
  `total` decimal(13,2) NOT NULL,
  `num_pagos` int(2) unsigned DEFAULT NULL,
  `order_status` varchar(30) NOT NULL,
  `envio_calle` varchar(30) NOT NULL,
  `envio_numext` varchar(30) NOT NULL,
  `envio_numint` varchar(30) NOT NULL,
  `envio_cp` varchar(30) NOT NULL,
  `envio_tel` varchar(30) NOT NULL,
  `envio_cel` varchar(30) NOT NULL,
  `envio_referencia` varchar(30) NOT NULL,
  `envio_municipio` varchar(30) NOT NULL,
  `envio_estado` varchar(30) NOT NULL,
  `envio_pais` varchar(30) NOT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orden_compra`
--

LOCK TABLES `orden_compra` WRITE;
/*!40000 ALTER TABLE `orden_compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `orden_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` varchar(30)  NOT NULL ,
  `name` varchar(30) NOT NULL,
  `unit_price` decimal(13,2) NOT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (UUID(),'SANDALIAS',17.00,'2019-08-20'),(UUID(),'MANDILES',9.00,'2019-08-20'),(UUID(),'VELITOS',9.00,'2019-08-20'),(UUID(),'LETREROS',250.00,'2019-08-23');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_envio`
--

DROP TABLE IF EXISTS `tipos_envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipos_envio` (
  `id` varchar(30) NOT NULL ,
  `keyword` varchar(30) NOT NULL,
  `name` varchar(30) NOT NULL,
  `dias_habiles` int(11) NOT NULL,
  `price` decimal(13,2) NOT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_envio`
--

LOCK TABLES `tipos_envio` WRITE;
/*!40000 ALTER TABLE `tipos_envio` DISABLE KEYS */;
INSERT INTO `tipos_envio` VALUES (UUID(),'normal','ENVIO NORMAL',30,290.00,'2019-08-22'),(UUID(),'express','ENVIO EXPRESS',15,1900.00,'2019-08-22'),(UUID(),'internacional','ENVIO INTERNACIONAL',50,5000.00,'2019-08-22');
/*!40000 ALTER TABLE `tipos_envio` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2019-09-03 17:27:08
