const {Pool} = require('pg');

const {config} = require('./crudPgsqlConfig');
const {sentences} = require('./crudPgsqlSentences');
const {functions} = require('./crudPgsqlFunctions');

const pool = new Pool(config.dbpgsql);

const setSchema = pool.query(`SET search_path TO 'admin';`);

//const lowerKeys = require('lowercase-keys-object');

let connection;//Eliminar tras conversión

let resWords = ['pags', 'offset', 'numrows', 'orderby']; //Array de palabras reservadas para ser excluidas del WHERE

const orclApi = {
    async getAll(table) {
        try {
            await setSchema;
            const sql = `SELECT * FROM ${table}`;
            const res = await pool.query(sql);
            console.info(res.rows);
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

    async getOne(table, where) {
        try {
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

    async getFiltered(table, where) {
        try {
            await setSchema;
            const sql = functions.paginationString(sentences.filterString(table, where, resWords),connection, where);
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

    async insertOne(table, data) {
        let colums;
        let info
        try {
            await setSchema;
            const sql = sentences.insertString(table, data);
            const res = await pool.query(sql);
            return this.getOne(table, data);
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

    async updateFiltered(table, data, where) {
        try {
            await setSchema;
            const sql = sentences.updateString(table, data, where)
            const res = await pool.query(sql);
            return this.getFiltered(table, where);
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

    async deleteFiltered(table, where) {
        try {
            let data = this.getFiltered(table, where);
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

    async getFunction(nomFunction, params) {
        try {
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

    async getCustomSelect(table, field, where) {
        try {
            await setSchema;
            const sql = functions.paginationString(sentences.customSelectString(table, field, where, resWords),connection, where);
            //console.info('SQL', sql, connection.oracleServerVersion);
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

    async getProcedure(nomProcedure, params) {
        try {
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

module.exports = {orclApi};