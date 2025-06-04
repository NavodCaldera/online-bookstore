-- E-Commerce Bookstore Database Schema
-- This file contains the complete database structure and sample data

-- Create database
CREATE DATABASE IF NOT EXISTS bookstore_db;
USE bookstore_db;

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert categories
INSERT INTO categories (id, name, description) VALUES
(1, 'Fiction', 'Fictional literature and novels'),
(2, 'Non-Fiction', 'Educational and informational books'),
(3, 'Science', 'Scientific and technical books'),
(4, 'Mathematics', 'Mathematics and related subjects'),
(5, 'History', 'Historical books and references'),
(6, 'Literature', 'Classic and modern literature'),
(7, 'Technology', 'Computer science and technology'),
(8, 'Arts', 'Art, music, and creative subjects'),
(9, 'Business', 'Business and economics'),
(10, 'Philosophy', 'Philosophy and ethics'),
(11, 'Psychology', 'Psychology and behavioral sciences'),
(12, 'Reference', 'Reference books and encyclopedias');

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    user_type ENUM('buyer', 'seller', 'both') DEFAULT 'buyer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Books table
CREATE TABLE IF NOT EXISTS books (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    `condition` ENUM('New', 'Used', 'Fair', 'Poor') DEFAULT 'Used',
    published_year INT,
    edition VARCHAR(50),
    short_description TEXT,
    availability BOOLEAN DEFAULT 1,
    category_id INT,
    rating DECIMAL(2,1) DEFAULT 0.0,
    price DECIMAL(10,2) NOT NULL,
    isbn VARCHAR(20),
    language VARCHAR(50) DEFAULT 'English',
    seller_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id),
    FOREIGN KEY (seller_id) REFERENCES users(id)
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Cart table
CREATE TABLE IF NOT EXISTS cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE KEY unique_user_book (user_id, book_id)
);

-- Wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE KEY unique_user_book_wishlist (user_id, book_id)
);

-- Reviews table
CREATE TABLE IF NOT EXISTS reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (book_id) REFERENCES books(id),
    UNIQUE KEY unique_user_book_review (user_id, book_id)
);

-- Book images table
CREATE TABLE IF NOT EXISTS book_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    book_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (book_id) REFERENCES books(id)
);

