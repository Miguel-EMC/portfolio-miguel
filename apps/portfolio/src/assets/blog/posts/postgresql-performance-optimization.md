---
title: "PostgreSQL Performance Optimization Tips"
slug: "postgresql-performance-optimization"
excerpt: "Essential tips and tricks for optimizing PostgreSQL database performance including indexing strategies and query optimization."
author: "Miguel"
publishedAt: "2024-08-15T10:00:00.000Z"
category: "programming"
tags: ["PostgreSQL", "Database", "Performance", "SQL"]
coverImage: "/assets/img/blog/postgresql.jpg"
featured: false
published: true
---

# PostgreSQL Performance Optimization Tips

After years of working with PostgreSQL in production environments, I've compiled my most effective optimization strategies. These tips have helped me improve query performance by orders of magnitude.

## 1. Understanding EXPLAIN ANALYZE

The first step to optimization is understanding your queries:

```sql
EXPLAIN (ANALYZE, BUFFERS, FORMAT TEXT)
SELECT u.name, COUNT(o.id) as order_count
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at > '2024-01-01'
GROUP BY u.id
ORDER BY order_count DESC
LIMIT 10;
```

Key metrics to watch:
- **Execution time**: Total query time
- **Planning time**: Time to create execution plan
- **Buffers**: Memory usage
- **Rows**: Expected vs actual rows

## 2. Indexing Strategies

### B-tree Indexes (Default)

Best for equality and range queries:

```sql
-- Simple index
CREATE INDEX idx_users_email ON users(email);

-- Composite index (order matters!)
CREATE INDEX idx_orders_user_date ON orders(user_id, created_at DESC);

-- Partial index (smaller, faster)
CREATE INDEX idx_active_users ON users(email) WHERE status = 'active';
```

### GIN Indexes for JSONB

```sql
-- Full JSONB indexing
CREATE INDEX idx_metadata ON products USING GIN(metadata);

-- Path-specific index
CREATE INDEX idx_metadata_category ON products USING GIN((metadata->'category'));
```

### Index Maintenance

```sql
-- Check index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read
FROM pg_stat_user_indexes
ORDER BY idx_scan DESC;

-- Remove unused indexes
DROP INDEX IF EXISTS idx_rarely_used;

-- Rebuild bloated indexes
REINDEX INDEX CONCURRENTLY idx_users_email;
```

## 3. Query Optimization

### Avoid SELECT *

```sql
-- Bad
SELECT * FROM orders WHERE user_id = 123;

-- Good
SELECT id, total, status, created_at FROM orders WHERE user_id = 123;
```

### Use CTEs Wisely

```sql
-- Materialized CTE (computed once)
WITH active_users AS MATERIALIZED (
    SELECT id, name FROM users WHERE status = 'active'
)
SELECT au.name, COUNT(o.id)
FROM active_users au
JOIN orders o ON au.id = o.user_id
GROUP BY au.id, au.name;
```

### Batch Operations

```sql
-- Instead of multiple INSERTs
INSERT INTO logs (user_id, action, created_at)
VALUES 
    (1, 'login', NOW()),
    (2, 'logout', NOW()),
    (3, 'purchase', NOW());

-- Use COPY for bulk inserts
COPY users(name, email) FROM '/tmp/users.csv' WITH CSV HEADER;
```

## 4. Connection Pooling

Use PgBouncer for connection pooling:

```ini
[databases]
mydb = host=localhost dbname=mydb

[pgbouncer]
pool_mode = transaction
max_client_conn = 1000
default_pool_size = 50
min_pool_size = 10
```

## 5. Configuration Tuning

Key postgresql.conf settings:

```conf
# Memory
shared_buffers = 4GB              # 25% of RAM
effective_cache_size = 12GB       # 75% of RAM
work_mem = 256MB                  # Per operation
maintenance_work_mem = 1GB        # For VACUUM, CREATE INDEX

# Write Performance
wal_buffers = 64MB
checkpoint_completion_target = 0.9
max_wal_size = 4GB

# Query Planning
random_page_cost = 1.1            # For SSDs
effective_io_concurrency = 200    # For SSDs
```

## 6. Table Partitioning

For large tables, use partitioning:

```sql
-- Create partitioned table
CREATE TABLE events (
    id BIGSERIAL,
    event_type TEXT,
    created_at TIMESTAMPTZ NOT NULL
) PARTITION BY RANGE (created_at);

-- Create partitions
CREATE TABLE events_2024_01 PARTITION OF events
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE events_2024_02 PARTITION OF events
    FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Automatic partition creation (requires extension)
SELECT partman.create_parent(
    'public.events',
    'created_at',
    'native',
    'monthly'
);
```

## 7. Vacuum and Analyze

```sql
-- Manual vacuum
VACUUM ANALYZE users;

-- Check autovacuum status
SELECT 
    relname,
    last_vacuum,
    last_autovacuum,
    n_dead_tup,
    n_live_tup
FROM pg_stat_user_tables
ORDER BY n_dead_tup DESC;
```

## 8. Monitoring Queries

Find slow queries:

```sql
SELECT 
    query,
    calls,
    mean_exec_time,
    total_exec_time
FROM pg_stat_statements
ORDER BY total_exec_time DESC
LIMIT 10;
```

## Conclusion

PostgreSQL performance optimization is an ongoing process. Start with EXPLAIN ANALYZE to understand your queries, add appropriate indexes, and continuously monitor your database performance. These practices have helped me maintain sub-100ms response times even with millions of rows.
