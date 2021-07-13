const deps = require("./deps.js");

module.exports = {
    name: function(request, response) {

	if (/^[a-z0-9]+$/i.test(request.body.user) === true) {

	    request.session.username = "@" + request.body.user;
	    request.session.current = "#welcome";
	    deps.mongo.connect(deps.url, {useUnifiedTopology: true}, async function(error, client) {

		if (error)
		    return ;
		const sutoTestMon = client.db("sutoTestMon");
		await sutoTestMon.collection("channels").updateOne({name: "#welcome"}, {$addToSet: {members: request.session.username}});
    		client.close();
	    });
	    response.status(200).send("Chosen username: " + request.session.username);
	} else
	    response.status(403).send("Username must contain only alphanumeric characters");
    }
}