-- Sample data for books (first 50 books from the dataset)
INSERT INTO books (id, title, author, `condition`, published_year, edition, short_description, availability, category_id, rating, price, isbn, language, created_at) VALUES
(1, 'Live stand against.', 'Chad Dickerson', 'Used', 2015, 'Anniversary', 'Enter media offer few attack travel reflect. His no school catch. Serve for region no determine soldier account find. Politics attention television personal society. Relationship society help since.', 1, 5, 5.0, 41.96, '978-1-4956-0968-8', 'English', NOW()),
(2, 'Piece painting trial move.', 'Calvin Bradford', 'Used', 1990, 'Anniversary', 'Strategy modern guess determine. Factor beyond happy wife. Hospital three trade inside generation mouth.', 1, 3, 2.2, 6.35, '978-1-4556-6009-4', 'Japanese', NOW()),
(3, 'Nor thus consumer.', 'Shannon Edwards', 'Used', 1969, '3rd', 'Phone its area leader information. Name important give meeting research. Meet out wide gas. Few ok though sell. Hair money carry act visit social system almost. We too style.', 1, 12, 3.6, 37.41, '978-0-225-18900-1', 'Spanish', NOW()),
(4, 'You light note.', 'Elizabeth Macias', 'Used', 1986, '2nd', 'Dog past make nor pass practice girl. Stay hour ask score question. Experience could boy water ready. Role company box staff left become notice.', 1, 9, 3.0, 36.82, '978-0-353-18760-3', 'German', NOW()),
(5, 'Listen cover deal.', 'Tracy Gray', 'Used', 2001, 'Revised', 'Anything how actually vote chair get. Much especially every line lead enjoy. Expert economic wear. Can none edge. Game court beat return visit real.', 1, 2, 1.2, 44.5, '978-0-9941342-2-6', 'Chinese', NOW()),
(6, 'Professor attack approach.', 'Sean Cross', 'Used', 2010, 'Revised', 'Create theory there ground. Medical win after space. Reflect arrive start. Partner suggest newspaper approach voice apply guess particularly.', 1, 8, 3.4, 25.24, '978-0-489-33641-8', 'Spanish', NOW()),
(7, 'Writer reduce kitchen.', 'David Burton', 'Used', 2001, 'Anniversary', 'Face the happy indicate better. Exactly real address make. Carry event item career. Develop partner color manage. Expect your across affect live.', 1, 2, 1.1, 42.84, '978-0-535-50113-5', 'French', NOW()),
(8, 'West amount feel everyone.', 'Michele Morgan', 'Used', 1967, '1st', 'Final he life. Decide national friend be. Discover measure hope professor will store. Draw guy also soon hour. Even team south industry physical. Perform describe energy yeah listen.', 1, 5, 4.9, 47.94, '978-1-08-665847-7', 'German', NOW()),
(9, 'Dog as how.', 'Thomas Patel', 'Used', 1982, 'Revised', 'Thought support then. Something control level almost kitchen. From tree society chair partner whose group. Dark moment determine door. Role do choice heart. Maybe develop song hair.', 1, 10, 4.1, 37.37, '978-1-74459-928-9', 'Chinese', NOW()),
(10, 'Growth truth very whose.', 'Mandy Mann', 'Used', 1997, '1st', 'Audience back throw sea unit man. Support degree relate help. Deal result charge toward notice challenge relationship catch. Will simply box drive. Process guy chance series side week travel.', 1, 10, 3.1, 6.23, '978-0-8339-0861-2', 'Spanish', NOW()),
(11, 'Need population wait cup.', 'Scott Brown', 'Used', 2010, '1st', 'Subject center pull most entire cold. Nor environment relate energy at yard theory. Century light serve. Industry thing final theory score raise. Argue much activity manager loss.', 1, 6, 4.7, 11.02, '978-1-5098-7031-8', 'English', NOW()),
(12, 'Bag water about meeting.', 'April Robinson', 'Used', 2004, 'Deluxe', 'Some attack suffer organization. Six available mean behind. Vote born name why science less. Beyond politics tough line. Central card gas section ability. Improve able our happen wait environmental.', 1, 3, 1.9, 43.0, '978-0-925041-88-3', 'English', NOW()),
(13, 'Free project anything.', 'Samantha Foley', 'Used', 1970, '1st', 'Degree sound sport institution. Style point yard service partner plant. Television garden pressure business. Federal rock court.', 1, 7, 4.0, 11.02, '978-0-240-20533-5', 'French', NOW()),
(14, 'Up from matter TV.', 'Bradley Smith', 'Used', 1962, 'Deluxe', 'Bill indicate think read. Network summer value partner. Reach nature what off want. Take exist item dark. Garden day debate still cell.', 1, 12, 3.0, 38.84, '978-1-03-580265-4', 'Japanese', NOW()),
(15, 'At management hard.', 'Jared Mitchell', 'Used', 1968, 'Deluxe', 'Admit size whole firm attention pay. Argue strategy interview possible somebody culture thousand. Although kid pick note everybody. Especially writer court we field across.', 1, 5, 1.0, 39.57, '978-1-08-357017-8', 'English', NOW()),
(16, 'Add claim then evening.', 'Jessica Jones', 'Used', 2019, '3rd', 'Rock rule like from bill respond. Help enough television success art. Say girl happy fact. Experience art management social exist. Agency fall cup network. Yeah population increase side.', 1, 12, 2.8, 39.44, '978-0-907340-45-4', 'Spanish', NOW()),
(17, 'Mr scene stuff.', 'Corey Kennedy', 'Used', 1967, '3rd', 'Listen alone doctor wrong section show easy. Instead that structure soldier even bar. Person nor institution likely. Early arrive education drug television. Amount card dog light read property share.', 1, 9, 2.3, 29.1, '978-0-467-80916-3', 'Japanese', NOW()),
(18, 'Need artist.', 'Sara Williams', 'Used', 2002, '1st', 'Physical price yet radio role. Game any without player article feeling home whom. Determine join issue scene miss together.', 1, 11, 3.1, 46.12, '978-0-461-27790-6', 'Japanese', NOW()),
(19, 'Public participant city.', 'Amy Johnson', 'New', 1960, 'Deluxe', 'Event between visit him operation side small. Hour really know speak both result. Day or tough serious perform. Claim have magazine deal on rise. High throughout I vote during hundred seek.', 1, 11, 3.2, 21.45, '978-1-81312-429-9', 'Spanish', NOW()),
(20, 'Former must data but.', 'Tina Ray', 'Used', 1974, 'Deluxe', 'Final receive example do account. Partner character difference especially billion approach. Behavior course which never collection. Record reduce nothing.', 1, 12, 2.6, 34.62, '978-1-4507-1864-6', 'English', NOW());

-- Create indexes for better performance
CREATE INDEX idx_books_category ON books(category_id);
CREATE INDEX idx_books_availability ON books(availability);
CREATE INDEX idx_books_price ON books(price);
CREATE INDEX idx_books_rating ON books(rating);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_author ON books(author);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user ON cart(user_id);
CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_reviews_book ON reviews(book_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
