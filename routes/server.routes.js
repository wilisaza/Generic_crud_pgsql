const { Router } = require('express');
const router = Router();

const {getAllObjects, getOneObject, postOneObject, putObjects, deleteObjects, getFunctionObject, postAllCustomObjects, getProcedureObject} = require('../controllers/pgsql.controller');

router.get('/', function (req, res) {res.send('Hello World')});

router.get('/function/:nomFunction', getFunctionObject);

router.get('/procedure/:nomProcedure', getProcedureObject);

router.get('/:object/:field/:val', getOneObject);

router.get('/:object', getAllObjects);

router.post('/custom/:object', postAllCustomObjects);

router.post('/:object', postOneObject);

router.put('/:object', putObjects);

router.delete('/:object', deleteObjects);

module.exports = router;