# Digital World – Mathematical Analysis of Digital Data and Networks

## Abstract
Digital systems depend heavily on mathematical concepts. This project develops an interactive web application that demonstrates how mathematics is used to represent digital information, process logical decisions, analyze numerical data and model digital networks.

## Architecture
- **Frontend**: HTML, CSS, vanilla JavaScript
- **Backend**: Node.js, Express.js
- **Mathematical Engines**: Python (Number Systems, Boolean Logic, Matrices, Statistics) and C++ (Graph Theory/BFS)
- **Database**: NeonDB (PostgreSQL)

## Installation & Setup

1. **Install Dependencies**
   Navigate to the project root and run:
   ```bash
   npm install
   ```

2. **Database Setup (NeonDB)**
   - Use `database/schema.sql` to initialize your database tables on NeonDB.
   - Update `.env` with your NeonDB connection string:
     ```
     DATABASE_URL=postgres://user:password@hostname:5432/digitalworld
     PORT=3000
     ```

3. **C++ Engine Compilation**
   You need to compile the C++ graph engine before using the Graph Theory module.
   Navigate to the `cpp_engine` directory and compile it using your preferred compiler:
   ```bash
   # Windows (g++)
   g++ graph_engine.cpp -o graph_engine.exe
   
   # Linux/Mac
   g++ graph_engine.cpp -o graph_engine
   ```

4. **Run the Application**
   Start the Node.js server:
   ```bash
   node server/server.js
   ```
   Access the web app at `http://localhost:3000`.

## Modules

1. **Number Systems**: Converts between Decimal, Binary, and Hexadecimal, explaining the underlying positional notation formulas.
2. **Boolean Algebra**: Computes basic gates (AND, OR, NOT, XOR) and custom expressions with full truth tables.
3. **Matrices**: Performs addition, subtraction, transpose, and matrix multiplication using correct algebraic rules.
4. **Graph Theory**: Finds shortest paths (BFS) and node degrees in an unweighted graph network.
5. **Statistics**: Calculates mean, median, standard deviation, and variance for data sets.

## Viva Explanation
"Our project is called Digital World. It demonstrates how mathematics forms the foundation of digital systems. We implemented number systems, Boolean algebra, matrices, graph theory and statistics as interactive modules. HTML, CSS and JavaScript provide the interface, Node.js manages the backend APIs, Python performs mathematical calculations, C++ implements the graph algorithm, and NeonDB stores the calculation history."
