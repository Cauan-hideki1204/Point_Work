**Projeto Point Work


-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)

--

-- Host: 127.0.0.1    Database: point_work

---

-- Server version 8.0.33

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

-- Table structure for table `tbcargo`

--

DROPTABLEIFEXISTS `tbcargo`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATETABLE `tbcargo` (

  `id`intNOT NULL AUTO_INCREMENT,

  `cargo`varchar(45) NOT NULL,

  `salario_base`floatDEFAULTNULL,

  PRIMARY KEY (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=2DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--

-- Dumping data for table `tbcargo`

--

LOCK TABLES `tbcargo` WRITE;

/*!40000 ALTER TABLE `tbcargo` DISABLE KEYS */;

/*!40000 ALTER TABLE `tbcargo` ENABLE KEYS */;

UNLOCK TABLES;

--

-- Table structure for table `tbfuncionario`

--

DROPTABLEIFEXISTS `tbfuncionario`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATETABLE `tbfuncionario` (

  `id`intNOT NULL AUTO_INCREMENT,

  `nome`varchar(45) NOT NULL,

  `email`varchar(45) NOT NULL,

  `senha`varchar(200) NOT NULL,

  `cpf`varchar(11) NOT NULL,

  `id_cargo`intDEFAULTNULL,

  `carga_horaria`varchar(45) DEFAULTNULL,

  `data_admissao`varchar(45) DEFAULTNULL,

  `data_demissao`varchar(45) DEFAULTNULL,

  PRIMARY KEY (`id`),

  KEY `fk_cargo` (`id_cargo`),

  CONSTRAINT `fk_cargo`FOREIGN KEY (`id_cargo`) REFERENCES `tbcargo` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=11DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--

-- Dumping data for table `tbfuncionario`

--

LOCK TABLES `tbfuncionario` WRITE;

/*!40000 ALTER TABLE `tbfuncionario` DISABLE KEYS */;

/*!40000 ALTER TABLE `tbfuncionario` ENABLE KEYS */;

UNLOCK TABLES;

--

-- Table structure for table `tbregistroponto`

--

DROPTABLEIFEXISTS `tbregistroponto`;

/*!40101 SET @saved_cs_client     = @@character_set_client */;

/*!50503 SET character_set_client = utf8mb4 */;

CREATETABLE `tbregistroponto` (

  `id`intNOT NULL AUTO_INCREMENT,

  `id_funcionario`intNOT NULL,

  `hora_entrada`datetimeDEFAULTNULL,

  `hora_saida`datetimeDEFAULTNULL,

  `hora_saida_intervalo`datetimeDEFAULTNULL,

  `hora_entrada_intervalo`datetimeDEFAULTNULL,

  PRIMARY KEY (`id`),

  KEY `fk_idFuncionario_idx` (`id_funcionario`),

  CONSTRAINT `fk_idFuncionario`FOREIGN KEY (`id_funcionario`) REFERENCES `tbfuncionario` (`id`)

) ENGINE=InnoDB AUTO_INCREMENT=6DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

--

-- Dumping data for table `tbregistroponto`

--

LOCK TABLES `tbregistroponto` WRITE;

/*!40000 ALTER TABLE `tbregistroponto` DISABLE KEYS */;

/*!40000 ALTER TABLE `tbregistroponto` ENABLE KEYS */;

UNLOCK TABLES;

--

-- Dumping events for database 'point_work'

--

--

-- Dumping routines for database 'point_work'

--

/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;

/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;

/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;

/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;

/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-09-02 18:12:04
