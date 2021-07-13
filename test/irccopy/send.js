const deps = require("./deps.js");

module.exports = {
    mesg: function(request, response) {

	if ((request.body.msg).startsWith("/chan")) {

	    var split = (request.body.msg).split(" ");
    	    if (/^#[a-z0-9]+$/i.test(split[1])) {

    		var channel = split[1];
		request.session.current = channel;
		request.session.save();
	    }
	    response.send();
	}
	if ((request.body.msg).startsWith("/mod")) {

	    var split = (request.body.msg).split(" ");
    	    if (/^#[a-z0-9]+$/i.test(split[1])) {

    		var user = split[1];
		deps.mongo.connect(deps.url, {useUnifiedTopology: true}, async function(error, client) {

		    if (error)
			return ;
		    const sutoTestMon = client.db("sutoTestMon").collection("channels");
		    await sutoTestMon.updateOne({name: request.session.current}, {$addToSet: {mods: user}});
		    client.close();
		});
		request.session.current = channel;
		request.session.save();
	    }
	    response.send();
	}
	else if ((request.body.msg).startsWith("/unmod")) {

    	    var split = (request.body.msg).split(" ");
    	    if (/^#[a-z0-9]+$/i.test(split[1])) {

		var user = split[1];
		deps.mongo.connect(deps.url, {useUnifiedTopology: true}, async function(error, client) {

		    if (error)
			return ;
		    const sutoTestMon = client.db("sutoTestMon").collection("channels");
		    await sutoTestMon.updateOne({name: request.session.current}, {$pullAll: {mods: [user]}});
		    client.close();
		});
	    }
	    response.send();
	}
	else if ((request.body.msg).startsWith("/mods")) {

	    if (/^#[a-z0-9]+$/i.test(request.session.current)) {

		deps.mongo.connect(deps.url, {useUnifiedTopology: true}, async function(error, client) {

		    if (error)
			return ;
		    var channel = request.session.current;
		    const sutoTestMon = client.db("sutoTestMon").collection("channels");
		    await sutoTestMon.find({name: channel}).toArray(function(error, docs) {
			console.log("Mods in " + request.session.current + ": " + (docs[0].mods).join(" "));
		    });
		    client.close();
		});
	    }
	    response.send();
	}
    }
}
