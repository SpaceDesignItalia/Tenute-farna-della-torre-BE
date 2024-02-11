-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Feb 11, 2024 alle 15:38
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tenutefarina`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `customer`
--

CREATE TABLE `customer` (
  `idCustomer` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `surname` varchar(250) NOT NULL,
  `mail` varchar(250) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `password` varchar(250) NOT NULL,
  `idStatus` int(11) NOT NULL DEFAULT 1,
  `registrationDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `customer`
--

INSERT INTO `customer` (`idCustomer`, `name`, `surname`, `mail`, `phone`, `password`, `idStatus`, `registrationDate`) VALUES
(1, 'John', 'Doe', 'andrix.braia@gmail.com', '3669826344', '$2b$10$1Inbx7Ha1DKkWkSVq8AZ/.V4orR/hjhAyYTMn7IwOPDVQLD6xKTR2', 1, '2024-02-08');

-- --------------------------------------------------------

--
-- Struttura della tabella `customerdocument`
--

CREATE TABLE `customerdocument` (
  `idDocument` int(11) NOT NULL,
  `idCustomer` int(11) NOT NULL,
  `idDocumentType` int(11) NOT NULL,
  `documentPath` varchar(250) NOT NULL,
  `documentDate` date NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `customerdocument`
--

INSERT INTO `customerdocument` (`idDocument`, `idCustomer`, `idDocumentType`, `documentPath`, `documentDate`) VALUES
(1, 1, 3, 'patente.jpg', '2024-02-11');

-- --------------------------------------------------------

--
-- Struttura della tabella `customerstatus`
--

CREATE TABLE `customerstatus` (
  `idStatus` int(11) NOT NULL,
  `statusName` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `customerstatus`
--

INSERT INTO `customerstatus` (`idStatus`, `statusName`) VALUES
(1, 'In attesa'),
(2, 'Non valido'),
(3, 'Valido');

-- --------------------------------------------------------

--
-- Struttura della tabella `discountcode`
--

CREATE TABLE `discountcode` (
  `idDiscount` int(11) NOT NULL,
  `discountCode` varchar(250) DEFAULT NULL,
  `idDiscountType` int(11) NOT NULL,
  `value` float NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `discountcode`
--

INSERT INTO `discountcode` (`idDiscount`, `discountCode`, `idDiscountType`, `value`, `startDate`, `endDate`) VALUES
(26, 'X4LC7E4JROIS7N17', 2, 25, '2024-02-04', NULL);

-- --------------------------------------------------------

--
-- Struttura della tabella `discounttype`
--

CREATE TABLE `discounttype` (
  `idDiscountType` int(11) NOT NULL,
  `typeName` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `discounttype`
--

INSERT INTO `discounttype` (`idDiscountType`, `typeName`) VALUES
(1, 'Euro'),
(2, 'Percentuale');

-- --------------------------------------------------------

--
-- Struttura della tabella `documenttype`
--

CREATE TABLE `documenttype` (
  `idDocumentType` int(11) NOT NULL,
  `documentType` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `documenttype`
--

INSERT INTO `documenttype` (`idDocumentType`, `documentType`) VALUES
(1, 'Carta di identità'),
(2, 'Passaporto'),
(3, 'Patente di guida');

-- --------------------------------------------------------

--
-- Struttura della tabella `featuredproduct`
--

CREATE TABLE `featuredproduct` (
  `id` int(11) NOT NULL,
  `idProduct` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Struttura della tabella `product`
--

CREATE TABLE `product` (
  `idProduct` int(11) NOT NULL,
  `productName` varchar(250) NOT NULL,
  `productDescription` longtext NOT NULL,
  `productAmount` int(11) NOT NULL,
  `unitPrice` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `product`
--

INSERT INTO `product` (`idProduct`, `productName`, `productDescription`, `productAmount`, `unitPrice`) VALUES
(4, 'Jack Daniels', '<p>Jack Honey</p>', 150, 30);

-- --------------------------------------------------------

--
-- Struttura della tabella `productdiscount`
--

CREATE TABLE `productdiscount` (
  `idProduct` int(11) NOT NULL,
  `idDiscount` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `productdiscount`
--

INSERT INTO `productdiscount` (`idProduct`, `idDiscount`) VALUES
(4, 26);

-- --------------------------------------------------------

--
-- Struttura della tabella `productimage`
--

CREATE TABLE `productimage` (
  `idImage` int(11) NOT NULL,
  `idProduct` int(11) NOT NULL,
  `productImagePath` varchar(250) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `productimage`
--

INSERT INTO `productimage` (`idImage`, `idProduct`, `productImagePath`) VALUES
(5, 4, 'photo1_1707059628444jd2.jpeg'),
(6, 4, 'photo2_1707059628445jd.webp');

-- --------------------------------------------------------

--
-- Struttura della tabella `staffer`
--

CREATE TABLE `staffer` (
  `idStaffer` int(11) NOT NULL,
  `name` varchar(250) NOT NULL,
  `surname` varchar(250) NOT NULL,
  `phone` varchar(10) NOT NULL,
  `mail` varchar(250) NOT NULL,
  `password` varchar(400) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `staffer`
--

INSERT INTO `staffer` (`idStaffer`, `name`, `surname`, `phone`, `mail`, `password`) VALUES
(1, 'Andrea', 'Braia', '3669826344', 'andrix.braia@gmail.com', '$2b$10$1Inbx7Ha1DKkWkSVq8AZ/.V4orR/hjhAyYTMn7IwOPDVQLD6xKTR2'),
(2, 'Test', 'test', '3669826344', 'test@gmail.com', '$2b$10$ZSfjEHQn2Fkbt954sJ17J.1oD3f0B9ZFqHgTOzNXuv6a3MoOzzy8y');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `customer`
--
ALTER TABLE `customer`
  ADD PRIMARY KEY (`idCustomer`);

--
-- Indici per le tabelle `customerdocument`
--
ALTER TABLE `customerdocument`
  ADD PRIMARY KEY (`idDocument`),
  ADD KEY `idDocumentType` (`idDocumentType`),
  ADD KEY `customerdocument_ibfk_1` (`idCustomer`);

--
-- Indici per le tabelle `customerstatus`
--
ALTER TABLE `customerstatus`
  ADD PRIMARY KEY (`idStatus`);

--
-- Indici per le tabelle `discountcode`
--
ALTER TABLE `discountcode`
  ADD PRIMARY KEY (`idDiscount`);

--
-- Indici per le tabelle `discounttype`
--
ALTER TABLE `discounttype`
  ADD PRIMARY KEY (`idDiscountType`);

--
-- Indici per le tabelle `documenttype`
--
ALTER TABLE `documenttype`
  ADD PRIMARY KEY (`idDocumentType`);

--
-- Indici per le tabelle `featuredproduct`
--
ALTER TABLE `featuredproduct`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idProduct` (`idProduct`);

--
-- Indici per le tabelle `product`
--
ALTER TABLE `product`
  ADD PRIMARY KEY (`idProduct`);

--
-- Indici per le tabelle `productdiscount`
--
ALTER TABLE `productdiscount`
  ADD PRIMARY KEY (`idProduct`,`idDiscount`),
  ADD KEY `idDiscount` (`idDiscount`);

--
-- Indici per le tabelle `productimage`
--
ALTER TABLE `productimage`
  ADD PRIMARY KEY (`idImage`),
  ADD KEY `idProduct` (`idProduct`);

--
-- Indici per le tabelle `staffer`
--
ALTER TABLE `staffer`
  ADD PRIMARY KEY (`idStaffer`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `customer`
--
ALTER TABLE `customer`
  MODIFY `idCustomer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT per la tabella `customerdocument`
--
ALTER TABLE `customerdocument`
  MODIFY `idDocument` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `customerstatus`
--
ALTER TABLE `customerstatus`
  MODIFY `idStatus` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `discountcode`
--
ALTER TABLE `discountcode`
  MODIFY `idDiscount` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT per la tabella `discounttype`
--
ALTER TABLE `discounttype`
  MODIFY `idDiscountType` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `documenttype`
--
ALTER TABLE `documenttype`
  MODIFY `idDocumentType` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT per la tabella `featuredproduct`
--
ALTER TABLE `featuredproduct`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT per la tabella `product`
--
ALTER TABLE `product`
  MODIFY `idProduct` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT per la tabella `productimage`
--
ALTER TABLE `productimage`
  MODIFY `idImage` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT per la tabella `staffer`
--
ALTER TABLE `staffer`
  MODIFY `idStaffer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `customerdocument`
--
ALTER TABLE `customerdocument`
  ADD CONSTRAINT `customerdocument_ibfk_1` FOREIGN KEY (`idCustomer`) REFERENCES `customer` (`idCustomer`) ON DELETE CASCADE;

--
-- Limiti per la tabella `featuredproduct`
--
ALTER TABLE `featuredproduct`
  ADD CONSTRAINT `featuredproduct_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON DELETE CASCADE;

--
-- Limiti per la tabella `productdiscount`
--
ALTER TABLE `productdiscount`
  ADD CONSTRAINT `productdiscount_ibfk_1` FOREIGN KEY (`idDiscount`) REFERENCES `discountcode` (`idDiscount`) ON DELETE CASCADE,
  ADD CONSTRAINT `productdiscount_ibfk_2` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON DELETE CASCADE;

--
-- Limiti per la tabella `productimage`
--
ALTER TABLE `productimage`
  ADD CONSTRAINT `productimage_ibfk_1` FOREIGN KEY (`idProduct`) REFERENCES `product` (`idProduct`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
