import { ConfigService } from '@nestjs/config';
import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import * as schema from './schema';
import { Pool } from 'pg';

export const DrizzleProvider = 'DrizzleProvider';

export const drizzleProvider = [
  {
    provide: 'DrizzleProvider',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dbHost = configService.get<string>('DB_HOST');
      const dbPort = configService.get<number>('DB_PORT');
      const dbUser = configService.get<string>('DB_USERNAME');
      const dbPassword = configService.get<string>('DB_PASSWORD');
      const dbName = configService.get<string>('DB_DATABASE');

      const connectionString = `postgresql://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;

      const pool = new Pool({
        connectionString,
      });

      // Test the connection
      try {
        console.log('🔌 Testing database connection...');
        const client = await pool.connect();

        // Test basic connectivity
        const result = await client.query(
          'SELECT NOW() as current_time, version() as db_version'
        );
        console.log('✅ Database connection successful!');
        console.log(`   Current time: ${result.rows[0].current_time}`);
        console.log(`   DB version: ${result.rows[0].db_version}`);

        // Test if our tables exist
        const tablesResult = await client.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public'
          ORDER BY table_name
        `);

        console.log(
          '📋 Available tables:',
          tablesResult.rows.map((row) => row.table_name)
        );

        if (tablesResult.rows.length === 0) {
          console.warn(
            '⚠️  No expected tables found. You may need to run migrations.'
          );
        }

        client.release();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        console.error('❌ Database connection failed:');
        console.error('\tError message:', error.message || error);
        if (error.code) {
          console.error('\tError code:', error.code);
        }
        if (error.detail) {
          console.error('\tError detail:', error.detail);
        }
        process.exit(1);
      }

      return drizzle(pool, {
        schema,
        logger: {
          logQuery: (q, p) => {
            console.log('🔍 Executing query:', q);
            if (p && p.length > 0) {
              console.log('📝 With parameters:', p);
            }
          },
        },
      }) as NodePgDatabase<typeof schema>;
    },
  },
];
