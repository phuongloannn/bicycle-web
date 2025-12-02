-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 02, 2025 at 12:10 PM
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
-- Database: `sms_api`
--

-- --------------------------------------------------------

--
-- Table structure for table `bank_transfers`
--

CREATE TABLE `bank_transfers` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `bank_name` varchar(100) DEFAULT NULL,
  `account_number` varchar(50) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `transfer_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `transfer_amount` decimal(10,2) DEFAULT NULL,
  `transfer_proof_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `bank_transfers`
--

INSERT INTO `bank_transfers` (`id`, `payment_id`, `bank_name`, `account_number`, `account_name`, `transfer_date`, `transfer_amount`, `transfer_proof_url`, `created_at`, `updated_at`) VALUES
(1, 8, 'TechStore Bank', '1234567890', 'TechStore Bank', '2025-11-29 08:08:48', 6550000.00, NULL, '2025-11-29 08:08:48', '2025-11-29 08:08:48');

-- --------------------------------------------------------

--
-- Table structure for table `bank_transfer_payments`
--

CREATE TABLE `bank_transfer_payments` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `account_number` varchar(255) DEFAULT NULL,
  `transfer_proof_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bank_transfer_payments`
--

INSERT INTO `bank_transfer_payments` (`id`, `payment_id`, `bank_name`, `account_number`, `transfer_proof_url`, `created_at`, `updated_at`) VALUES
(1, 2, 'TechStore Bank', '1234567890', NULL, '2025-11-29 07:31:15', '2025-11-29 07:31:15');

-- --------------------------------------------------------

--
-- Table structure for table `bike_accessories`
--

CREATE TABLE `bike_accessories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `category` varchar(100) DEFAULT NULL,
  `compatible_with` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`compatible_with`)),
  `in_stock` tinyint(1) DEFAULT 1,
  `image_url` varchar(255) DEFAULT NULL,
  `image_filename` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `bike_accessories`
--

INSERT INTO `bike_accessories` (`id`, `name`, `description`, `price`, `category`, `compatible_with`, `in_stock`, `image_url`, `image_filename`, `created_at`, `updated_at`, `category_id`) VALUES
(1, 'Mũ bả hiểm thể thao', 'Mũ bả hiểm nhẹ, thông thoáng cho đạp xe thể thao', 450000.00, 'Dụng cụ', '[1,3,4,6]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763996986824-404096043.jpg', 'accessory-1763996986824-404096043.jpg', '2025-11-16 16:19:33', '2025-12-02 09:41:37', 5),
(2, 'Bộ dụng cụ sửa xe đa năng', 'Bộ dụng cụ 15 trong 1 cho bảo dưỡng xe đạp', 280000.00, 'Dụng cụ', '[1,2,3,4,5,6]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763997031846-710028464.jpg', 'accessory-1763997031846-710028464.jpg', '2025-11-16 16:19:33', '2025-12-02 09:41:37', 5),
(3, 'Bình nước thể thao', 'Bình nước 750ml, chống tràn', 120000.00, 'Phụ kiện', '[1,2,3,4,5,6]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763997006840-548707847.jpg', 'accessory-1763997006840-548707847.jpg', '2025-11-16 16:19:33', '2025-12-02 09:41:37', 6),
(4, 'Đèn xe đạp LED', 'Đèn chiếu sáng phía trước và sau', 350000.00, 'An toàn', '[1,3,4,5,6]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763997081977-733034047.jpg', 'accessory-1763997081977-733034047.jpg', '2025-11-16 16:19:33', '2025-12-02 09:41:37', 7),
(5, 'Cảm Biến Tốc Độ IGPSPORT SPD70', 'THÔNG SỐ KỸ THUẬT CẢM BIẾN TỐC ĐỘ IGPSPORT SPD70:\nBộ cảm biến: Độ nhạy cao\nChống rơi & Chống sốc: 1.5m\nTrọng lượng sản phẩm: 7,8g (có pin)\nKích thước sản phẩm: 36*34*7,7mm\nCấp độ chống nước: IPX7\nTuổi thọ pin: Lên đến 300 giờ\nTruyền dữ liệu: Bluetooth 5.0+ANT+\nThiết bị được hỗ trợ: Android 6.0 trở lên\nĐóng gói: SPD70*1, Vỏ bảo vệ silicon*1, Pin CR2025*1, Hướng dẫn sử dụng*1', 390000.00, 'Bảo hộ', '[1,2,5,6]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763996972995-885588235.jpg', 'accessory-1763996972995-885588235.jpg', '2025-11-24 09:38:13', '2025-12-02 09:41:37', 8),
(6, 'Mắt Kính Đạp Xe Thể Thao ACTIVE XQ36A - Revo Cycling Sunglasses', 'Mắt Kính Đạp Xe Thể Thao ACTIVE XQ36A - Revo Cycling Sunglasses.\nMắt kính đạp xe thể thao ACTIVE XQ36A là lựa chọn lý tưởng cho những ai yêu thích sự thoải mái và bảo vệ mắt tối đa khi tham gia các hoạt động ngoài trời. Với thiết kế năng động và tính năng vượt trội, sản phẩm không chỉ giúp bạn bảo vệ mắt khỏi ánh sáng mặt trời mà còn mang đến trải nghiệm rõ nét, bảo vệ mắt toàn diện trong suốt hành trình đạp xe.\n\n\n\nCông nghệ Revo – Hiệu Suất Tối Ưu\n\nMắt kính ACTIVE XQ36A sử dụng công nghệ Revo tiên tiến, mang đến khả năng chống chói và giảm phản xạ ánh sáng cực kỳ hiệu quả. Các lớp tráng Revo trên bề mặt kính giúp tăng cường độ tương phản và độ sáng, cho phép bạn quan sát rõ ràng hơn ngay cả trong điều kiện ánh sáng...', 990000.00, 'Mắt kính ', '[1,2,3,4,5]', 10, 'http://localhost:3000/uploads/accessories/accessory-1763997019690-292608933.jpg', 'accessory-1763997019690-292608933.jpg', '2025-11-24 12:45:51', '2025-12-02 09:41:37', 9),
(7, 'Còi xe', NULL, 100000.00, 'Dụng cụ', '[2,5]', 9, 'http://localhost:3000/uploads/accessories/accessory-1763993387238-485469290.jpg', NULL, '2025-11-24 14:02:41', '2025-12-02 09:41:37', 5),
(8, 'Chuông xe mini', NULL, 90000.00, 'Dụng cụ', '[1]', 9, 'http://localhost:3000/uploads/accessories/accessory-1764256898898-707747327.jpg', 'accessory-1764256898898-707747327.jpg', '2025-11-24 14:10:37', '2025-12-02 09:41:37', 5),
(9, 'Chắn bùn 2 sọc lưng', NULL, 30000.00, 'Dụng cụ', '[1,3]', 7, 'http://localhost:3000/uploads/accessories/accessory-1764262719153-484996552.jpg', 'accessory-1764262719153-484996552.jpg', '2025-11-27 16:58:50', '2025-12-02 09:41:37', 5);

-- --------------------------------------------------------

--
-- Table structure for table `carts`
--

CREATE TABLE `carts` (
  `id` int(11) NOT NULL,
  `userId` int(11) DEFAULT NULL,
  `sessionId` varchar(255) DEFAULT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL DEFAULT 1,
  `price` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT current_timestamp(),
  `updatedAt` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `carts`
--

INSERT INTO `carts` (`id`, `userId`, `sessionId`, `productId`, `quantity`, `price`, `createdAt`, `updatedAt`) VALUES
(3, NULL, 'test17', 1, 1, 8484.00, '2025-10-31 16:55:44', '2025-10-31 16:55:44');

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `parent_id` int(11) DEFAULT NULL,
  `thumbnail` varchar(512) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `slug`, `parent_id`, `thumbnail`, `is_active`, `created_at`, `updated_at`) VALUES
(1, 'Xe đạp địa hình', 'xe-đạp-địa-hình', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(2, 'Xe đạp trẻ em', 'xe-đạp-trẻ-em', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(3, 'Xe đạp tuaring', 'xe-đạp-tuaring', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(4, 'Xe đạp đua', 'xe-đạp-đua', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(5, 'Dụng cụ', 'dụng-cụ', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(6, 'Phụ kiện', 'phụ-kiện', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(7, 'An toàn', 'an-toàn', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(8, 'Bảo hộ', 'bảo-hộ', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37'),
(9, 'Mắt kính', 'mắt-kính', NULL, NULL, 1, '2025-12-02 16:41:37', '2025-12-02 16:41:37');

-- --------------------------------------------------------

--
-- Table structure for table `cod_payments`
--

CREATE TABLE `cod_payments` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `shipper_id` int(11) DEFAULT NULL,
  `received_amount` decimal(10,2) DEFAULT NULL,
  `received_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `credit_card_payments`
