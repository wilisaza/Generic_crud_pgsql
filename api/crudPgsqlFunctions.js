const functions = {


    dateToYMD(date) {
        var d = date.getDate();
        var m = date.getMonth() + 1; //Month from 0 to 11
        var y = date.getFullYear();
        return '' + y + '-' + (m <= 9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
    },

    keysToLowerCase(obj) {
        var keys = Object.keys(obj);
        var n = keys.length;
        var i = 0;
        while (i < n) {
            var key = keys[i]; // "cache" it, for less lookups to the array
            obj[key.toLowerCase()] = obj[key]; // swap the value to a new lower case key
            delete obj[key]; // delete the old key
            i++;
        }
        return (obj);
    },

    arrayKeysToLowerCase(obj) {
        var n = obj.length;
        var i = 0;
        while (i < n) {
            obj[i] = this.keysToLowerCase(obj[i]);
            i++;
        }
        return (obj);
    },

    extractDbConn(dataConn){
        let dbpgsql= {
            user: dataConn.db_user,
            password: dataConn.db_password,
            host: dataConn.db_host,
            database: dataConn.db_name,
            port: dataConn.db_port,
        };
        return dbpgsql;
    },

    paginationString(sql, where) {
        //Se agrega en esta función el orderby
        const orderby = where.orderby || 'N';
        const pags = where.pags || 'N';

        if (orderby !== 'N'){
            sql += ` ORDER BY ${orderby}`;
        }
        
        if (pags === 'S'){
            const offset = Number(where.offset || 0);
            const numrows = Number(where.numrows || 10);
            
            sql = `SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM ( ${sql} ) A 
                        WHERE ROWNUM <= ${numrows} + ${offset}) WHERE MY_RNUM > ${offset}`;
        }
        return sql;
    }
}

module.exports = {functions};