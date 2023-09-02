-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: point_work
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `tbavisos`
--

DROP TABLE IF EXISTS `tbavisos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbavisos` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idFuncionario` int DEFAULT NULL,
  `titulo` varchar(45) DEFAULT NULL,
  `conteudo` varchar(255) DEFAULT NULL,
  `data` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_Avisos_idx` (`idFuncionario`),
  CONSTRAINT `fk_idFuncionario_Avisos` FOREIGN KEY (`idFuncionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbavisos`
--

LOCK TABLES `tbavisos` WRITE;
/*!40000 ALTER TABLE `tbavisos` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbavisos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbcargo`
--

DROP TABLE IF EXISTS `tbcargo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbcargo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `cargo` varchar(45) NOT NULL,
  `salario_base` float DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbcargo`
--

LOCK TABLES `tbcargo` WRITE;
/*!40000 ALTER TABLE `tbcargo` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbcargo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbferias`
--

DROP TABLE IF EXISTS `tbferias`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbferias` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idFuncionario` int DEFAULT NULL,
  `dataInicio` date DEFAULT NULL,
  `dataVencimento` date DEFAULT NULL,
  `dataSolicitada` date DEFAULT NULL,
  `dataAutorizacao` date DEFAULT NULL,
  `statusAutorizacao` date DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_Ferias_idx` (`idFuncionario`),
  CONSTRAINT `fk_idFuncionario_Ferias` FOREIGN KEY (`idFuncionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbferias`
--

LOCK TABLES `tbferias` WRITE;
/*!40000 ALTER TABLE `tbferias` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbferias` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbfuncionario`
--

DROP TABLE IF EXISTS `tbfuncionario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbfuncionario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(45) NOT NULL,
  `email` varchar(45) NOT NULL,
  `senha` varchar(200) NOT NULL,
  `cpf` varchar(11) NOT NULL,
  `id_cargo` int DEFAULT NULL,
  `carga_horaria` varchar(45) DEFAULT NULL,
  `data_admissao` varchar(45) DEFAULT NULL,
  `data_demissao` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_cargo` (`id_cargo`),
  CONSTRAINT `fk_cargo` FOREIGN KEY (`id_cargo`) REFERENCES `tbcargo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbfuncionario`
--

LOCK TABLES `tbfuncionario` WRITE;
/*!40000 ALTER TABLE `tbfuncionario` DISABLE KEYS */;
INSERT INTO `tbfuncionario` VALUES (11,'Matheus','matheus@gmail.com','$2b$10$98WFev/iakr5KYkYT2SBhu4NOEGp1pb9ecxIe9f2v6sGgH2GncshK','12345678912',NULL,NULL,NULL,NULL);
/*!40000 ALTER TABLE `tbfuncionario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbholerite`
--

DROP TABLE IF EXISTS `tbholerite`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbholerite` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idFuncionario` int DEFAULT NULL,
  `dataEmissao` date DEFAULT NULL,
  `valor` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_holerite_idx` (`idFuncionario`),
  CONSTRAINT `fk_idFuncionario_holerite` FOREIGN KEY (`idFuncionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbholerite`
--

LOCK TABLES `tbholerite` WRITE;
/*!40000 ALTER TABLE `tbholerite` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbholerite` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbhorasextras`
--

DROP TABLE IF EXISTS `tbhorasextras`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbhorasextras` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idFuncionario` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `quantidadeHorasExtras` float DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_idx` (`idFuncionario`),
  CONSTRAINT `fk_idFuncionario_horasExtras` FOREIGN KEY (`idFuncionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbhorasextras`
--

LOCK TABLES `tbhorasextras` WRITE;
/*!40000 ALTER TABLE `tbhorasextras` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbhorasextras` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbjustificativasfaltas`
--

DROP TABLE IF EXISTS `tbjustificativasfaltas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbjustificativasfaltas` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idFuncionario` int DEFAULT NULL,
  `data` date DEFAULT NULL,
  `motivo` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_justifcativasFaltas_idx` (`idFuncionario`),
  CONSTRAINT `fk_idFuncionario_justifcativasFaltas` FOREIGN KEY (`idFuncionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbjustificativasfaltas`
--

LOCK TABLES `tbjustificativasfaltas` WRITE;
/*!40000 ALTER TABLE `tbjustificativasfaltas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tbjustificativasfaltas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tbregistroponto`
--

DROP TABLE IF EXISTS `tbregistroponto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tbregistroponto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_funcionario` int NOT NULL,
  `hora_entrada` datetime DEFAULT NULL,
  `hora_saida` datetime DEFAULT NULL,
  `hora_saida_intervalo` datetime DEFAULT NULL,
  `hora_entrada_intervalo` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `fk_idFuncionario_idx` (`id_funcionario`),
  CONSTRAINT `fk_idFuncionario` FOREIGN KEY (`id_funcionario`) REFERENCES `tbfuncionario` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tbregistroponto`
--

LOCK TABLES `tbregistroponto` WRITE;
/*!40000 ALTER TABLE `tbregistroponto` DISABLE KEYS */;
INSERT INTO `tbregistroponto` VALUES (6,11,'2023-09-02 18:31:09','2023-09-02 18:31:13','2023-09-02 18:31:11','2023-09-02 18:31:12');
/*!40000 ALTER TABLE `tbregistroponto` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-02 19:19:14
