
const validateId = (id) => {
    if(!id) {
        throw new Error(res.send('erro id'))
    }
    
    if(!Number(id)){
        throw new Error('Invalid id')
    }
}


module.exports = validateId;


