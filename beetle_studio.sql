-- phpMyAdmin SQL Dump
-- version 5.2.3
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : jeu. 02 juil. 2026 à 05:09
-- Version du serveur : 8.4.7
-- Version de PHP : 8.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `beetle_studio`
--
CREATE DATABASE IF NOT EXISTS `beetle_studio` DEFAULT CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci;
USE `beetle_studio`;

-- --------------------------------------------------------

--
-- Structure de la table `composants`
--

DROP TABLE IF EXISTS `composants`;
CREATE TABLE IF NOT EXISTS `composants` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `icon` text NOT NULL,
  `description` varchar(500) NOT NULL,
  `content` mediumtext NOT NULL,
  `popups` mediumtext NOT NULL,
  `version` varchar(10) NOT NULL,
  `type` enum('public','private') NOT NULL,
  `id_author` int NOT NULL,
  `id_entity` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `creation_date` date NOT NULL,
  `modif_date` date DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `composants`
--

INSERT INTO `composants` (`id`, `name`, `icon`, `description`, `content`, `popups`, `version`, `type`, `id_author`, `id_entity`, `active`, `creation_date`, `modif_date`) VALUES
(3, 'test', '<rect x=\"3\" y=\"3\" width=\"18\" height=\"18\" rx=\"2\"></rect>\r\n<rect x=\"6\" y=\"6\" width=\"5\" height=\"5\" rx=\"1\"></rect>\r\n<rect x=\"13\" y=\"6\" width=\"5\" height=\"5\" rx=\"1\"></rect>\r\n<rect x=\"9\" y=\"13\" width=\"6\" height=\"5\" rx=\"1\"></rect>\r\n<circle cx=\"20\" cy=\"20\" r=\"3\" fill=\"var(--color-component)\" stroke=\"none\"></rect>', 'qsdqsdqsd', '{\"id\":\"Composant-e28e795e-270e-4422-99c9-07028d05112b\",\"type\":\"container\",\"props\":{\"name\":\"test\",\"icon\":\"<rect x=\\\"3\\\" y=\\\"3\\\" width=\\\"18\\\" height=\\\"18\\\" rx=\\\"2\\\"/>\\n<rect x=\\\"6\\\" y=\\\"6\\\" width=\\\"5\\\" height=\\\"5\\\" rx=\\\"1\\\"/>\\n<rect x=\\\"13\\\" y=\\\"6\\\" width=\\\"5\\\" height=\\\"5\\\" rx=\\\"1\\\"/>\\n<rect x=\\\"9\\\" y=\\\"13\\\" width=\\\"6\\\" height=\\\"5\\\" rx=\\\"1\\\"/>\\n<circle cx=\\\"20\\\" cy=\\\"20\\\" r=\\\"3\\\" fill=\\\"var(--color-component)\\\" stroke=\\\"none\\\"/>\",\"description\":\"qsdqsdqsd\",\"author_id\":\"21\",\"type\":\"public\",\"entity\":\"Beetle\",\"entity_id\":1,\"version\":\"1.0\",\"active\":true},\"css\":{},\"events\":{},\"js\":{},\"children\":[{\"id\":\"Block-f6f24b9a-74f6-42f3-bf8c-cde3d3ee700b\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-9b4dd51c-c630-4fa2-9707-b076d88be1c6\",\"type\":\"zone\",\"children\":[{\"id\":\"Text-5d2cbf26-fc24-4863-87ce-b8492b60294e\",\"type\":\"widget\",\"widgetType\":\"Text\",\"name\":\"Texte brut\",\"props\":{\"text\":\"azeazeaze\"},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]}]}]},{\"id\":\"Block-5cc9d7c1-c061-4688-8aaf-419f789ed193\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-ee8aaeb9-8679-4c3b-976b-265f80b50d46\",\"type\":\"zone\",\"children\":[{\"id\":\"Text-ddf2b998-9a84-4230-b041-25494cc9f240\",\"type\":\"widget\",\"widgetType\":\"Text\",\"name\":\"Texte brut\",\"props\":{\"text\":\"sdfsdfsdfsdf\"},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]}]}]}]}', '[{\"id\":\"Popup-5e1da665-04d3-42c3-b0dc-dc89c2e77a73\",\"type\":\"container\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"children\":[{\"id\":\"Block-79148f71-55ae-4d08-8599-e2023af4fd7c\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-b815b6cc-d13d-40a6-bace-17ed41f3f307\",\"type\":\"zone\",\"children\":[{\"id\":\"Text-8ffc4f33-5be5-4d41-b98a-b90b1b2184e3\",\"type\":\"widget\",\"widgetType\":\"Text\",\"name\":\"Texte brut\",\"props\":{\"text\":\"qsdqsdqsdqsd\"},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]}]}]}]},{\"id\":\"Popup-6b23dc9e-cb31-41bb-80ff-a74706f01524\",\"type\":\"container\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"children\":[{\"id\":\"Block-e2125dbf-4ea2-4b31-b545-bc3eaafe2d06\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-bef9de48-847f-4006-b573-f1561a24db2a\",\"type\":\"zone\",\"children\":[{\"id\":\"Text-807439a1-b7f4-4728-935e-4e50ee91848a\",\"type\":\"widget\",\"widgetType\":\"Text\",\"name\":\"Texte brut\",\"props\":{\"text\":\"ertertertert\"},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]}]}]}]}]', '1.0', 'public', 21, 1, 1, '2026-05-06', '2026-06-21');

