#!/bin/bash

# Get database name from argument or environment variable
if [ $# -gt 0 ]; then
    DB_DATABASE=$1
    echo "Using database name from argument: $DB_DATABASE"
elif [ -n "$DB_DATABASE" ]; then
    echo "Using database name from environment: $DB_DATABASE"
else
    echo "Error: Database name not provided."
    echo "Usage: $0 <database_name>"
    echo "Or set DB_DATABASE environment variable."
    exit 1
fi

# Check if required environment variables are set
if [ -z "$DB_HOST" ]; then
    echo "Error: DB_HOST environment variable is not set."
    exit 1
fi

if [ -z "$DB_PORT" ]; then
    echo "Error: DB_PORT environment variable is not set."
    exit 1
fi

if [ -z "$DB_USERNAME" ]; then
    echo "Error: DB_USERNAME environment variable is not set."
    exit 1
fi

if [ -z "$DB_PASSWORD" ]; then
    echo "Error: DB_PASSWORD environment variable is not set."
    exit 1
fi

# Export the password for psql command
export PGPASSWORD=$DB_PASSWORD

# Check if database exists
DB_EXISTS=$(psql -h $DB_HOST -p $DB_PORT -U $DB_USERNAME -lqt | cut -d \| -f 1 | grep -qw $DB_DATABASE; echo $?)

if [ $DB_EXISTS -ne 0 ]; then
    echo "Database $DB_DATABASE does not exist. Creating..."
    createdb -h $DB_HOST -p $DB_PORT -U $DB_USERNAME $DB_DATABASE
    echo "Database $DB_DATABASE created successfully."
else
    echo "Database $DB_DATABASE already exists."
fi