--

CREATE TABLE `credit_card_payments` (
  `id` int(11) NOT NULL,
  `payment_id` int(11) NOT NULL,
  `card_holder_name` varchar(255) DEFAULT NULL,
  `card_number_last4` char(4) DEFAULT NULL,
  `card_type` varchar(50) DEFAULT NULL,
  `transaction_date` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `authorization_code` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `customers`
--

CREATE TABLE `customers` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `is_guest` tinyint(1) DEFAULT 0,
  `temporary_token` varchar(100) DEFAULT NULL,
  `guest_expires_at` datetime DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `customers`
--

INSERT INTO `customers` (`id`, `name`, `email`, `is_guest`, `temporary_token`, `guest_expires_at`, `phone`, `address`, `created_at`, `updated_at`) VALUES
(1, 'Mai Lê Phương Loan', 'admin@gmail.com', 0, NULL, NULL, '0099888877', 'VNUIS VNU', '2025-10-30 01:54:17', '2025-11-28 23:16:47'),
(4, 'Nguyễn Duy Đức', 'ducduy@gmail.com', 0, NULL, NULL, '02929229', 'VNUIS', '2025-10-30 02:03:13', '2025-11-03 19:44:02'),
(5, 'Lê Thị Xuân Hào', 'hao@gmail.com', 0, NULL, NULL, '39393883', 'ha nội', '2025-10-30 02:05:57', '2025-11-28 01:16:30'),
(9, 'Đoàn Thị Hồng Ngọc', 'ngocdoan@gmail.com', 0, NULL, NULL, '92943829', 'VNU IS', '2025-10-30 11:51:21', '2025-10-30 11:51:21'),
(12, 'Nguyễn Thu Hồng', 'hongthu@gmail.com', 0, NULL, NULL, '29488482', '2131231231231', '2025-11-03 19:43:28', '2025-11-29 15:28:41'),
(14, 'lê anh ', 'dungtran@gmail.com', 0, NULL, NULL, '39393883', 'Hồ Chí Minh', '2025-11-06 16:37:21', '2025-11-28 10:18:52'),
(16, 'Trần Hoàng Anh', 'hoanganh@gmail.com', 0, NULL, NULL, '03929292929', 'VNUIS', '2025-11-13 16:38:03', '2025-11-13 16:38:03'),
(17, 'Quang', 'quang@gmail.com', 0, NULL, NULL, '12321312312', 'HCQADADA', '2025-11-13 16:48:06', '2025-11-28 11:13:01'),
(18, 'QHC', 'qhc@gmail.com', 0, NULL, NULL, '123213123123', '12312312', '2025-11-13 16:56:22', '2025-11-13 16:56:22'),
(19, 'QUI', 'qui@gmail.com', 0, NULL, NULL, '02929991', 'Hồ Chí Minh', '2025-11-13 16:58:46', '2025-11-28 01:45:41'),
(20, 'abc', 'lalal@gmail.com', 0, NULL, NULL, '2929229', 'VNUIS', '2025-11-13 21:38:44', '2025-11-13 21:38:44'),
(21, 'Vũ Ngọc Hoa', 'hoa@gmail.com', 0, NULL, NULL, '03033020', 'Nghệ An', '2025-11-13 23:17:21', '2025-11-13 23:17:21'),
(22, 'Nguyễn Mai Chi', 'maichi@gmail.com', 0, NULL, NULL, '0292992', 'Vũng Tàu', '2025-11-13 23:22:46', '2025-11-13 23:22:46'),
(23, 'Hà Hồng ', 'hongha@gmail.com', 0, NULL, NULL, '02929910', 'Nam Định ', '2025-11-13 23:33:34', '2025-11-13 23:33:34'),
(24, 'Phạm Chi Mai', 'chimai@gmail.com', 0, NULL, NULL, '02999101', 'Nam Định', '2025-11-13 23:34:47', '2025-11-13 23:34:47'),
(25, 'Nguyễn Thanh Nhàn', 'thanhnhan@gmail.com', 0, NULL, NULL, '02929292929', 'Phú Thọ ', '2025-11-13 23:38:06', '2025-11-13 23:38:06'),
(26, 'Nguyễn Trà My', 'myiu@gmail.com', 0, NULL, NULL, '0929920202', 'Bắc Ninh', '2025-11-13 23:50:25', '2025-11-13 23:50:25'),
(27, 'Hà Trang', 'trang@gmail.com', 0, NULL, NULL, '029299292', 'Hải Phòng ', '2025-11-13 23:56:13', '2025-11-13 23:56:13'),
(28, 'QUI FF', 'quDi@gmail.com', 0, NULL, NULL, '0987654321', '12345', '2025-11-14 08:37:36', '2025-11-14 08:37:36'),
(29, 'Trần Văn Dũng', 'dungtran@344gmail.com', 0, NULL, NULL, '39393883', 'Hồ Chí Minh', '2025-11-27 15:43:20', '2025-11-27 15:43:20'),
(30, 'Lê Anh ', 'leanh@gmail.com', 0, NULL, NULL, '022299', '2131231231231', '2025-11-28 10:19:33', '2025-11-28 10:19:33'),
(31, 'Mai Lê Phương Loan', 'loaniu@gmail.com', 0, NULL, NULL, '0999009', 'VNU IS', '2025-11-28 10:23:34', '2025-11-29 00:17:27'),
(32, 'Quang', 'quanghc@gmail.com', 0, NULL, NULL, '012345671', 'ABC', '2025-11-28 11:02:07', '2025-11-28 11:02:07'),
(33, 'Hoàng Chi', 'chi@gmail.com', 0, NULL, NULL, '039299292', 'VNU IS', '2025-11-29 12:53:30', '2025-11-29 12:53:30');

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int(11) NOT NULL,
  `customer_id` int(11) NOT NULL,
  `guest_session_id` varchar(100) DEFAULT NULL,
  `is_guest_order` tinyint(1) DEFAULT 0,
  `order_date` datetime DEFAULT current_timestamp(),
  `status` enum('Pending','Paid','Shipped','Canceled') DEFAULT 'Pending',
  `totalAmount` decimal(10,2) DEFAULT NULL,
  `created_by` int(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `customerId` int(11) DEFAULT NULL,
  `orderNumber` varchar(255) DEFAULT NULL,
  `shipping_address` text DEFAULT NULL,
  `billing_address` text DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `is_paid` tinyint(1) DEFAULT 0,
  `paid_at` timestamp NULL DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `customer_notes` text DEFAULT NULL,
  `cancellation_reason` text DEFAULT NULL,
  `completed_at` timestamp NULL DEFAULT NULL,
  `cancelled_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `customer_id`, `guest_session_id`, `is_guest_order`, `order_date`, `status`, `totalAmount`, `created_by`, `created_at`, `customerId`, `orderNumber`, `shipping_address`, `billing_address`, `payment_method`, `is_paid`, `paid_at`, `phone`, `email`, `customer_notes`, `cancellation_reason`, `completed_at`, `cancelled_at`, `updated_at`) VALUES
(1, 0, NULL, 0, '2025-10-30 15:13:41', 'Pending', 8484.00, NULL, '2025-10-30 15:13:41', 1, 'ORD-1761812021666-tcrfjp7op', 'hanoi ', 'america', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-10-30 08:13:41'),
(3, 0, NULL, 0, '2025-11-01 00:30:24', 'Pending', 3322.00, NULL, '2025-11-01 00:30:24', 5, 'ORD-1761931824118-ovdrmav4v', 'ha nội', 'ha nội', 'COD', 0, NULL, '39393883', 'hao@gmail.com', '', NULL, NULL, NULL, '2025-10-31 17:30:24'),
(4, 0, NULL, 0, '2025-11-01 10:26:46', 'Pending', 3322.00, NULL, '2025-11-01 10:26:46', NULL, 'ORD-1761967606036-esscvyiku', 'Hồ Chí Minh', 'Hồ Chí Minh', 'COD', 0, NULL, '39393883', 'dungtran@gmail.com', '', NULL, NULL, NULL, '2025-11-01 03:26:46'),
(5, 0, NULL, 0, '2025-11-06 16:37:21', 'Pending', 36542.00, NULL, '2025-11-06 16:37:21', 14, 'ORD-1762421841251-kqf1jgjwy', 'Hồ Chí Minh', 'Hồ Chí Minh', 'COD', 0, NULL, '39393883', 'dungtran@gmail.com', '', NULL, NULL, NULL, '2025-11-06 09:37:21'),
(6, 0, NULL, 0, '2025-11-13 16:09:03', 'Pending', 3322.00, NULL, '2025-11-13 16:09:03', 14, 'ORD-1763024943101-rhz7newgu', 'VNUIS', 'VNUIS', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 09:09:03'),
(7, 0, NULL, 0, '2025-11-13 16:09:51', 'Pending', 3322.00, NULL, '2025-11-13 16:09:51', 14, 'ORD-1763024991830-42ar96lzi', '123 ABC', '123 ABC', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 09:09:51'),
(8, 0, NULL, 0, '2025-11-13 16:19:01', 'Pending', 3322.00, NULL, '2025-11-13 16:19:01', 1, 'ORD-1763025541328-2ph11e0hx', 'ha nội', 'ha nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 09:19:01'),
(9, 0, NULL, 0, '2025-11-13 16:22:40', 'Pending', 333.00, NULL, '2025-11-13 16:22:40', 1, 'ORD-1763025760231-kkkgfl6cz', 'Hà Nội', 'Hà Nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 09:22:40'),
(10, 0, NULL, 0, '2025-11-13 16:58:46', 'Pending', 3322.00, NULL, '2025-11-13 16:58:46', 19, 'ORD-1763027926241-uvq6rox8q', '2131231231231', '12312312', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 09:58:46'),
(11, 0, NULL, 0, '2025-11-13 21:38:44', 'Pending', 3322.00, NULL, '2025-11-13 21:38:44', 20, 'ORD-1763044724726-w3qjtlipm', 'VNUIS', 'VNUIS', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 14:38:44'),
(12, 0, NULL, 0, '2025-11-13 23:17:21', 'Pending', 3322.00, NULL, '2025-11-13 23:17:21', 21, 'ORD-1763050641952-6jsdefsjl', 'Nghệ An', 'Nghệ An', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 16:17:21'),
(13, 0, NULL, 0, '2025-11-13 23:22:46', 'Pending', 333.00, NULL, '2025-11-13 23:22:46', 22, 'ORD-1763050966195-ivt7jyhyh', 'Vũng Tàu', 'Vũng Tàu', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 16:22:46'),
(14, 0, NULL, 0, '2025-11-13 23:56:13', 'Pending', 8484.00, NULL, '2025-11-13 23:56:13', 27, 'ORD-1763052973753-82efvibxh', 'Hải Phòng ', 'Hải Phòng ', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-13 16:56:13'),
(15, 0, NULL, 0, '2025-11-14 08:37:36', 'Pending', 3322.00, NULL, '2025-11-14 08:37:36', 28, 'ORD-1763084256179-m1lvm5334', '12345', '12345', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 01:37:36'),
(16, 0, NULL, 0, '2025-11-14 09:15:36', 'Pending', 8484.00, NULL, '2025-11-14 09:15:36', 19, 'ORD-1763086536893-t1qtgq07m', '123456', '123456', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:15:36'),
(17, 0, NULL, 0, '2025-11-14 09:36:25', 'Pending', 3322.00, NULL, '2025-11-14 09:36:25', 19, 'ORD-1763087785771-42nyg9oi0', 'hjjj', 'hjjj', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:36:25'),
(18, 0, NULL, 0, '2025-11-14 09:55:36', 'Pending', 333.00, NULL, '2025-11-14 09:55:36', 19, 'ORD-1763088936794-mmf4jtqc1', '38833', '38833', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:55:36'),
(19, 0, NULL, 0, '2025-11-14 09:58:07', 'Pending', 333.00, NULL, '2025-11-14 09:58:07', 19, 'ORD-1763089087228-9ooigymd6', '993939', '993939', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:58:07'),
(20, 0, NULL, 0, '2025-11-14 09:58:42', 'Pending', 8484.00, NULL, '2025-11-14 09:58:42', 19, 'ORD-1763089122042-yprh11m01', 'jjgjg', 'jjgjg', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 02:58:42'),
(21, 0, NULL, 0, '2025-11-14 10:10:40', 'Pending', 8484.00, NULL, '2025-11-14 10:10:40', 1, 'ORD-1763089840349-2lsdf26ce', 'Test Address', NULL, 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 03:10:40'),
(22, 0, NULL, 0, '2025-11-14 10:32:06', 'Pending', 938.00, NULL, '2025-11-14 10:32:06', 19, 'ORD-1763091126150-0jclnyd6b', 'njjjd', 'njjjd', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 03:32:06'),
(23, 0, NULL, 0, '2025-11-14 11:22:11', 'Pending', 3999000.00, NULL, '2025-11-14 11:22:11', 19, 'ORD-1763094131750-o7ifq8gbz', 'nhà t ', 'nhà t ', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-14 04:22:11'),
(24, 0, NULL, 0, '2025-11-16 20:42:55', 'Pending', 3999000.00, NULL, '2025-11-16 20:42:55', 19, 'ORD-1763300575836-66i0rmdc5', 'abc', 'abc', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-16 13:42:55'),
(25, 0, NULL, 0, '2025-11-16 20:46:29', 'Pending', 3999000.00, NULL, '2025-11-16 20:46:29', 19, 'ORD-1763300789795-42hkv1iur', 'abc', 'abc', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-16 13:46:29'),
(37, 14, NULL, 0, '2025-11-27 16:00:55', 'Pending', 6550000.00, NULL, '2025-11-27 16:00:55', NULL, 'ORD-1764234055963-ulu9jc0sr', 'Hồ Chí Minh', 'Hà Nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:00:56'),
(38, 14, NULL, 0, '2025-11-27 16:01:09', 'Pending', 6550000.00, NULL, '2025-11-27 16:01:09', NULL, 'ORD-1764234069285-95dcpk3tr', 'Hồ Chí Minh', 'Hà Nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:01:09'),
(39, 14, NULL, 0, '2025-11-27 16:12:20', 'Pending', 6550000.00, NULL, '2025-11-27 16:12:20', NULL, 'ORD-1764234740327-aqzzq1pu3', 'ha nội', 'ha nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:12:20'),
(40, 14, NULL, 0, '2025-11-27 16:27:25', 'Pending', 6550000.00, NULL, '2025-11-27 16:27:25', NULL, 'ORD-1764235645709-3l9bsdhf5', 'ha nội', 'ha nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:27:25'),
(41, 14, NULL, 0, '2025-11-27 16:27:31', 'Pending', 6550000.00, NULL, '2025-11-27 16:27:31', NULL, 'ORD-1764235651013-kt98vqfk9', 'ha nội', 'ha nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:27:31'),
(42, 14, NULL, 0, '2025-11-27 16:45:05', 'Pending', 6550000.00, NULL, '2025-11-27 16:45:05', NULL, 'ORD-1764236705840-zkajpcb2p', 'An Dương', 'An Dương', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:45:05'),
(43, 14, NULL, 0, '2025-11-27 16:50:12', 'Pending', 6550000.00, NULL, '2025-11-27 16:50:12', NULL, 'ORD-1764237012826-gatirlts4', 'An Dương', 'An Dương', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:50:12'),
(44, 14, NULL, 0, '2025-11-27 16:57:32', 'Pending', 6550000.00, NULL, '2025-11-27 16:57:32', NULL, 'ORD-1764237452836-jilmqnn7m', 'An Dương', 'An Dương', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 09:57:32'),
(45, 14, NULL, 0, '2025-11-27 16:58:35', 'Pending', 3999000.00, NULL, '2025-11-27 16:58:35', NULL, 'ORD-1764237515145-7ttv4x8zt', 'VNU IS', 'VNU IS', 'BANKING', 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 15:20:11'),
(47, 19, NULL, 0, '2025-11-28 01:19:41', 'Pending', 3999000.00, NULL, '2025-11-28 01:19:41', NULL, 'ORD-1764267581260-eldoahd5k', '2131231231231', '12312312', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 18:19:41'),
(48, 19, NULL, 0, '2025-11-28 01:45:41', 'Pending', 6550000.00, NULL, '2025-11-28 01:45:41', NULL, 'ORD-1764269141672-frrahaw18', 'Hồ Chí Minh', 'Hà Nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 18:45:41'),
(55, 14, NULL, 0, '2025-11-28 02:39:25', 'Pending', 2999000.00, NULL, '2025-11-28 02:39:25', NULL, 'ORD-1764272365216-0q21brbrj', 'Hồ Chí Minh', 'Hà Nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 19:39:25'),
(57, 1, NULL, 0, '2025-11-28 02:42:07', 'Pending', 7530000.00, NULL, '2025-11-28 02:42:07', NULL, 'ORD-1764272527071-t0nql1ai4', '123 Đường ABC, TP.HCM', '123 Đường ABC, TP.HCM', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 19:42:07'),
(58, 1, NULL, 0, '2025-11-28 02:43:49', 'Pending', 6830000.00, NULL, '2025-11-28 02:43:49', NULL, 'ORD-1764272629546-i9szm1293', '123 Đường ABC, TP.HCM', '123 Đường ABC, TP.HCM', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 19:43:49'),
(60, 1, NULL, 0, '2025-11-28 02:48:27', 'Pending', 7070000.00, NULL, '2025-11-28 02:48:27', NULL, 'ORD-1764272907042-55gwje33v', '123 Đường ABC, TP.HCM', '123 Đường ABC, TP.HCM', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-27 19:48:27'),
(62, 14, NULL, 0, '2025-11-28 09:18:46', 'Pending', 450000.00, NULL, '2025-11-28 09:18:46', NULL, 'ORD-1764296326846-b34sxqh5q', 'An Dương', 'An Dương', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 02:18:46'),
(63, 14, NULL, 0, '2025-11-28 10:18:52', 'Pending', 3999000.00, NULL, '2025-11-28 10:18:52', NULL, 'ORD-1764299932616-4j2zmkuy7', 'Hồ Chí Minh', 'Hà Nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 03:18:52'),
(64, 30, NULL, 0, '2025-11-28 10:19:33', 'Pending', 3999000.00, NULL, '2025-11-28 10:19:33', NULL, 'ORD-1764299973843-39z6og5p7', '2131231231231', '12312312', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 03:19:33'),
(68, 17, NULL, 0, '2025-11-28 11:13:01', 'Pending', 30000.00, NULL, '2025-11-28 11:13:01', NULL, 'ORD-1764303181181-qrgb3oumv', 'HCQADADA', 'HCQADADA', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 04:13:01'),
(69, 31, NULL, 0, '2025-11-28 11:14:06', 'Pending', 6640000.00, NULL, '2025-11-28 11:14:06', NULL, 'ORD-1764303246301-gi2j6i9xy', 'Hồ Chí Minh', 'Hà Nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 04:14:06'),
(70, 31, NULL, 0, '2025-11-28 23:18:34', 'Pending', 3393000.00, NULL, '2025-11-28 23:18:34', NULL, 'ORD-1764346714847-p06w01i25', 'VNU IS', 'VNU IS', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:18:34'),
(71, 31, NULL, 0, '2025-11-28 23:23:46', 'Pending', 3999000.00, NULL, '2025-11-28 23:23:46', NULL, 'ORD-1764347026499-xaul2zjal', 'Hồ Chí Minh', 'Hà Nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:23:46'),
(72, 31, NULL, 0, '2025-11-28 23:46:41', 'Pending', 3999000.00, NULL, '2025-11-28 23:46:41', NULL, 'ORD-1764348401136-dj06ufmb1', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:46:41'),
(73, 31, NULL, 0, '2025-11-28 23:53:49', 'Pending', 3999000.00, NULL, '2025-11-28 23:53:49', NULL, 'ORD-1764348829926-ns4nlu5nv', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:53:49'),
(74, 31, NULL, 0, '2025-11-28 23:54:03', 'Pending', 3999000.00, NULL, '2025-11-28 23:54:03', NULL, 'ORD-1764348843957-135fsfcx0', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:54:03'),
(75, 31, NULL, 0, '2025-11-28 23:54:10', 'Pending', 3999000.00, NULL, '2025-11-28 23:54:10', NULL, 'ORD-1764348850357-f2p5mru4s', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:54:10'),
(76, 31, NULL, 0, '2025-11-28 23:57:51', 'Pending', 3999000.00, NULL, '2025-11-28 23:57:51', NULL, 'ORD-1764349071650-psytvbj69', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:57:51'),
(77, 31, NULL, 0, '2025-11-28 23:58:08', 'Pending', 3999000.00, NULL, '2025-11-28 23:58:08', NULL, 'ORD-1764349088455-f6kdvhy6d', 'Hồ Chí Minh', 'Hà Nội', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:58:08'),
(78, 31, NULL, 0, '2025-11-28 23:58:31', 'Pending', 2999000.00, NULL, '2025-11-28 23:58:31', NULL, 'ORD-1764349111455-9pkywxber', 'An Dương', 'An Dương', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 16:58:31'),
(79, 31, NULL, 0, '2025-11-29 00:00:32', 'Pending', 2999000.00, NULL, '2025-11-29 00:00:32', NULL, 'ORD-1764349232827-n6z4m5xpu', 'An Dương', 'An Dương', 'CREDIT_CARD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 17:00:32'),
(80, 31, NULL, 0, '2025-11-29 00:00:43', 'Pending', 2999000.00, NULL, '2025-11-29 00:00:43', NULL, 'ORD-1764349243845-7ls6rjksj', 'An Dương', 'An Dương', 'CREDIT_CARD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 17:00:43'),
(81, 31, NULL, 0, '2025-11-29 00:17:27', 'Pending', 2999000.00, NULL, '2025-11-29 00:17:27', NULL, 'ORD-1764350247880-aq4s1bf7n', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-28 17:17:27'),
(82, 33, NULL, 0, '2025-11-29 12:53:30', 'Pending', 3099000.00, NULL, '2025-11-29 12:53:30', NULL, 'ORD-1764395610581-4rafotwgc', 'VNU IS', 'VNU IS', 'COD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 05:53:30'),
(83, 12, NULL, 0, '2025-11-29 14:04:23', 'Pending', 6550000.00, NULL, '2025-11-29 14:04:23', NULL, 'ORD-1764399863405-869on63b4', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:04:23'),
(84, 12, NULL, 0, '2025-11-29 14:15:35', 'Pending', 6550000.00, NULL, '2025-11-29 14:15:35', NULL, 'ORD-1764400535068-sbdplo8jo', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:15:35'),
(85, 12, NULL, 0, '2025-11-29 14:17:44', 'Pending', 6550000.00, NULL, '2025-11-29 14:17:44', NULL, 'ORD-1764400664188-9sx6k03za', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:17:44'),
(86, 12, NULL, 0, '2025-11-29 14:23:05', 'Pending', 6550000.00, NULL, '2025-11-29 14:23:05', NULL, 'ORD-1764400985865-l68x0pnsm', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:23:05'),
(87, 12, NULL, 0, '2025-11-29 14:28:05', 'Pending', 6550000.00, NULL, '2025-11-29 14:28:05', NULL, 'ORD-1764401285918-epje0acgx', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:28:05'),
(88, 12, NULL, 0, '2025-11-29 14:31:23', 'Pending', 6550000.00, NULL, '2025-11-29 14:31:23', NULL, 'ORD-1764401483816-ocodfntzi', 'VNU IS', 'VNU IS', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:31:23'),
(89, 12, NULL, 0, '2025-11-29 14:32:22', 'Pending', 6550000.00, NULL, '2025-11-29 14:32:22', NULL, 'ORD-1764401542962-mnovzx8qj', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 07:32:22'),
(90, 12, NULL, 0, '2025-11-29 15:05:34', 'Pending', 6550000.00, NULL, '2025-11-29 15:05:34', NULL, 'ORD-1764403534591-st4zxgnxq', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:05:34'),
(91, 12, NULL, 0, '2025-11-29 15:09:05', 'Pending', 6550000.00, NULL, '2025-11-29 15:09:05', NULL, 'ORD-1764403745970-bcqfvsmqh', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:09:05'),
(92, 12, NULL, 0, '2025-11-29 15:09:48', 'Pending', 6550000.00, NULL, '2025-11-29 15:09:48', NULL, 'ORD-1764403788753-gd1rt7lz0', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:09:48'),
(93, 12, NULL, 0, '2025-11-29 15:17:09', 'Pending', 6550000.00, NULL, '2025-11-29 15:17:09', NULL, 'ORD-1764404229499-ejhg8tvhc', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:17:09'),
(94, 12, NULL, 0, '2025-12-01 15:21:06', 'Pending', 6550000.00, NULL, '2025-11-29 15:21:06', NULL, 'ORD-1764404466986-w8vi9yqcz', 'Hồ Chí Minh', 'Hà Nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-12-02 07:23:09'),
(95, 12, NULL, 0, '2025-11-29 15:28:41', 'Pending', 6550000.00, NULL, '2025-11-29 15:28:41', NULL, 'ORD-1764404921587-w5tehli6g', '2131231231231', '12312312', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:28:41'),
(96, 12, NULL, 0, '2025-11-29 15:33:18', 'Pending', 6550000.00, NULL, '2025-11-29 15:33:18', NULL, 'ORD-1764405198363-i83iej3ky', '2131231231231', '12312312', 'CREDIT_CARD', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:33:18'),
(97, 5, NULL, 0, '2025-11-29 15:33:32', 'Pending', 6550000.00, NULL, '2025-11-29 15:33:32', NULL, 'ORD-1764405212872-yfanfekl4', 'ha nội', 'ha nội', 'BANKING', 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, '2025-11-29 08:33:32');

-- --------------------------------------------------------

--
-- Table structure for table `order_details`
--

CREATE TABLE `order_details` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `price` decimal(10,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `order_items`
--

CREATE TABLE `order_items` (
  `id` int(11) NOT NULL,
  `orderId` int(11) NOT NULL,
  `productId` int(11) NOT NULL,
  `quantity` int(11) NOT NULL,
  `unitPrice` decimal(10,2) NOT NULL,
  `totalPrice` decimal(10,2) NOT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `type` enum('product','accessory') NOT NULL DEFAULT 'product'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `order_items`
--

INSERT INTO `order_items` (`id`, `orderId`, `productId`, `quantity`, `unitPrice`, `totalPrice`, `createdAt`, `updatedAt`, `type`) VALUES
(1, 1, 1, 1, 8484.00, 8484.00, '2025-10-30 15:13:41', '2025-10-30 15:13:41', 'product'),
(2, 2, 1, 1, 8484.00, 8484.00, '2025-11-01 00:27:02', '2025-11-01 00:27:02', 'product'),
(3, 3, 2, 1, 3322.00, 3322.00, '2025-11-01 00:30:24', '2025-11-01 00:30:24', 'product'),
(4, 4, 2, 1, 3322.00, 3322.00, '2025-11-01 10:26:46', '2025-11-01 10:26:46', 'product'),
(5, 5, 2, 11, 3322.00, 36542.00, '2025-11-06 16:37:21', '2025-11-06 16:37:21', 'product'),
(6, 6, 2, 1, 3322.00, 3322.00, '2025-11-13 16:09:03', '2025-11-13 16:09:03', 'product'),
(7, 7, 2, 1, 3322.00, 3322.00, '2025-11-13 16:09:51', '2025-11-13 16:09:51', 'product'),
(8, 8, 2, 1, 3322.00, 3322.00, '2025-11-13 16:19:01', '2025-11-13 16:19:01', 'product'),
(9, 9, 5, 1, 333.00, 333.00, '2025-11-13 16:22:40', '2025-11-13 16:22:40', 'product'),
(10, 10, 2, 1, 3322.00, 3322.00, '2025-11-13 16:58:46', '2025-11-13 16:58:46', 'product'),
(11, 11, 2, 1, 3322.00, 3322.00, '2025-11-13 21:38:44', '2025-11-13 21:38:44', 'product'),
(12, 12, 2, 1, 3322.00, 3322.00, '2025-11-13 23:17:21', '2025-11-13 23:17:21', 'product'),
(13, 13, 3, 1, 333.00, 333.00, '2025-11-13 23:22:46', '2025-11-13 23:22:46', 'product'),
(14, 14, 1, 1, 8484.00, 8484.00, '2025-11-13 23:56:13', '2025-11-13 23:56:13', 'product'),
(15, 15, 2, 1, 3322.00, 3322.00, '2025-11-14 08:37:36', '2025-11-14 08:37:36', 'product'),
(16, 16, 1, 1, 8484.00, 8484.00, '2025-11-14 09:15:36', '2025-11-14 09:15:36', 'product'),
(17, 17, 2, 1, 3322.00, 3322.00, '2025-11-14 09:36:25', '2025-11-14 09:36:25', 'product'),
(18, 18, 3, 1, 333.00, 333.00, '2025-11-14 09:55:36', '2025-11-14 09:55:36', 'product'),
(19, 19, 3, 1, 333.00, 333.00, '2025-11-14 09:58:07', '2025-11-14 09:58:07', 'product'),
(20, 20, 1, 1, 8484.00, 8484.00, '2025-11-14 09:58:42', '2025-11-14 09:58:42', 'product'),
(21, 21, 1, 1, 8484.00, 8484.00, '2025-11-14 10:10:40', '2025-11-14 10:10:40', 'product'),
(22, 22, 4, 1, 938.00, 938.00, '2025-11-14 10:32:06', '2025-11-14 10:32:06', 'product'),
(23, 23, 2, 1, 3999000.00, 3999000.00, '2025-11-14 11:22:11', '2025-11-14 11:22:11', 'product'),
(24, 24, 2, 1, 3999000.00, 3999000.00, '2025-11-16 20:42:55', '2025-11-16 20:42:55', 'product'),
(25, 25, 2, 1, 3999000.00, 3999000.00, '2025-11-16 20:46:29', '2025-11-16 20:46:29', 'product'),
(27, 37, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:00:55', '2025-11-27 16:00:55', 'product'),
(28, 38, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:01:09', '2025-11-27 16:01:09', 'product'),
(29, 39, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:12:20', '2025-11-27 16:12:20', 'product'),
(30, 40, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:27:25', '2025-11-27 16:27:25', 'product'),
(31, 41, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:27:31', '2025-11-27 16:27:31', 'product'),
(32, 42, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:45:05', '2025-11-27 16:45:05', 'product'),
(33, 43, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:50:12', '2025-11-27 16:50:12', 'product'),
(34, 44, 1, 1, 6550000.00, 6550000.00, '2025-11-27 16:57:32', '2025-11-27 16:57:32', 'product'),
(35, 45, 2, 1, 3999000.00, 3999000.00, '2025-11-27 16:58:35', '2025-11-27 16:58:35', 'product'),
(42, 47, 2, 1, 3999000.00, 3999000.00, '2025-11-28 01:19:41', '2025-11-28 01:19:41', 'product'),
(43, 48, 1, 1, 6550000.00, 6550000.00, '2025-11-28 01:45:41', '2025-11-28 01:45:41', 'product'),
(45, 55, 4, 1, 2999000.00, 2999000.00, '2025-11-28 02:39:25', '2025-11-28 02:39:25', 'product'),
(46, 57, 1, 1, 6550000.00, 6550000.00, '2025-11-28 02:42:07', '2025-11-28 02:42:07', 'product'),
(47, 57, 2, 1, 280000.00, 280000.00, '2025-11-28 02:42:07', '2025-11-28 02:42:07', 'product'),
(48, 57, 4, 2, 350000.00, 700000.00, '2025-11-28 02:42:07', '2025-11-28 02:42:07', 'product'),
(49, 58, 1, 1, 6550000.00, 6550000.00, '2025-11-28 02:43:49', '2025-11-28 02:43:49', 'product'),
(50, 58, 2, 1, 280000.00, 280000.00, '2025-11-28 02:43:49', '2025-11-28 02:43:49', 'product'),
(53, 60, 1, 1, 6550000.00, 6550000.00, '2025-11-28 02:48:27', '2025-11-28 02:48:27', 'product'),
(54, 60, 2, 1, 280000.00, 280000.00, '2025-11-28 02:48:27', '2025-11-28 02:48:27', 'product'),
(55, 60, 3, 2, 120000.00, 240000.00, '2025-11-28 02:48:27', '2025-11-28 02:48:27', 'product'),
(56, 62, 1, 1, 450000.00, 450000.00, '2025-11-28 09:18:46', '2025-11-28 09:18:46', 'product'),
(57, 63, 2, 1, 3999000.00, 3999000.00, '2025-11-28 10:18:52', '2025-11-28 10:18:52', 'product'),
(58, 64, 2, 1, 3999000.00, 3999000.00, '2025-11-28 10:19:33', '2025-11-28 10:19:33', 'product'),
(59, 68, 9, 1, 30000.00, 30000.00, '2025-11-28 11:13:01', '2025-11-28 11:13:01', 'accessory'),
(60, 69, 1, 1, 6550000.00, 6550000.00, '2025-11-28 11:14:06', '2025-11-28 11:14:06', 'product'),
(61, 69, 8, 1, 90000.00, 90000.00, '2025-11-28 11:14:06', '2025-11-28 11:14:06', 'accessory'),
(62, 70, 3, 1, 3333000.00, 3333000.00, '2025-11-28 23:18:34', '2025-11-28 23:18:34', 'product'),
(63, 70, 9, 2, 30000.00, 60000.00, '2025-11-28 23:18:34', '2025-11-28 23:18:34', 'accessory'),
(64, 71, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:23:46', '2025-11-28 23:23:46', 'product'),
(65, 72, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:46:41', '2025-11-28 23:46:41', 'product'),
(66, 73, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:53:49', '2025-11-28 23:53:49', 'product'),
(67, 74, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:54:03', '2025-11-28 23:54:03', 'product'),
(68, 75, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:54:10', '2025-11-28 23:54:10', 'product'),
(69, 76, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:57:51', '2025-11-28 23:57:51', 'product'),
(70, 77, 2, 1, 3999000.00, 3999000.00, '2025-11-28 23:58:08', '2025-11-28 23:58:08', 'product'),
(71, 78, 4, 1, 2999000.00, 2999000.00, '2025-11-28 23:58:31', '2025-11-28 23:58:31', 'product'),
(72, 79, 4, 1, 2999000.00, 2999000.00, '2025-11-29 00:00:32', '2025-11-29 00:00:32', 'product'),
(73, 80, 4, 1, 2999000.00, 2999000.00, '2025-11-29 00:00:43', '2025-11-29 00:00:43', 'product'),
(74, 81, 4, 1, 2999000.00, 2999000.00, '2025-11-29 00:17:27', '2025-11-29 00:17:27', 'product'),
(75, 82, 4, 1, 2999000.00, 2999000.00, '2025-11-29 12:53:30', '2025-11-29 12:53:30', 'product'),
(76, 82, 7, 1, 100000.00, 100000.00, '2025-11-29 12:53:30', '2025-11-29 12:53:30', 'accessory'),
(77, 83, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:04:23', '2025-11-29 14:04:23', 'product'),
(78, 84, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:15:35', '2025-11-29 14:15:35', 'product'),
(79, 85, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:17:44', '2025-11-29 14:17:44', 'product'),
(80, 86, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:23:05', '2025-11-29 14:23:05', 'product'),
(81, 87, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:28:05', '2025-11-29 14:28:05', 'product'),
(82, 88, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:31:23', '2025-11-29 14:31:23', 'product'),
(83, 89, 1, 1, 6550000.00, 6550000.00, '2025-11-29 14:32:22', '2025-11-29 14:32:22', 'product'),
(84, 90, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:05:34', '2025-11-29 15:05:34', 'product'),
(85, 91, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:09:05', '2025-11-29 15:09:05', 'product'),
(86, 92, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:09:48', '2025-11-29 15:09:48', 'product'),
(87, 93, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:17:09', '2025-11-29 15:17:09', 'product'),
(88, 94, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:21:07', '2025-11-29 15:21:07', 'product'),
(89, 95, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:28:41', '2025-11-29 15:28:41', 'product'),
(90, 96, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:33:18', '2025-11-29 15:33:18', 'product'),
(91, 97, 1, 1, 6550000.00, 6550000.00, '2025-11-29 15:33:32', '2025-11-29 15:33:32', 'product');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int(11) NOT NULL,
  `order_id` int(11) NOT NULL,
  `payment_method` enum('bank_transfer','cod','credit_card') NOT NULL,
  `amount` decimal(10,2) NOT NULL,
  `status` enum('pending','paid','failed','refunded') DEFAULT 'pending',
  `transaction_code` varchar(255) DEFAULT NULL,
  `payment_proof_url` varchar(500) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `payment_method`, `amount`, `status`, `transaction_code`, `payment_proof_url`, `created_at`, `updated_at`) VALUES
(1, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 07:29:20', '2025-11-29 07:29:20'),
(2, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 07:31:15', '2025-11-29 07:31:15'),
(3, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 07:46:51', '2025-11-29 07:46:51'),
(4, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 07:52:51', '2025-11-29 07:52:51'),
(5, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 08:03:33', '2025-11-29 08:03:33'),
(6, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 08:05:09', '2025-11-29 08:05:09'),
(7, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 08:06:27', '2025-11-29 08:06:27'),
(8, 86, 'bank_transfer', 6550000.00, 'pending', NULL, NULL, '2025-11-29 08:08:48', '2025-11-29 08:08:48');

-- --------------------------------------------------------

--
-- Table structure for table `products`
--

CREATE TABLE `products` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `sku` varchar(50) DEFAULT NULL,
  `brand` varchar(50) DEFAULT NULL,
  `model_year` year(4) DEFAULT NULL,
  `color_options` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`color_options`)),
  `price` decimal(10,2) NOT NULL,
  `stock` int(11) NOT NULL,
  `category` varchar(50) DEFAULT NULL,
  `bike_type` varchar(50) DEFAULT NULL,
  `attributes` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`attributes`)),
  `image_url` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `quantity` int(11) DEFAULT 0,
  `category_id` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `products`
--

INSERT INTO `products` (`id`, `name`, `description`, `sku`, `brand`, `model_year`, `color_options`, `price`, `stock`, `category`, `bike_type`, `attributes`, `image_url`, `createdAt`, `updatedAt`, `quantity`, `category_id`) VALUES
(1, 'Xe đạp địa hình thể thao Maruishi ASO', 'Với xu hướng phát triển bận rộn như ngày nay, mọi người thường làm việc văn phòng công sở không có thời gian hoạt động, để nâng cao sức khỏe và để phòng tránh được những bệnh tật. Bộ môn đạp xe đạp rất được nhiều người quan tâm nhất là ở các thành phố lớn, đạp xe đạp nâng cao sức khỏe và có rất nhiều tác dụng tốt cho cơ thể, thứ nhất là bộ môn bơi lội, thứ nhì là đạp xe đạp.\n\n', NULL, 'Maruishi', '2025', '[\"Đen\", \"Xanh\", \"Đỏ\"]', 6550000.00, 0, 'Xe đạp địa hình', 'Mountain Bike', NULL, 'http://localhost:3000/uploads/products/product-1763977152038-95658893.jpg', '2025-10-30 10:49:59', '2025-12-02 16:41:37', 151, 1),
(2, 'Xe đạp trẻ em NISHIKI ANNA 20', 'Ngay lần đầu nhìn thấy xe đạp trẻ em NISHIKI ANNA 20, các bé và phụ huynh sẽ rất ấn tượng với thiết kế thời trang thể thao với 3 phối màu hiện đại cùng kích cỡ bánh 20 inch. Đây sẽ là lựa chọn tuyệt vời dành cho các bé trong giai đoạn phát triển và tập đi xe.\n', NULL, 'NISHIKI', '2025', '[\"Hồng\", \"Xanh\", \"Trắng\"]', 3999000.00, 0, 'Xe đạp trẻ em', 'Kids Bike', NULL, 'http://localhost:3000/uploads/products/product-1762160785813-40438951.jpg', '2025-10-31 08:36:35', '2025-12-02 16:41:37', 883, 2),
(3, 'Xe đạp touring Maruishi Half Miler', 'Bạn đang cần tìm một chiếc xe nhẹ nhàng, thanh lịch, êm ái nhưng vẫn ổn định trên mọi cung đường, Mẫu xe Maruishi Half Miler đến từ Nhật Bản sẽ là chiếc xe khiến bạn hài lòng ngay từ cái nhìn đầu tiên. Xe đạp touring Maruishi Half Miler là chiếc xe đạp thành phố, với kiểu dáng trang nhã, màu sắc khỏe khoắn, phù hợp cho nhiều đối tượng sử dụng, từ thanh niên đến trung niên. Với nhiều mục đích sử dụng, từ đi làm, đi tập thể dục, đi chơi, đi phượt….\n', NULL, 'Maruishi', '2025', '[\"Xám\", \"Đen\"]', 3333000.00, 0, 'Xe đạp tuaring', 'Touring Bike', NULL, 'http://localhost:3000/uploads/products/product-1762160816726-403420681.jpg', '2025-10-31 08:41:46', '2025-12-02 16:41:37', 7, 3),
(4, 'Xe đạp đua RIKULAU CADENCE', 'Xe đạp đua RIKULAU CADENCE mang trong mình kiểu dáng thể thao với thiết kế hiện đại, thời thượng, phù hợp với những hoạt động ngoài trời nhằm mục đích rèn luyện sức khỏe hay chinh phục những cung đường đầy thử thách.', NULL, 'RIKULAU', '2025', '[\"Đỏ\", \"Đen\", \"Trắng\"]', 2999000.00, 0, 'Xe đạp đua', 'Road Bike', NULL, 'http://localhost:3000/uploads/products/product-1762109283481-50811960.jpg', '2025-11-03 01:48:14', '2025-12-02 16:41:37', 11, 4);

-- --------------------------------------------------------

--
-- Table structure for table `inventory`
--

CREATE TABLE `inventory` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `quantity` int(11) NOT NULL DEFAULT 0,
  `reserved` int(11) NOT NULL DEFAULT 0,
  `min_stock` int(11) NOT NULL DEFAULT 0,
  `location` varchar(100) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `products_new`
--

CREATE TABLE `products_new` (
  `id` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int(11) DEFAULT 0,
  `category` varchar(100) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp(),
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `product_categories`
--

CREATE TABLE `product_categories` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `category_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_categories`
--

INSERT INTO `product_categories` (`id`, `product_id`, `category_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 4);

-- --------------------------------------------------------

--
-- Table structure for table `product_specifications`
--

CREATE TABLE `product_specifications` (
  `id` int(11) NOT NULL,
  `product_id` int(11) DEFAULT NULL,
  `frame_size` varchar(50) DEFAULT NULL,
  `wheel_size` varchar(20) DEFAULT NULL,
  `gear_system` varchar(100) DEFAULT NULL,
  `brake_type` varchar(50) DEFAULT NULL,
  `weight` decimal(5,2) DEFAULT NULL,
  `material` varchar(50) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `product_specifications`
--

INSERT INTO `product_specifications` (`id`, `product_id`, `frame_size`, `wheel_size`, `gear_system`, `brake_type`, `weight`, `material`, `created_at`, `updated_at`) VALUES
(1, 1, 'L', '29\"', 'Shimano 21-speed', 'Đĩa phanh', 14.50, 'Nhôm', '2025-11-16 15:25:29', '2025-11-16 15:25:29'),
(2, 2, 'S', '20\"', 'Single-speed', 'Phanh gấp', 11.20, 'Thép', '2025-11-16 15:25:29', '2025-11-16 15:25:29'),
(3, 3, 'M', '700C', 'Shimano 18-speed', 'Phanh vành', 13.80, 'Thép Carbon', '2025-11-16 15:25:29', '2025-11-16 15:25:29'),
(4, 4, 'M', '700C', 'Shimano 16-speed', 'Đĩa phanh', 9.50, 'Carbon', '2025-11-16 15:25:29', '2025-11-16 15:25:29');

-- --------------------------------------------------------

--
-- Table structure for table `test_ride_schedules`
--

CREATE TABLE `test_ride_schedules` (
  `id` int(11) NOT NULL,
  `product_id` int(11) NOT NULL,
  `customer_name` varchar(255) NOT NULL,
  `customer_phone` varchar(20) NOT NULL,
  `customer_email` varchar(100) DEFAULT NULL,
  `scheduled_date` datetime NOT NULL,
  `status` enum('pending','confirmed','completed','cancelled') DEFAULT 'pending',
  `notes` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `password` varchar(255) DEFAULT NULL,
  `role` enum('Admin','User') NOT NULL DEFAULT 'User',
  `email` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `createdAt` datetime DEFAULT current_timestamp(),
  `updatedAt` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `password`, `role`, `email`, `name`, `createdAt`, `updatedAt`) VALUES
(1, '$2b$10$55dpwgw1hozyT/109.Z6Z.tFYrXukg/6BoTLelM.AIC0RZh5g5I2G', '', 'admin@gmail.com', 'Administrator', '2025-10-29 20:26:00', '2025-10-29 20:26:00'),
(3, '$2b$10$MGay2yItqnBV1WYouKccc.5YIG54ijhtNuZRBqWKQug9I/rZDz8mu', 'Admin', 'admin@example.com', 'Admin User', '2025-10-30 00:50:11', '2025-10-30 00:50:11'),
(4, '$2b$10$odxtykh2m1y2PXU889npLO3P6iocPFv28GMgXVTasaWqt8I/tPe/W', 'Admin', 'admin@123gmail.com', 'Admin User', '2025-10-30 00:54:11', '2025-10-30 00:54:11'),
(5, '$2b$10$1aVldWSJpddevA0QP/I8n.rBYp86hrrkd6jxjM23uOvV0mdwHOUxm', 'User', 'loaniu@example.com', 'Mai Lê Phương Loan', '2025-10-30 01:12:37', '2025-10-30 01:12:37'),
(6, '$2b$10$FH1j8H.W7eaf.xNRHXtIxuYWr.Prz48gjL37RuzwVEEfOvIIsZ5CO', 'User', 'simple@example.com', 'Simple User', '2025-10-30 01:16:46', '2025-10-30 01:16:46'),
(7, '$2b$10$Mz1TEwD.SlQKnbhkkNETouBqfVUtDf2iEdaUSluRmUB2/AkniOc8K', 'User', 'test@example.com', 'Test User', '2025-10-30 02:33:20', '2025-10-30 02:33:20');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `bank_transfers`
--
ALTER TABLE `bank_transfers`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `bank_transfer_payments`
--
ALTER TABLE `bank_transfer_payments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `bike_accessories`
--
ALTER TABLE `bike_accessories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_accessories_category_id` (`category_id`);

--
-- Indexes for table `carts`
--
ALTER TABLE `carts`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_product` (`userId`,`productId`),
  ADD KEY `idx_user_id` (`userId`),
  ADD KEY `idx_product_id` (`productId`),
  ADD KEY `idx_session_id` (`sessionId`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `ux_categories_slug` (`slug`);

--
-- Indexes for table `cod_payments`
--
ALTER TABLE `cod_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `credit_card_payments`
--
ALTER TABLE `credit_card_payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `payment_id` (`payment_id`);

--
-- Indexes for table `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `orderNumber` (`orderNumber`),
  ADD KEY `customer_id` (`customer_id`),
  ADD KEY `created_by` (`created_by`),
  ADD KEY `fk_orders_customer` (`customerId`);

--
-- Indexes for table `order_details`
--
ALTER TABLE `order_details`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `order_items`
--
ALTER TABLE `order_items`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `order_id` (`order_id`);

--
-- Indexes for table `products`
--
ALTER TABLE `products`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `sku` (`sku`),
  ADD KEY `idx_products_category_id` (`category_id`);

--
-- Indexes for table `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_inventory_product` (`product_id`),
  ADD KEY `idx_inventory_category` (`category_id`);

--
-- Indexes for table `products_new`
--
ALTER TABLE `products_new`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_pc_product` (`product_id`),
  ADD KEY `idx_pc_category` (`category_id`);

--
-- Indexes for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `test_ride_schedules`
--
ALTER TABLE `test_ride_schedules`
  ADD PRIMARY KEY (`id`),
  ADD KEY `product_id` (`product_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bank_transfers`
--
ALTER TABLE `bank_transfers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bank_transfer_payments`
--
ALTER TABLE `bank_transfer_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `bike_accessories`
--
ALTER TABLE `bike_accessories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `carts`
--
ALTER TABLE `carts`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `cod_payments`
--
ALTER TABLE `cod_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `credit_card_payments`
--
ALTER TABLE `credit_card_payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `customers`
--
ALTER TABLE `customers`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=34;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=98;

--
-- AUTO_INCREMENT for table `order_details`
--
ALTER TABLE `order_details`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `order_items`
--
ALTER TABLE `order_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=92;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `products`
--
ALTER TABLE `products`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `products_new`
--
ALTER TABLE `products_new`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `product_categories`
--
ALTER TABLE `product_categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `product_specifications`
--
ALTER TABLE `product_specifications`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `test_ride_schedules`
--
ALTER TABLE `test_ride_schedules`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `bank_transfers`
--
ALTER TABLE `bank_transfers`
  ADD CONSTRAINT `bank_transfers_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`id`);

--
-- Constraints for table `bike_accessories`
--
ALTER TABLE `bike_accessories`
  ADD CONSTRAINT `fk_accessories_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `carts`
--
ALTER TABLE `carts`
  ADD CONSTRAINT `carts_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `carts_ibfk_2` FOREIGN KEY (`productId`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_orders_customer` FOREIGN KEY (`customerId`) REFERENCES `customers` (`id`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `orders_ibfk_2` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`);

--
-- Constraints for table `order_details`
--
ALTER TABLE `order_details`
  ADD CONSTRAINT `order_details_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `order_details_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`);

--
-- Constraints for table `products`
--
ALTER TABLE `products`
  ADD CONSTRAINT `fk_products_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `inventory`
--
ALTER TABLE `inventory`
  ADD CONSTRAINT `fk_inventory_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_inventory_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Constraints for table `product_categories`
--
ALTER TABLE `product_categories`
  ADD CONSTRAINT `fk_pc_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_pc_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `product_specifications`
--
ALTER TABLE `product_specifications`
  ADD CONSTRAINT `product_specifications_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `test_ride_schedules`
--
ALTER TABLE `test_ride_schedules`
  ADD CONSTRAINT `test_ride_schedules_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
