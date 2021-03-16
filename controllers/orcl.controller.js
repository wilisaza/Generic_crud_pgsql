const {Api} = require('../api/crudPgsqlApi');

const Ctrl= {

    getAllObjects : async(req, res) => {
        let outdata;
        if (Object.keys(req.query).length === 0){
            outdata = await Api.getAll(req.params.object, req.headers);
        }
        else{
            outdata = await Api.getFiltered(req.params.object, req.query, req.headers);
        }
        res.json({
            outdata
        });
    },

    getOneObject : async(req, res) => {
        let where = {
            [req.params.field] : req.params.val,
        }
        //console.info(Object.keys(req.query).length);
        let outdata = await Api.getOne(req.params.object, where, req.headers);
        res.json({
            outdata,
        });
    },

    postOneObject: async(req, res) => {
        let outdata = await Api.insertOne(req.params.object, req.body, req.headers);
        res.json({
            outdata,
        });
    },

    putObjects: async(req, res) => {
        let outdata = await Api.updateFiltered(req.params.object, req.body, req.query, req.headers);
        res.json({
            outdata,
        });
    },

    deleteObjects: async(req, res) => {
        let outdata = await Api.deleteFiltered(req.params.object, req.query, req.headers);
        res.json({
            outdata,
        });
    },

    getFunctionObject : async(req, res) => {
        let outdata = await Api.getFunction(req.params.nomFunction, req.query, req.headers);
        res.json({
            outdata,
        });
    },

    postAllCustomObjects : async(req, res) => {
        let outdata = await Api.getCustomSelect(req.params.object, req.body, req.query, req.headers);
        res.json({
            outdata,
        });
    },

    getProcedureObject : async(req, res) => {
        let outdata = await Api.getProcedure(req.params.nomProcedure, req.query, req.headers);
        res.json({
            outdata,
        });
    },
}

module.exports = Ctrl;