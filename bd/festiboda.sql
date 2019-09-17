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

DROP TABLE IF EXISTS `line_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `line_items` (
  `id` varchar(30) NOT NULL,
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
  `id` varchar(100) NOT NULL,
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
INSERT INTO `orden_compra` VALUES ('134ac216-d4a5-11e9-8572-54bf6405baeb','V0000013','Pablo Camberos','2019-12-10','express',1900.00,2300.00,1,'Paid','','','','','','','','','','','2019-09-11'),('1df96a83-d4a2-11e9-8572-54bf6405baeb','V0000002','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('2448fb3b-d4bc-11e9-8572-54bf6405baeb','V0000048','Pablo Camberos','2019-12-10','normal',120.00,1320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('267f28d1-d4b8-11e9-8572-54bf6405baeb','V0000032','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('26ce781a-d4bb-11e9-8572-54bf6405baeb','V0000041','Pablo Camberos','2019-12-10','normal',120.00,720.00,1,'Paid','','','','','','','','','','','2019-09-11'),('2c70e0f5-d4b9-11e9-8572-54bf6405baeb','V0000037','Pablo Camberos','2019-12-10','normal',120.00,720.00,1,'Paid','','','','','','','','','','','2019-09-11'),('320edd25-d4be-11e9-8572-54bf6405baeb','V0000051','Pablo Camberos','2019-12-10','normal',120.00,520.00,3,'Paid','','','','','','','','','','','2019-09-11'),('39b7ca3f-d4a3-11e9-8572-54bf6405baeb','V0000007','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('39bd4e8b-d4a3-11e9-8572-54bf6405baeb','V0000007','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('42556b87-d4b3-11e9-8572-54bf6405baeb','V0000025','Pablo Camberos','2019-12-10','normal',120.00,320.00,12,'Paid','','','','','','','','','','','2019-09-11'),('45b86a63-d4ac-11e9-8572-54bf6405baeb','V0000014','Pablo Camberos','2019-12-10','express',1900.00,2100.00,1,'Paid','','','','','','','','','','','2019-09-11'),('4e856d60-d4a2-11e9-8572-54bf6405baeb','V0000003','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('4ed4aa8e-d4a2-11e9-8572-54bf6405baeb','V0000003','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('4f4a09bb-d4a2-11e9-8572-54bf6405baeb','V0000005','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('4f4aab92-d4a2-11e9-8572-54bf6405baeb','V0000005','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('5021322b-d4a3-11e9-8572-54bf6405baeb','V0000009','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('502733ad-d4a3-11e9-8572-54bf6405baeb','V0000009','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('53b6a6bb-d4a3-11e9-8572-54bf6405baeb','V0000011','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('53c181fb-d4a3-11e9-8572-54bf6405baeb','V0000011','Pablo Camberos','2019-12-10','normal',120.00,320.00,3,'Paid','','','','','','','','','','','2019-09-11'),('5426352a-d4b9-11e9-8572-54bf6405baeb','V0000038','Pablo Camberos','2019-12-10','normal',120.00,1320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('546bbb41-d4be-11e9-8572-54bf6405baeb','V0000052','Pablo Camberos','2019-12-10','normal',290.00,317.00,1,'Paid','','','','','','','','','','','2019-09-11'),('57bb833a-d4bb-11e9-8572-54bf6405baeb','V0000042','Pablo Camberos','2019-12-18','normal',120.00,720.00,1,'Paid','','','','','','','','','','','2019-09-11'),('5a9f12e7-d4a1-11e9-8572-54bf6405baeb','V0000001','Pablo Camberos','2019-12-10','normal',120.00,2120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('5b671eb6-d4b7-11e9-8572-54bf6405baeb','V0000030','Pablo Camberos','2019-12-10','express',1900.00,2500.00,1,'Paid','','','','','','','','','','','2019-09-11'),('5bacbf88-d4bc-11e9-8572-54bf6405baeb','V0000049','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('617f5f20-d4b3-11e9-8572-54bf6405baeb','V0000026','Pablo Camberos','2019-12-10','express',1900.00,2100.00,1,'Paid','','','','','','','','','','','2019-09-11'),('623bba46-d4c4-11e9-8572-54bf6405baeb','V0000054','Pablo Camberos','2019-10-23','express',1900.00,2337.00,1,'Paid','','','','','','','','','','','2019-09-11'),('6324c4e9-d4b1-11e9-8572-54bf6405baeb','V0000018','Pablo Camberos','2019-12-10','normal',120.00,520.00,1,'Paid','','','','','','','','','','','2019-09-11'),('64fa996c-d4db-11e9-8572-54bf6405baeb','V0000055','Pablo Camberos','2019-11-08','express',1900.00,2035.00,1,'Paid','','','','','','','','','','','2019-09-11'),('664e50f2-d4be-11e9-8572-54bf6405baeb','V0000053','Pablo Camberos','2019-12-10','normal',290.00,317.00,1,'Paid','','','','','','','','','','','2019-09-11'),('69a3b9fd-d4bc-11e9-8572-54bf6405baeb','V0000050','Pablo Camberos','2019-12-10','express',1900.00,2900.00,1,'Paid','','','','','','','','','','','2019-09-11'),('6bd2f246-d4b8-11e9-8572-54bf6405baeb','V0000033','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('74269867-d4ba-11e9-8572-54bf6405baeb','V0000040','Pablo Camberos','2019-12-10','normal',120.00,920.00,1,'Paid','','','','','','','','','','','2019-09-11'),('79476e0f-d4b9-11e9-8572-54bf6405baeb','V0000039','Pablo Camberos','2019-12-10','express',1900.00,2700.00,1,'Paid','','','','','','','','','','','2019-09-11'),('83b57dcc-d4b1-11e9-8572-54bf6405baeb','V0000019','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('84130162-d4b3-11e9-8572-54bf6405baeb','V0000027','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('8d895c42-d4bb-11e9-8572-54bf6405baeb','V0000043','Pablo Camberos','2019-12-10','normal',120.00,1320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('9e055875-d4b5-11e9-8572-54bf6405baeb','V0000029','Pablo Camberos','2019-12-10','normal',120.00,520.00,1,'Paid','','','','','','','','','','','2019-09-11'),('a1df7acc-d4bb-11e9-8572-54bf6405baeb','V0000044','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('a2d8c022-d4b8-11e9-8572-54bf6405baeb','V0000034','Pablo Camberos','2019-12-10','express',1900.00,3300.00,1,'Paid','','','','','','','','','','','2019-09-11'),('b0073d7b-d4bb-11e9-8572-54bf6405baeb','V0000045','Pablo Camberos','2019-12-10','normal',120.00,1320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('b177e9e2-d4ac-11e9-8572-54bf6405baeb','V0000015','Pablo Camberos','2019-12-10','normal',120.00,320.00,9,'Paid','','','','','','','','','','','2019-09-11'),('bd3ae0ad-d4b2-11e9-8572-54bf6405baeb','V0000022','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('c131ac32-d4b7-11e9-8572-54bf6405baeb','V0000031','Pablo Camberos','2019-12-10','normal',120.00,920.00,1,'Paid','','','','','','','','','','','2019-09-11'),('cf1bd383-d4b3-11e9-8572-54bf6405baeb','V0000028','Pablo Camberos','2019-12-10','normal',120.00,920.00,1,'Paid','','','','','','','','','','','2019-09-11'),('d264423c-d4b8-11e9-8572-54bf6405baeb','V0000035','Pablo Camberos','2019-12-10','normal',120.00,720.00,1,'Paid','','','','','','','','','','','2019-09-11'),('d842b12e-d4bb-11e9-8572-54bf6405baeb','V0000046','Pablo Camberos','2019-12-10','express',1900.00,2900.00,1,'Paid','','','','','','','','','','','2019-09-11'),('e866acd0-d4bb-11e9-8572-54bf6405baeb','V0000047','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('ec16d842-d4b2-11e9-8572-54bf6405baeb','V0000023','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('ec622ab2-d4b1-11e9-8572-54bf6405baeb','V0000020','Pablo Camberos','2019-12-10','normal',120.00,520.00,1,'Paid','','','','','','','','','','','2019-09-11'),('f0baa249-d4b8-11e9-8572-54bf6405baeb','V0000036','Pablo Camberos','2019-12-10','normal',120.00,1120.00,1,'Paid','','','','','','','','','','','2019-09-11'),('f7818f4e-d4ad-11e9-8572-54bf6405baeb','V0000017','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('f7c22a64-d4b2-11e9-8572-54bf6405baeb','V0000024','Pablo Camberos','2019-12-10','normal',120.00,520.00,1,'Paid','','','','','','','','','','','2019-09-11'),('fa804b0c-d4b1-11e9-8572-54bf6405baeb','V0000021','Pablo Camberos','2019-12-10','normal',120.00,320.00,1,'Paid','','','','','','','','','','','2019-09-11'),('faeb6a30-d4ac-11e9-8572-54bf6405baeb','V0000016','Pablo Camberos','2019-12-10','express',1900.00,2300.00,1,'Paid','','','','','','','','','','','2019-09-11');
/*!40000 ALTER TABLE `orden_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `unit_price` decimal(13,2) NOT NULL,
  `date_created` date NOT NULL,
  `minimo` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('00b1c84c-d4bd-11e9-8572-54bf6405baeb','SANDALIAS',17.00,'2019-09-11','25'),('047f14af-d4bd-11e9-8572-54bf6405baeb','VELITOS',9.00,'2019-09-11','0'),('093083d9-d4bd-11e9-8572-54bf6405baeb','LETREROS',250.00,'2019-09-11','0'),('4a4945f8-d34c-11e9-96de-54bf6405baeb','MANDILES',9.00,'2019-09-09','0');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tipos_envio`
--

DROP TABLE IF EXISTS `tipos_envio`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `tipos_envio` (
  `id` varchar(100) NOT NULL,
  `keyword` varchar(100) NOT NULL,
  `name` varchar(30) NOT NULL,
  `dias_habiles` int(11) NOT NULL,
  `price` decimal(13,2) NOT NULL,
  `date_created` date NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tipos_envio`
--

LOCK TABLES `tipos_envio` WRITE;
/*!40000 ALTER TABLE `tipos_envio` DISABLE KEYS */;
INSERT INTO `tipos_envio` VALUES ('1cc87227-d005-11e9-8a9d-54bf64','normal','ENVIO NORMAL1',10,290.00,'2019-08-22'),('1cc8757f-d005-11e9-8a9d-54bf64','express','ENVIO EXPRESS',15,1900.00,'2019-08-22'),('1cc87712-d005-11e9-8a9d-54bf64','internacional','ENVIO INTERNACIONAL1',50,5000.00,'2019-08-22'),('447e3164-d4c3-11e9-8572-54bf6405baeb','super','SUPER EXPRESS',5,4500.00,'2019-09-11');
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

-- Dump completed on 2019-09-17 12:42:48