-- --------------------------------------------------------

--
-- Structure de la table `cssfiles`
--

DROP TABLE IF EXISTS `cssfiles`;
CREATE TABLE IF NOT EXISTS `cssfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_project` int NOT NULL,
  `name` varchar(50) NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

-- --------------------------------------------------------

--
-- Structure de la table `email_tokens`
--

DROP TABLE IF EXISTS `email_tokens`;
CREATE TABLE IF NOT EXISTS `email_tokens` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) DEFAULT NULL,
  `token` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `email_tokens`
--

INSERT INTO `email_tokens` (`id`, `email`, `token`, `created_at`) VALUES
(5, 'frederic.vissault@gmail.com', '8c56900f-a33b-4591-a0a8-5ed01d0ceb24', '2026-04-02 11:54:03'),
(6, 'fv35@yahoo.fr', 'ba0c9535-1b24-4194-87ea-db72e504e7ce', '2026-04-08 07:45:59'),
(7, 'fv35@yahoo.fr', 'b3d799c7-f323-478e-b844-7f6329ece173', '2026-04-08 07:49:00'),
(8, 'fv35@yahoo.fr', '5b4a6cfc-c31f-4c63-805d-4edeee50b12e', '2026-04-08 07:55:37');

-- --------------------------------------------------------

--
-- Structure de la table `entities`
--

DROP TABLE IF EXISTS `entities`;
CREATE TABLE IF NOT EXISTS `entities` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `siret` varchar(50) NOT NULL,
  `contact_email` varchar(50) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `entities`
--

INSERT INTO `entities` (`id`, `name`, `siret`, `contact_email`, `active`) VALUES
(1, 'Beetle', 'xxxxxxxxxxxx', 'frederic.vissault@gmail.com', 1);

-- --------------------------------------------------------

--
-- Structure de la table `jsfiles`
--

DROP TABLE IF EXISTS `jsfiles`;
CREATE TABLE IF NOT EXISTS `jsfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_project` int NOT NULL,
  `content_type` enum('commonjs','pagejs','componentjs','compadmjs') CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL,
  `name` varchar(50) NOT NULL,
  `content` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `jsfiles`
--

INSERT INTO `jsfiles` (`id`, `id_project`, `content_type`, `name`, `content`) VALUES
(1, 1, 'commonjs', 'test', '[{\"id\":\"if-0e9fb848-72a1-41b4-ada4-d6dc89754b18\",\"type\":\"if\",\"props\":{},\"slots\":{\"condition\":[{\"id\":\"sup-101102f2-ddca-4278-8ac9-e752a375df9d\",\"type\":\"sup\",\"props\":{\"op\":\">\",\"parenthesis\":true},\"slots\":{\"left\":[{\"id\":\"literal-585d1a9d-390a-423c-91a6-41195ad26db4\",\"type\":\"literal\",\"props\":{\"value\":\"x\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}],\"right\":[{\"id\":\"literal-fecc333d-0efc-4034-8155-023b5714f816\",\"type\":\"literal\",\"props\":{\"value\":\"20\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}]},\"slotLayout\":\"slot-inline\",\"ui\":{\"collapsed\":true}}],\"then\":[{\"id\":\"log-d002b905-2000-4718-8113-576ce0742395\",\"type\":\"log\",\"props\":{\"message\":\"\\\"ok\\\"\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}]},\"slotLayout\":\"slot-inline\",\"ui\":{\"collapsed\":false}}]'),
(15, 1, 'pagejs', 'azeaze', '[{\"id\":\"if-ba15a396-89de-4fea-abc8-3ac8c02702ea\",\"type\":\"if\",\"props\":{},\"slots\":{\"condition\":[{\"id\":\"sup-f2e79470-7287-469a-a803-1f18663c258c\",\"type\":\"sup\",\"props\":{\"op\":\">\",\"parenthesis\":true},\"slots\":{\"left\":[{\"id\":\"literal-6bba6358-1ac7-4d6b-b4d1-4f03601644bc\",\"type\":\"literal\",\"props\":{\"value\":\"x\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}],\"right\":[{\"id\":\"literal-e6529e07-d33f-47c2-90db-605d1eada712\",\"type\":\"literal\",\"props\":{\"value\":\"10\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}]},\"slotLayout\":\"slot-inline\",\"ui\":{\"collapsed\":true}}],\"then\":[{\"id\":\"log-98fb9b00-1491-4659-98a9-44bfb1882639\",\"type\":\"log\",\"props\":{\"message\":\"\\\"ok\\\"\"},\"slots\":{},\"slotLayout\":\"\",\"ui\":{\"collapsed\":true}}]},\"slotLayout\":\"slot-inline\",\"ui\":{\"collapsed\":false}}]');

