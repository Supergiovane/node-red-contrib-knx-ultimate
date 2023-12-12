// Utility function
// until node-red 3.1.0, there is a bug creating a plugin, so for backward compatibility, i must use a JS as a node.
const yaml = require('js-yaml');
module.exports = function (RED) {

    //RED.log.error("###############################################################")
    RED.httpAdmin.post("/banana", RED.auth.needsPermission("write"), (req, res) => {
        var node = RED.nodes.getNode(req.params.id);
        if (node != null) {
            try {
                if (req.body) {
                    console.log(body);
                }
            } catch (err) { }
        }
        res.json(req.body)
    })


}

