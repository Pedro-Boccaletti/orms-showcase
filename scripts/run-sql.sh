#!/bin/bash

# Check if SQL file argument is provided
if [ $# -eq 0 ]; then
    echo "Usage: $0 <sql-file>"
    exit 1
fi

SQL_FILE="$1"

# Check if file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: File '$SQL_FILE' not found"
    exit 1
fi

# Set environment variables for database connection
export PGPASSWORD="${DB_PASSWORD}"

# Run the SQL file with psql (adjust connection parameters as needed)
psql -U "$DB_USERNAME" -d "$DB_DATABASE" -h "$DB_HOST" -f "$SQL_FILE"