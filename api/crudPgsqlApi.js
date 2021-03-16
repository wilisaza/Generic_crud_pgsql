const {Pool} = require('pg');

const {sentences} = require('./crudPgsqlSentences');
const {functions} = require('./crudPgsqlFunctions');

let pool;
let setSchema;

let resWords = ['pags', 'offset', 'numrows', 'orderby']; //Array de palabras reservadas para ser excluidas del WHERE

const Api = {
    async getAll(table, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = `SELECT * FROM ${table}`;
            const res = await pool.query(sql);
            return res.rows || [];
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }

    },

    async getOne(table, where, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.filterString(table, where, resWords);
            const res = await pool.query(sql);
            return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getFiltered(table, where, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = functions.paginationString(sentences.filterString(table, where, resWords), where);
            console.info(sql);
            const res = await pool.query(sql);
            //console.info(res);
            //return functions.arrayKeysToLowerCase(res.rows) || [];
            return res.rows || [];
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async insertOne(table, data, header) {
        let colums;
        let info
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.insertString(table, data);
            const res = await pool.query(sql);
            return this.getOne(table, data, header);
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }

    },

    async updateFiltered(table, data, where, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.updateString(table, data, where)
            const res = await pool.query(sql);
            return this.getFiltered(table, where, header);
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async deleteFiltered(table, where, header) {
        try {
            let data = this.getFiltered(table, where, header);
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.deleteString(table, where)
            const res = await pool.query(sql);
            return data;
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getFunction(nomFunction, params, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.functionString(nomFunction, params);
            const res = await pool.query(sql);
            return res.rows ? functions.keysToLowerCase(res.rows[0]) : null;
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getCustomSelect(table, field, where, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = functions.paginationString(sentences.customSelectString(table, field, where, resWords), where);
            const res = await pool.query(sql);
            return functions.arrayKeysToLowerCase(res.rows) || [];
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },

    async getProcedure(nomProcedure, params, header) {
        try {
            pool = new Pool(functions.extractDbConn(header));
            setSchema = pool.query(`SET search_path TO '${header.db_schema}';`);
            await setSchema;
            const sql = sentences.procedureString(nomProcedure, params);
            const bindVars = sentences.procedureBind(params);
            const res = await pool.query(sql, bindVars);
            return res.outBinds || [];
        } catch (error) {
            return error;
        } finally {
            if (pool) {
                try {
                    await pool.end();
                } catch (error) {
                    return error;
                }
            }
        }
    },
   

}

module.exports = {Api};