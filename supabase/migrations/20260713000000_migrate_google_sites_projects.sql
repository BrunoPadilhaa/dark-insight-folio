-- Migrate projects from the old Google Sites BI portfolio
-- (https://sites.google.com/view/biprojectsportfolio/home-page) into public.projects.

-- 1. Widen the category CHECK constraint to match every option already offered
--    by the admin form (src/components/admin/ProjectForm.tsx). Previously it only
--    allowed 'power-bi' | 'dbt' | 'sql', which meant several form options could
--    never actually be saved.
ALTER TABLE public.projects DROP CONSTRAINT IF EXISTS projects_category_check;
ALTER TABLE public.projects ADD CONSTRAINT projects_category_check
  CHECK (category IN ('power-bi','dbt','sql','python','web-development','data-analysis','machine-learning','other'));

-- 2. Insert the 13 migrated projects. display_order continues after whatever
--    already exists in the table rather than hardcoding numbers.
INSERT INTO public.projects
  (title, description, category, tags, image, link, github, featured, display_order, has_details, details_content, published)
VALUES

-- SQL

(
  'Flat File to a SQL Server Data Warehouse',
  'Loaded raw employee data from a flat CSV file into a SQL Server data warehouse using a star schema, with eight dimension tables and a surrogate-keyed fact table populated via BULK INSERT and MERGE statements.',
  'sql',
  ARRAY['SQL Server','T-SQL','Star Schema','ETL','BULK INSERT'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d2corn7ZJcIOOjh0Mnh-5o0k4F52M77oZ76O6lpSSe0zVxBNjDcl-uGz0uTTYSPZrqPJ3L0EAmM_KOJWw6lcG0numceNUUCki9enEHKYRiY5v5tg8KZfDsR8tIV1FGtcH5p593EtB2b6pj1A7v04Dn8gNuVLxhKswwCLnBLbMpytlgPno-OxYqY3VhjtDRroaKKYmNqe0HEIwVcP1OvGbyx-CynTmmvntzBEGhCunM=w1280',
  NULL,
  'https://github.com/BrunoPadilhaa/SQL/blob/9d7d1eb407605a9dc14e730d76a5b1071583d2b8/SP_LoadCSV.sql',
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 1,
  true,
  '# Flat File to a SQL Server Data Warehouse

Demonstrates transferring employee data from a CSV file into a SQL Server relational database using a star schema design. The source data was denormalized into dimension and fact tables to support analytical queries, staged in a temporary table, then loaded via MERGE statements.

## Technologies
- SQL Server
- T-SQL (Transact-SQL)
- CSV file format
- BULK INSERT

## Step-by-Step Process
1. **Data Analysis** - examined the source CSV file structure.
2. **Schema Design** - developed a star schema model, identifying dimension vs. fact fields.
3. **Staging** - created a temporary table to hold raw CSV data via BULK INSERT.
4. **Dimension Tables** - built eight dimension tables: dim_Citizenship, dim_ContractType, dim_Department, dim_MaritalStatus, dim_Position, dim_Race, dim_Shift, dim_Situation.
5. **Key Generation** - used SQL Server IDENTITY property to auto-generate surrogate keys.
6. **Data Population** - used MERGE statements for idempotent inserts/updates.
7. **Fact Table** - created fact_Employee with calculated fields (Age, AgeGroup, RetentionDays, RetentionDaysGroup).

## Screenshot
![Flat file to data warehouse project overview](https://sites.google.com/sitesv-images-rt/ACHe0d2corn7ZJcIOOjh0Mnh-5o0k4F52M77oZ76O6lpSSe0zVxBNjDcl-uGz0uTTYSPZrqPJ3L0EAmM_KOJWw6lcG0numceNUUCki9enEHKYRiY5v5tg8KZfDsR8tIV1FGtcH5p593EtB2b6pj1A7v04Dn8gNuVLxhKswwCLnBLbMpytlgPno-OxYqY3VhjtDRroaKKYmNqe0HEIwVcP1OvGbyx-CynTmmvntzBEGhCunM=w1280)

## Source
[SP_LoadCSV.sql on GitHub](https://github.com/BrunoPadilhaa/SQL/blob/9d7d1eb407605a9dc14e730d76a5b1071583d2b8/SP_LoadCSV.sql)',
  true
),

(
  'Data Cleaning - Supermarket Sales Data',
  'Applied SQL-based data quality techniques to a raw supermarket sales dataset: removed duplicates, standardized capitalization and gender codes, stripped currency symbols, normalized dates, and loaded the cleaned data via a stored procedure.',
  'sql',
  ARRAY['SQL Server','T-SQL','Data Cleaning','Data Quality'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d3UmaKi0jza9R3rNmkwB-B9hZKf8zhugosa8I-kzvsEvp8iuUa8qEoxQpkwXAEvESe9h-QGr_C0ub9J0DbmYENe8_CHD6h0Mu6Us3BjVZ5fvtdbLa92cIi5AbDzhJxgxfJQZ33zMNg5AGrZ_Hx1qHVJkSeTPxrLFdgy3qnmuzCuEfqWolSTIVnVeuoK-T7w3oFQsYn3xUTFzHXH1sJKXwTeiHcb3_gC__ygBduJ=w1280',
  NULL,
  'https://github.com/BrunoPadilhaa/SQL/blob/9d7d1eb407605a9dc14e730d76a5b1071583d2b8/Cleaning%20Data.sql',
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 2,
  true,
  '# Data Cleaning - Supermarket Sales Data

A SQL-based project demonstrating data quality techniques applied to supermarket sales information: identifying and removing duplicate records, standardizing text capitalization, converting gender values to uniform codes, eliminating currency symbols from numeric fields, normalizing date formats, and converting numeric fields to appropriate types. All cleaned data is loaded into a SQL Server target table via a stored procedure.

## Technologies
- SQL Server
- T-SQL (UPPER, LOWER, SUBSTRING, CHARINDEX, CASE, REPLACE, CAST, ROUND)

## Key Steps
1. **Duplicate Removal** - identified and eliminated duplicate invoiceID records.
2. **Consistent Capitalization** - standardized mixed-case values in customer names, product lines, and payment methods.
3. **Gender Standardization** - converted gender values to a uniform M/F format with CASE statements.
4. **Currency Symbol Removal** - stripped currency symbols from unitPrice and converted to FLOAT.
5. **Date Conversion** - normalized multiple date formats into a single datetime format.
6. **Numeric Type Conversion** - applied CAST and ROUND to standardize tax, total, and COGS columns.
7. **Data Loading** - encapsulated the cleaning logic into a stored procedure that loads the processed data into the target table.

## Screenshot
![Supermarket sales data cleaning project overview](https://sites.google.com/sitesv-images-rt/ACHe0d3UmaKi0jza9R3rNmkwB-B9hZKf8zhugosa8I-kzvsEvp8iuUa8qEoxQpkwXAEvESe9h-QGr_C0ub9J0DbmYENe8_CHD6h0Mu6Us3BjVZ5fvtdbLa92cIi5AbDzhJxgxfJQZ33zMNg5AGrZ_Hx1qHVJkSeTPxrLFdgy3qnmuzCuEfqWolSTIVnVeuoK-T7w3oFQsYn3xUTFzHXH1sJKXwTeiHcb3_gC__ygBduJ=w1280)

## Source
[Cleaning Data.sql on GitHub](https://github.com/BrunoPadilhaa/SQL/blob/9d7d1eb407605a9dc14e730d76a5b1071583d2b8/Cleaning%20Data.sql)',
  true
),

-- SSIS

(
  'Staging to Data Warehouse',
  'Built an SSIS ETL process consolidating staging table data into a dimensional data warehouse, implementing Slowly Changing Dimension (Type 2) tracking, surrogate key mapping, and full execution logging.',
  'sql',
  ARRAY['SSIS','SQL Server','ETL','SCD Type 2','Dimensional Modeling'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d0C7McyXcGs4Mte94swjaX_Yff9GLsgL1-3sbbzDduUUC7Vkyx0YJzT9LGSR1ohDFA_YK_ew_k6ViM6fFnRy16T0M8sHHLLxTi7GRIZ6L_Q0vKAopnl0bvDiSyBrfbDfhdoexwbuQKohcTf-y5E7I9tumZkKpMa5lO0hBvWNgUk0oGEd-3fN0UptsY32YUUBU1vNreOJlgzr9qhRTSh8BtsgV7LO3DE9_Sx7KVwGSI=w1280',
  NULL,
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 3,
  true,
  '# Staging to Data Warehouse

An enterprise data integration project orchestrating an ETL process that consolidates staging table data into a structured data warehouse, moving raw data through transformation layers while maintaining dimensional integrity and historical tracking.

## Technologies
- SQL Server
- SSIS (SQL Server Integration Services)
- T-SQL stored procedures
- Dimensional Modeling (Slowly Changing Dimensions Type 2)

## Step-by-Step Process
1. **Date Dimension Population** - a stored procedure generates day/month/year attributes into dim_date.
2. **Dimension Loading** - each SSIS package logs its execution (PackageStart/PackageEnd), extracts staging data, and applies an SCD Type 2 task that routes new records to a Union All and updated records through Historical Attribute Inserts, tracking ValidFrom/ValidTo dates.
3. **Fact Table Loading** - fact_sales is loaded via a stored procedure that maps natural keys to surrogate keys, filters by date range for incremental loading, and respects SCD2 validity dates in its joins.

## Validation
A test update to a customer record confirmed the SCD logic: the log table recorded one updated record, a new surrogate key was generated, and the previous record was marked with a ValidTo date.

## Screenshot
![Staging to data warehouse project overview](https://sites.google.com/sitesv-images-rt/ACHe0d0C7McyXcGs4Mte94swjaX_Yff9GLsgL1-3sbbzDduUUC7Vkyx0YJzT9LGSR1ohDFA_YK_ew_k6ViM6fFnRy16T0M8sHHLLxTi7GRIZ6L_Q0vKAopnl0bvDiSyBrfbDfhdoexwbuQKohcTf-y5E7I9tumZkKpMa5lO0hBvWNgUk0oGEd-3fN0UptsY32YUUBU1vNreOJlgzr9qhRTSh8BtsgV7LO3DE9_Sx7KVwGSI=w1280)',
  true
),

(
  'OLTP to Staging',
  'Built an SSIS ETL pipeline extracting customer, product, and sales data from an OLTP database into staging tables, implementing both full and incremental load strategies with full audit logging.',
  'sql',
  ARRAY['SSIS','SQL Server','ETL','Incremental Load','Audit Logging'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d1XgpX-OAkzIYxj8eKm2FetF_KuMtrbP5y_0RIbh5fnPjYuD4g1w33V2ISse3hL1UhZy_Xrg81fnYdMPbeKxQbUTbckbH0_NQzVlkEkWE-wKmxmVij4AB_YyJqskSYgBEReIAB1wF8YqM_F9lrdgNZZ313laDBi2XoxaICnXj0svt97uCdLaYwNMZrQLS56MJ4EyChd4Xr8ryXxIFSZoLGnrzcPkOwhdbcCgjWx0Lg=w1280',
  NULL,
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 4,
  true,
  '# OLTP to Staging

An ETL pipeline that extracts data from an OLTP sales database and loads it into staging tables using SQL Server Integration Services (SSIS), demonstrating data transformation techniques and both full and incremental load strategies for scalability.

## Technologies
- SQL Server (OLTP source)
- SSIS (SQL Server Integration Services)
- T-SQL (transformations and stored procedures)
- Audit/logging framework

## Packages Built
- **dim_customer** - merges customer and address data, concatenates names, standardizes gender values, and routes unmatched lookups to an error table. Loaded 157 customer records.
- **dim_product** - converts product descriptions from uppercase to Camel Case via a stored procedure.
- **fact_sales (Full Load)** - truncates the target table and loads all transaction data on first run, recording the max LastModifiedDate in a configuration table.
- **fact_sales (Incremental Load)** - reads the last load date from the configuration table and loads only records modified since then, successfully loading 1,537 new records on a later run.

## Design Notes
Full loads are used for initial setup; incremental loads run on a regular schedule, filtering source data by LastModifiedDate so large fact tables do not need to be reloaded entirely just to pick up new entries. Every package run is captured in an audit table (user, timestamp, record counts, load type), and unmatched lookup rows are routed to an error table for later remediation.

## Screenshot
![OLTP to staging project overview](https://sites.google.com/sitesv-images-rt/ACHe0d1XgpX-OAkzIYxj8eKm2FetF_KuMtrbP5y_0RIbh5fnPjYuD4g1w33V2ISse3hL1UhZy_Xrg81fnYdMPbeKxQbUTbckbH0_NQzVlkEkWE-wKmxmVij4AB_YyJqskSYgBEReIAB1wF8YqM_F9lrdgNZZ313laDBi2XoxaICnXj0svt97uCdLaYwNMZrQLS56MJ4EyChd4Xr8ryXxIFSZoLGnrzcPkOwhdbcCgjWx0Lg=w1280)',
  true
),

(
  'CSV Files to Data Warehouse Table',
  'Automated an SSIS pipeline that loads CSV files into a data warehouse with change detection, so only new files are processed after the initial load.',
  'sql',
  ARRAY['SSIS','SQL Server','ETL','Incremental File Loading'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d2XeylNbMoDoR3B0dsWyAjMZC9PTE64SeQJMiX68WhfCRqL5ZivUzJBHco_09FVgc4MDYwX6LfhsPmIKXbz0f8iUC8bgY0UY_rTvTSvn7TWj5JGjTJhtucpuepSLjirrzsD7DhbzFOb3aactYe5hIlEoT_zLK8aSAi0mWIVwbKBbNOKlloaGF8rIe8Kqy0pWwtkjFeP3RpHwPEGNGo-Pra87KCsnjW2Sub66Nqiszs=w1280',
  NULL,
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 5,
  true,
  '# CSV Files to Data Warehouse Table

An SSIS project that automates the extraction and loading of CSV files into a data warehouse with intelligent change detection: all files load on the first execution, and subsequent executions load only new files, ignoring previously loaded data.

## Technologies
- SQL Server Integration Services (SSIS)
- SQL Server
- T-SQL

## Schema
- **stg.Employees** - staging table
- **dw.Employees** - data warehouse table (same schema as staging)
- **dbo.tbl_logs** - logs step name, file name, records inserted, and timestamp

## Step-by-Step Process
1. **Truncate Staging Table** - clears stg.Employees before each execution.
2. **For Loop Container** - iterates over files in the source folder.
3. **IsFileLoaded Check** - queries tbl_logs to determine whether a file was already processed; a precedence constraint only proceeds when the file is new.
4. **Load Staging** - imports the flat file into staging and captures the row count.
5. **Load Data Warehouse** - transfers records from staging into dw.Employees.
6. **Logging** - records filename, record count, and timestamp in tbl_logs.

## Results
- First run (3 files): 1,050 records loaded into staging and the warehouse, 3 log entries created.
- Second run (no new files): halted at the IsFileLoaded check, no duplicate records processed.
- Third run (2 new files): only the new files were processed, bringing the warehouse to 1,643 total records.

## Screenshot
![CSV files to data warehouse project overview](https://sites.google.com/sitesv-images-rt/ACHe0d2XeylNbMoDoR3B0dsWyAjMZC9PTE64SeQJMiX68WhfCRqL5ZivUzJBHco_09FVgc4MDYwX6LfhsPmIKXbz0f8iUC8bgY0UY_rTvTSvn7TWj5JGjTJhtucpuepSLjirrzsD7DhbzFOb3aactYe5hIlEoT_zLK8aSAi0mWIVwbKBbNOKlloaGF8rIe8Kqy0pWwtkjFeP3RpHwPEGNGo-Pra87KCsnjW2Sub66Nqiszs=w1280)',
  true
),

-- Azure

(
  'End-to-End Data Pipeline in Azure with Data Lake and SQL Server',
  'Implemented a medallion architecture in Azure Data Factory, moving monthly sales CSVs through Bronze (raw Parquet), Silver (cleaned SQL Server tables), and Gold (star schema) layers.',
  'other',
  ARRAY['Azure Data Factory','Azure Data Lake','Medallion Architecture','SQL Server','Parquet'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d1A4KrTjq3LLU3Ne9gkZCJvJOFXKb8dKIsCuczsk1nGmo5-2dKxA1vD5_QOj1x_NFVVlVpUWuwkV8IWlGDf6PssvMwWDszucKEaHQYzPaHwb-7CjjLW1Cyxr1AYtKHmsjT9QZWEQidA2r6nob5WNIFT9K5SrbszRLNAjmFW37PNe3iFnDqHuNoYZkMTSdsZqeEdun3s8gelNUeh8RNEKDYE0eTAlapos387V_5u=w1280',
  NULL,
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 6,
  true,
  '# End-to-End Data Pipeline in Azure with Data Lake and SQL Server

Implements a medallion architecture pattern to process sales data through three layers: Bronze (raw data in Azure Data Lake), Silver (cleaned data in SQL Server), and Gold (star schema in SQL Server), transforming monthly CSV sales files into a production-ready analytical model.

## Technologies
- Azure Data Factory
- Azure Data Lake
- SQL Server
- Parquet format
- T-SQL stored procedures

## Step-by-Step Process
1. **Bronze Layer** - deletes existing Bronze files, copies raw CSVs into the Bronze folder, adds FileName and LoadDate tracking columns, and stores the result as Parquet.
2. **Silver Layer** - copies Bronze data into a staging table, then a stored procedure converts types (OrderID to INT, Product to VARCHAR), splits PurchaseAddress into Street/City/State/ZipCode, removes duplicates with ROW_NUMBER() over OrderID and Product, and filters out header rows.
3. **Gold Layer** - dimension staging procedures load Product, Address, and FileSource; a SalesOrderFact procedure builds the fact table; a final LoadDataIntoGold procedure performs upsert operations (update existing, insert new).

## Screenshot
![Azure medallion architecture pipeline overview](https://sites.google.com/sitesv-images-rt/ACHe0d1A4KrTjq3LLU3Ne9gkZCJvJOFXKb8dKIsCuczsk1nGmo5-2dKxA1vD5_QOj1x_NFVVlVpUWuwkV8IWlGDf6PssvMwWDszucKEaHQYzPaHwb-7CjjLW1Cyxr1AYtKHmsjT9QZWEQidA2r6nob5WNIFT9K5SrbszRLNAjmFW37PNe3iFnDqHuNoYZkMTSdsZqeEdun3s8gelNUeh8RNEKDYE0eTAlapos387V_5u=w1280)',
  true
),

(
  'Data Processing Workflow with Medallion Architecture',
  'A companion medallion-architecture pipeline in Azure Data Factory that filters, deduplicates, and splits address fields in the Silver layer, then builds a Gold-layer star schema with joined dimension lookups.',
  'other',
  ARRAY['Azure Data Factory','Azure Data Lake','Medallion Architecture','Star Schema'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d0OZ3zTAf90qWELN_X2QAmzpq2b5gp-0gLItHHhOQ0essxPAC9hA41-r3b1LTMVbXZ1AK6b7e7dcZzKOnq52vcZrOAZ9VN9Tmx-UyrPNMNNVmOoESJnXoDQKYFf0jU6yjSMQg5HIn4eaX1_7BMsS1Qrze8WVT021YFEfV5IAgctqBtV0wWv-SUiAXBOWzqo1YvoxFb2b2uDSCRKR2UKQ9IBHCOus9SUBlbwVA4_rLs=w1280',
  NULL,
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 7,
  true,
  '# Data Processing Workflow with Medallion Architecture

Implements a three-tier Bronze/Silver/Gold architecture that progressively enhances data quality, transforming raw CSV sales files into a structured star schema suitable for analytics.

## Technologies
- Azure Data Factory
- Azure Data Lake
- Parquet format
- SQL-based transformations

## Step-by-Step Process
1. **Bronze Layer** - reads source CSVs, appends a LoadDate column, strips spaces from column names, and sinks the result as Parquet.
2. **Silver Layer** - validates OrderID values, removes duplicate rows, converts columns to their proper data types, splits PurchaseAddress into Street/City/State/ZipCode, and selects only the needed columns.
3. **Gold Layer** - builds Product, PurchaseAddress, and FileSource dimension tables with generated surrogate IDs, then builds the SalesOrder fact table via left outer joins against each dimension and a derived Quantity times Price calculation. The orchestration pipeline runs all dimension flows first, then the fact flow.

## Screenshot
![Medallion architecture data flow overview](https://sites.google.com/sitesv-images-rt/ACHe0d0OZ3zTAf90qWELN_X2QAmzpq2b5gp-0gLItHHhOQ0essxPAC9hA41-r3b1LTMVbXZ1AK6b7e7dcZzKOnq52vcZrOAZ9VN9Tmx-UyrPNMNNVmOoESJnXoDQKYFf0jU6yjSMQg5HIn4eaX1_7BMsS1Qrze8WVT021YFEfV5IAgctqBtV0wWv-SUiAXBOWzqo1YvoxFb2b2uDSCRKR2UKQ9IBHCOus9SUBlbwVA4_rLs=w1280)',
  true
),

-- Python

(
  'CSV to SQL: Extract, Clean, and Load',
  'Used Python, Pandas, and SQLAlchemy to extract, clean, and load a Kaggle audiobook dataset into SQL Server, standardizing durations, dates, ratings, and text fields.',
  'python',
  ARRAY['Python','Pandas','SQLAlchemy','Data Cleaning','ETL'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d197t1cZc_uiE5EH4EsHV1yRXGwRCvZHXuxGimCy9JOBEwORk_-psdY4zosZPjW0WnxaCOdZeAMo67oK17_Zgoa1PEEi7uoNU7j6eJHeI8YjkrJMpV-HBJeR9OhmRXt8QalnNiH3sjfDtTYx_N4XtH9_F7af-8d7yJdzJaSRY3Ihi7dR7l2EANVoQ5lGg9ykb9N1Qapk5uRjr_YiOKULIIalkisQiZMaTsdlkcI1sQ=w1280',
  NULL,
  'https://github.com/BrunoPadilhaa/Python/blob/main/audiobook_cleaning.ipynb',
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 8,
  true,
  '# CSV to SQL: Extract, Clean, and Load

Demonstrates an ETL workflow using Python to process audiobook market data from the Kaggle Audible dataset (Title, Author, Narrator, Duration, Release Date, Language, Ratings, Price, Review Count), covering extraction, comprehensive data cleaning, and loading into SQL Server.

## Technologies
- Python
- Pandas
- SQLAlchemy
- SQL Server

## Step-by-Step Process
1. **Database Connection** - connect to a pre-created SQL Server table via SQLAlchemy.
2. **Extraction** - load the CSV file into a Pandas DataFrame.
3. **Assessment** - review each column to identify needed transformations.
4. **Cleaning**:
   - Verified completeness (no missing values).
   - Stripped Writtenby: and Narratedby: prefixes from Author/Narrator.
   - Converted duration text (for example, 2 hrs and 20 mins) into a standardized HH:MM format.
   - Standardized release dates to YYYY-MM-DD.
   - Split the Stars column into separate rating and review-count fields, converting to numeric and handling nulls.
   - Removed text descriptors from ratings, converting to numeric with missing values replaced by zero.
5. **Loading** - inserted the cleaned dataset into SQL Server via SQLAlchemy.

## Data Quality Dimensions Applied
Completeness, consistency, accuracy, uniqueness, and validity.

## Source
[audiobook_cleaning.ipynb on GitHub](https://github.com/BrunoPadilhaa/Python/blob/main/audiobook_cleaning.ipynb)

## Screenshot
![Audiobook data cleaning project overview](https://sites.google.com/sitesv-images-rt/ACHe0d197t1cZc_uiE5EH4EsHV1yRXGwRCvZHXuxGimCy9JOBEwORk_-psdY4zosZPjW0WnxaCOdZeAMo67oK17_Zgoa1PEEi7uoNU7j6eJHeI8YjkrJMpV-HBJeR9OhmRXt8QalnNiH3sjfDtTYx_N4XtH9_F7af-8d7yJdzJaSRY3Ihi7dR7l2EANVoQ5lGg9ykb9N1Qapk5uRjr_YiOKULIIalkisQiZMaTsdlkcI1sQ=w1280)',
  true
),

-- Power BI

(
  'Toy Sales Dashboard',
  'Provides a snapshot of sales performance, showing revenue, items sold, and profit margins, with a focus on top customers and profitable products to analyze cost impact.',
  'power-bi',
  ARRAY['Power BI','DAX','Sales Analytics'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d0yTbxAVocwjh9AIzMDowratSZWr6RdG1ohdl3ZoF9KVnnvzvb5mLrDA283DMbcUpGVTW_elXI_1TNczvPmkrh-HHMeDQi6j4BpAQCWt9YldNwdI4Ffr4pUZi14jyfv8QBjK0qJNy_WZvWhn0SxsHUnODtctOKePGS73x2o4DORFxrcHFMj6O1-QhhKHTgPwlR_2QmvfnffR4YyqPvN6xvPpORqZzYvq06Cv0ej0Ww=w1280',
  'https://app.powerbi.com/view?r=eyJrIjoiYjIzYmJlMDUtYjBmOS00ZDQxLTgwMDYtYTMxODVlMDhmYTI3IiwidCI6IjFkN2U1YTdiLTEwNjQtNDFlMC1hMTYyLWViYjVhYjJjMWQ3NCIsImMiOjl9',
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 9,
  false,
  NULL,
  true
),

(
  'Formula 1 Data Analysis',
  'Explores race distributions, team performance, and driver statistics across Formula 1 seasons through key data and statistics.',
  'power-bi',
  ARRAY['Power BI','DAX','Sports Analytics'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d1EIuZ2F3DxlrDs31NyGhT8xRoDyoWUL95vWjzM2NXOH1YIVHkYD_gmVW05tfjV2DkpEi-ICn1xX7GPrL_PyjsSJcpEkrrAAIwTz6GDDp4yiAcw5-AxtWfzSpRolD8z1xNcfF34GnSW2MoGKrMirYbI3uGBpARk2YK0jWK4PQ2nbgsBAUyzq1U4hLXK2F8EityYMeyhAxt-HHZnE-vCpXPG-JoaH-3L6_nIfGX2=w1280',
  -- TODO: this is a private "groups/me/reports" workspace URL tied to the owner
  -- account Power BI login, not a public share link like the other four
  -- dashboards below. Replace with a public "app.powerbi.com/view?r=..." share
  -- link before relying on it to work for anonymous site visitors.
  'https://app.powerbi.com/groups/me/reports/d4e1cd13-ae4c-4a65-989a-80180a4ea19a/ReportSection86e4a3f4da33095da635?experience=power-bi',
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 10,
  false,
  NULL,
  true
),

(
  'Movies Analysis',
  'An industry dashboard exploring revenue trends, the impact of top actors, and genre preferences in the movie business.',
  'power-bi',
  ARRAY['Power BI','DAX','Entertainment Analytics'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d1Be8zMcLzgbBmDi6gktgbEWS_XHr1u9S7ZQteUAj1kmxszDzwyQTSpKeNztXeYvhabR3NudiyIiS6jfAEsIQ3WZ18JZ1l5RXBZHcEAygtq_dpRi44UyzjLcjo0VO5zSO__-50XvGuTJYNXmSGVWR8tHPU7s2dTdBZEB0kNiOsX6Hm8vzM_7SQXF8wjfKUqIRExLAqGdLlBPA7YlP1Vz15_6ysqHeViV7mzI_VB=w1280',
  -- TODO: the source site currently points both "Movies Analysis" and "Sales
  -- Dashboard" at this same report URL. Likely a pre-existing bug on the old
  -- site (not an extraction error here). Verify and replace with the correct
  -- Movies Analysis share link.
  'https://app.powerbi.com/view?r=eyJrIjoiZDMwMDAyYzMtOTVkOS00MzY2LTg0OTMtZmUyMjU3ZTNiNzAyIiwidCI6IjFkN2U1YTdiLTEwNjQtNDFlMC1hMTYyLWViYjVhYjJjMWQ3NCIsImMiOjl9',
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 11,
  false,
  NULL,
  true
),

(
  'Sales Dashboard',
  'Tracks monthly revenue trends, product type revenue breakdown, top-performing salespeople, and profit margin analysis for operational decisions.',
  'power-bi',
  ARRAY['Power BI','DAX','Sales Analytics'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d0A1sABoJkCxxaYsWy0nB8Xs16e-NZAaA2NKeloQ8PD72UNVRirNVVTLZbc1CpiSwuf1WncUGzDi0n8m2kB1LpENnwKEnkLoRQ0uxVEb-W6uasB-cdwJFZnXGjh1WTGcgfKXCXWe1zB6uwR9uKn3cYWPmdMdofr24N5E87Wxu1GL-3IZnHLUZZLiZEMeqMN99DXyjmSkeotFAAVn3NBdk28CNZsi3JpWIsL9biX=w1280',
  -- TODO: the source site currently points both "Sales Dashboard" and "Movies
  -- Analysis" at this same report URL. Likely a pre-existing bug on the old
  -- site (not an extraction error here). Verify and replace with the correct
  -- Sales Dashboard share link.
  'https://app.powerbi.com/view?r=eyJrIjoiZDMwMDAyYzMtOTVkOS00MzY2LTg0OTMtZmUyMjU3ZTNiNzAyIiwidCI6IjFkN2U1YTdiLTEwNjQtNDFlMC1hMTYyLWViYjVhYjJjMWQ3NCIsImMiOjl9',
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 12,
  false,
  NULL,
  true
),

(
  'Inventory Management Dashboard',
  'Presents inventory cost trends, product-specific quantity levels, and cost distribution by product group for optimization insights.',
  'power-bi',
  ARRAY['Power BI','DAX','Inventory Analytics'],
  'https://sites.google.com/sitesv-images-rt/ACHe0d1sfS7wpWMe236qsaR9Hv2e5t8UGGMRMiqlupMGjmOLir2IejAakh3nKpDVJygWyCVgwc0A9qdDoCZpp6R8yvuoSLLTjDyQLNK0CtuZIYPurSPkMQRqPmM6e0LwdTENQeLZ1J39X0mfndl4sOVdDAdgKJFnp4K_waWokwBMjsJt0mtdxouacAledUl4SK3bqhVUkABQswuNY5qUE0z8kllzWdrMRL0WDzeaCAb8EbI=w1280',
  'https://app.powerbi.com/view?r=eyJrIjoiMmFkZjI2MjItNWM0ZS00YWUwLWI3ZDAtMzJmMzQwNDE4ZWMyIiwidCI6IjFkN2U1YTdiLTEwNjQtNDFlMC1hMTYyLWViYjVhYjJjMWQ3NCIsImMiOjl9',
  NULL,
  false,
  (SELECT COALESCE(MAX(display_order), 0) FROM public.projects) + 13,
  false,
  NULL,
  true
);
