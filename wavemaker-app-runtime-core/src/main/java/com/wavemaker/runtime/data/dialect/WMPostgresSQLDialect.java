package com.wavemaker.runtime.data.dialect;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.dialect.PostgreSQL82Dialect;

/**
 * @author Dilip Kumar
 * @since 19/4/16
 */
public class WMPostgresSQLDialect extends PostgreSQL82Dialect {

    /**
     * PostgresDialect not handling cases where table or columns names in mixed or upper case.
     * <p>
     * Issues like: whenever any table/column name in non lower case, those are wrapped in double quotes (").
     * <p>
     * In these cases invalid IdentitySelectString got generated like: "select currval('schema."Table"_"COLUMN"_seq'),
     * it should be generated as "select currval('schema."Table_COLUMN_seq"')"
     *
     * @param table  name of the table, including schema
     * @param column name of the column
     * @param type   type
     * @return "select currval('schema.table_column_seq')" or "select currval('schema."TABLE_COLUMN_seq"')
     */
    @Override
    public String getIdentitySelectString(String table, String column, int type) {
        StringBuilder sb = new StringBuilder();

        sb.append("select currval('");

        String[] tableAndSchema = table.split("\\.");
        int tableIndex = 0;
        if (tableAndSchema.length > 1) {
            sb.append(tableAndSchema[tableIndex++]); // appending schema name
            sb.append(".");
        }
        String tableName = tableAndSchema[tableIndex];

        boolean quoted = false;
        if (StringUtils.contains(tableName, "\"") || StringUtils.contains(column, "\"")) {
            quoted = true;
        }

        if (quoted) {
            sb.append("\"");
        }

        sb.append(tableName.replace("\"", ""))
                .append("_")
                .append(column.replace("\"", ""));

        sb.append("_seq");

        if (quoted) {
            sb.append("\"");
        }

        sb.append("')");

        return sb.toString();
    }

}