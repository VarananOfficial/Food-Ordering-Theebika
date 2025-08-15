-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 15, 2025 at 06:18 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `food_ordering`
--

-- --------------------------------------------------------

--
-- Table structure for table `foods`
--

CREATE TABLE `foods` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `description` text NOT NULL,
  `price` double NOT NULL,
  `imageUrl` varchar(191) NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `foods`
--

INSERT INTO `foods` (`id`, `name`, `description`, `price`, `imageUrl`, `createdAt`) VALUES
('cmecx5j9r000114iijx0b3cfo', 'Classic Burger', 'Juicy beef patty with lettuce, tomato, onion, and our special sauce', 12.99, 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.511'),
('cmecx5j9u000214ii9qi3us4s', 'Margherita Pizza', 'Fresh tomatoes, mozzarella cheese, and basil on crispy crust', 15.99, 'https://images.pexels.com/photos/2619967/pexels-photo-2619967.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.515'),
('cmecx5j9w000314ii569qqk65', 'Chicken Caesar Salad', 'Grilled chicken breast on fresh romaine lettuce with Caesar dressing', 10.99, 'https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.517'),
('cmecx5ja1000414iik0xu6mrp', 'Fish & Chips', 'Beer-battered cod with crispy fries and tartar sauce', 14.99, 'https://images.pexels.com/photos/1885057/pexels-photo-1885057.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.521'),
('cmecx5ja3000514iix6233zlz', 'Pasta Carbonara', 'Creamy pasta with bacon, eggs, and parmesan cheese', 13.99, 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.524'),
('cmecx5ja5000614iigkdgifef', 'Chocolate Brownie', 'Rich chocolate brownie served with vanilla ice cream', 6.99, 'https://images.pexels.com/photos/887853/pexels-photo-887853.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.526'),
('cmecx5ja7000714iimmff5yt9', 'Grilled Chicken Sandwich', 'Grilled chicken breast with avocado, lettuce, and chipotle mayo', 11.99, 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.527'),
('cmecx5ja9000814iig067ewn3', 'Vegetable Stir', 'Fresh vegetables stir-fried with garlic and soy sauce, served with rice', 1000, 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=500', '2025-08-15 14:24:02.530'),
('cmed10g350003dskbpmpwgxhu', 'Dai Morin', 'Voluptate qui a fuga', 302, 'https://www.zawom.info', '2025-08-15 16:12:03.569');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` varchar(191) NOT NULL,
  `userId` varchar(191) NOT NULL,
  `totalPrice` double NOT NULL,
  `status` varchar(191) NOT NULL DEFAULT 'Pending',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` varchar(191) NOT NULL,
  `orderId` varchar(191) NOT NULL,
  `foodId` varchar(191) NOT NULL,
  `quantity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` varchar(191) NOT NULL,
  `name` varchar(191) NOT NULL,
  `email` varchar(191) NOT NULL,
  `password` varchar(191) NOT NULL,
  `role` varchar(191) NOT NULL DEFAULT 'customer',
  `createdAt` datetime(3) NOT NULL DEFAULT current_timestamp(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `createdAt`) VALUES
('cmecx5j9k000014ii8hic001o', 'Admin User', 'admin@foodorder.com', '$2y$10$tUV4hE5mzoVrHwSHvuOdlewil3vGhqM2ZRPqGAmtkNTHnhvY9mO2G', 'admin', '2025-08-15 14:24:02.504'),
('cmecz3jey0001dskbtaaj61xg', 'Varanan', 'vaaranan@gmail.com', '$2a$12$EgMFPqPurzQHLBC.P5vGtOvSzC3HLqN5Ij865BBHTPwTdn0tTDvTq', 'customer', '2025-08-15 15:18:28.618'),
('cmed0w3ev0002dskbnqj99itr', 'Theebika', 'theebika@gmail.com', '$2a$12$l76L3HE3NGvOnlyL8rsPluc1PgK0muoMV3PIoQSdLCapTm3GkIFHO', 'customer', '2025-08-15 16:08:40.518');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `foods`
--
ALTER TABLE `foods`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `orders_userId_fkey` (`userId`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_items_orderId_fkey` (`orderId`),
  ADD KEY `order_items_foodId_fkey` (`foodId`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_key` (`email`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `orders_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Constraints for table `order_items`
--
ALTER TABLE `order_items`
  ADD CONSTRAINT `order_items_foodId_fkey` FOREIGN KEY (`foodId`) REFERENCES `foods` (`id`) ON UPDATE CASCADE,
  ADD CONSTRAINT `order_items_orderId_fkey` FOREIGN KEY (`orderId`) REFERENCES `orders` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
