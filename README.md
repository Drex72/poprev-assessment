# Poprev Assessment

invest
## Prerequisites


**Postman Documentation**: Make sure you have Postman Documentation. You can get it from [Postman Documentation](https://documenter.getpostman.com/view/26382814/2s9YJW6m9z
).

Before you begin, ensure you have the following installed:

1. **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).

2. **PostgreSQL**: You need a PostgreSQL database to store product data. You can download and install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/), or you can use an existing PostgreSQL instance.


## Setup

1. **Database Setup**:

   If you have PostgreSQL installed, follow these steps:

   - Create a PostgreSQL database named `poprev_db`.
   - Make sure you have a user with appropriate privileges for this database.

2. **Clone the Repository**:

   Clone this repository to your local machine:

   ```bash
   git clone https://github.com/Drex72/poprev-assessment
   ```

3. **Navigate to the Project Directory:**:

   Clone this repository to your local machine:

   ```bash
   cd poprev-assessment
   ```

4. **Install Dependencies:**:

   Clone this repository to your local machine:

   ```bash
   npm install
   ```

## Running the Service

### Using Node.js and PostgreSQL



1. **Database Configuration**:

   - Make sure you have a PostgreSQL database named `poprev_db`.
   - Copy the `.env.example` to the `.env` file
   - Update the configuration in the `env` file .

2. **Database Configuration**:

   Start the microservice in development mode using the following command:

   ```bash
   npm run start:dev
   ```

   This will start the microservice using Node.js and connect it to the PostgreSQL database.

### Using Docker
1. **Database Configuration**:

   Start the microservice in development mode using the following command:

   ```bash
   docker-compose up
   ```

   This will start the microservice using Docker.

## Configuration

The default configuration for the microservice and database connection is set up through the `docker-compose.yml` file. If you need to adjust any configurations, you can do so in this file.

## License

MIT

