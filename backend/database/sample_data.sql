USE online_bookstore;

-- Insert categories
INSERT INTO categories (name, description) VALUES
('Fiction', 'Novels and short stories that are products of the author''s imagination'),
('Non-Fiction', 'Literature that is based on facts and real events'),
('Science Fiction', 'Fiction dealing with imaginative content such as futuristic settings'),
('Mystery', 'Fiction dealing with the solution of a crime or the unraveling of secrets'),
('Biography', 'A detailed description of a person''s life');

-- Insert books
INSERT INTO books (title, author, description, price, image_url, stock, category_id, featured) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'A novel of the Jazz Age that follows the life of mysterious millionaire Jay Gatsby', 12.99, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 50, 1, TRUE),
('To Kill a Mockingbird', 'Harper Lee', 'A novel about racial injustice and the destruction of innocence', 10.99, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 45, 1, TRUE),
('1984', 'George Orwell', 'A dystopian novel set in a totalitarian society', 9.99, 'https://images.unsplash.com/photo-1495640452828-3df6795cf69b?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 30, 3, TRUE),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'A book about the history and evolution of humans', 15.99, 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 25, 2, FALSE),
('The Da Vinci Code', 'Dan Brown', 'A mystery thriller novel', 11.99, 'https://images.unsplash.com/photo-1591951425300-4303dfe4c28e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 20, 4, FALSE),
('Steve Jobs', 'Walter Isaacson', 'The biography of Apple co-founder Steve Jobs', 14.99, 'https://images.unsplash.com/photo-1611016186353-9af58c69a533?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 15, 5, FALSE),
('Dune', 'Frank Herbert', 'A science fiction novel set in the distant future', 13.99, 'https://images.unsplash.com/photo-1589739900266-43b2843f4c12?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 40, 3, FALSE),
('The Hobbit', 'J.R.R. Tolkien', 'A fantasy novel and children''s book', 12.99, 'https://images.unsplash.com/photo-1629992101753-56d196c8aabb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 35, 1, FALSE),
('Becoming', 'Michelle Obama', 'A memoir by the former First Lady of the United States', 16.99, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=60', 30, 5, FALSE);

-- Insert a sample admin user (password: admin123)
INSERT INTO users (username, email, password, full_name, role) VALUES
('admin', 'admin@bookstore.com', '$2a$10$7JXzGGGJH.vO1HGKJ5QZAu.UlGl9VlDB1DmwbRrKXhNQJJUYvlG8.', 'Admin User', 'admin');

-- Insert a sample customer (password: customer123)
INSERT INTO users (username, email, password, full_name, address, phone, role) VALUES
('customer', 'customer@example.com', '$2a$10$xDQSVUGf/9nJZ7r6xjAeT.DMrwEcLiXM6sYOKQD3mvjGPP.BcHYxa', 'John Doe', '123 Main St, Anytown, USA', '555-123-4567', 'customer');