DROP TABLE IF EXISTS verification CASCADE;
DROP TABLE IF EXISTS datasets CASCADE;
DROP TABLE IF EXISTS calculations CASCADE;
DROP TABLE IF EXISTS graph_edges CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS analytics CASCADE;
DROP TABLE IF EXISTS errors CASCADE;
DROP TABLE IF EXISTS network_edges CASCADE;
DROP TABLE IF EXISTS network_nodes CASCADE;
DROP TABLE IF EXISTS packets CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS simulations CASCADE;

CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE calculations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    module VARCHAR(50) NOT NULL,
    operation VARCHAR(100) NOT NULL,
    input_data TEXT,
    result TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE datasets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER,
    name VARCHAR(255),
    values_json TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE graph_edges (
    id SERIAL PRIMARY KEY,
    graph_name VARCHAR(100),
    source_node VARCHAR(50),
    target_node VARCHAR(50),
    weight INTEGER
);

CREATE TABLE verification (
    id SERIAL PRIMARY KEY,
    calculation_id INTEGER,
    python_result TEXT,
    cpp_result TEXT,
    status VARCHAR(50)
);