-- --------------------------------------------------------

--
-- Structure de la table `projectfiles`
--

DROP TABLE IF EXISTS `projectfiles`;
CREATE TABLE IF NOT EXISTS `projectfiles` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_project` int NOT NULL,
  `pagename` varchar(50) NOT NULL,
  `filecontent` mediumtext NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=49 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `projectfiles`
--

INSERT INTO `projectfiles` (`id`, `id_project`, `pagename`, `filecontent`) VALUES
(48, 1, 'azeaze', '{\"id\":\"Container-706f0b85-41c0-443c-800b-0113f19fadfb\",\"type\":\"container\",\"props\":{\"name\":\"azeaze\",\"title\":\"Ceci est le titre de ma page\"},\"css\":{},\"events\":{},\"js\":{},\"children\":[{\"id\":\"Block-709fe1fb-2078-4a65-8f43-6abeb36f3c6a\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-416778b2-00fb-4252-80f5-f8943fbe23ad\",\"type\":\"zone\",\"children\":[{\"id\":\"Span-da19a511-e55c-4f4b-8378-4208b3e3c1c3\",\"type\":\"widget\",\"widgetType\":\"Span\",\"name\":\"Zone de texte\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]}]}]},{\"id\":\"Image-7e0a9cac-b99f-46cb-b8c8-c03cf1943cbb\",\"type\":\"widget\",\"widgetType\":\"Image\",\"name\":\"Image\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":false,\"children\":[]},{\"id\":\"Block-3fdb1bc7-fc25-4626-ae2c-3e52eab04029\",\"type\":\"widget\",\"widgetType\":\"Block\",\"name\":\"Division\",\"props\":{},\"css\":{},\"events\":{},\"js\":{},\"container\":true,\"children\":[{\"id\":\"zone-72c08cb1-ee24-4cdd-a4df-a9eae76eb06d\",\"type\":\"zone\",\"children\":[]}]}]}');

-- --------------------------------------------------------

--
-- Structure de la table `projects`
--

DROP TABLE IF EXISTS `projects`;
CREATE TABLE IF NOT EXISTS `projects` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `id_entity` int NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `owner` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `projects`
--

INSERT INTO `projects` (`id`, `name`, `description`, `id_entity`, `active`, `owner`) VALUES
(1, 'Test', 'C\'est une description de test', 1, 1, 21);

-- --------------------------------------------------------

--
-- Structure de la table `projects_users`
--

DROP TABLE IF EXISTS `projects_users`;
CREATE TABLE IF NOT EXISTS `projects_users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_user` int NOT NULL,
  `id_project` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `projects_users`
--

INSERT INTO `projects_users` (`id`, `id_user`, `id_project`) VALUES
(1, 21, 1),
(9, 25, 1);

-- --------------------------------------------------------

--
-- Structure de la table `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE IF NOT EXISTS `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `id_entity` int NOT NULL,
  `firstname` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(32) NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=26 DEFAULT CHARSET=utf8mb3;

--
-- Déchargement des données de la table `users`
--

INSERT INTO `users` (`id`, `id_entity`, `firstname`, `lastname`, `email`, `password`, `active`) VALUES
(21, 1, 'Frédéric', 'Vissault', 'frederic.vissault@gmail.com', '60afb8ebfe49a9f1b561340dad8d750e', 1),
(22, 1, 'Brigitte', 'Vissault', 'brigitte.vissault@gmail.com', '60afb8ebfe49a9f1b561340dad8d750e', 1),
(25, 1, 'Fred', 'V', 'fv35@yahoo.fr', '60afb8ebfe49a9f1b561340dad8d750e', 1);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
