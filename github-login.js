editor.storageConnectors.github.connect = function(callback) {
	if (!document.getElementById("simply-login")) {
		callback();
	}

	document.querySelector("#simply-login .simply-message").innerHTML = "Login with Github:";

	editor.plugins.dialog.open(document.getElementById('simply-login'));
	window.setTimeout(function() {
		document.querySelector("#simply-login input").focus();
	}, 10);
	var handleLogin = function(evt) {
		evt.preventDefault();
		editor.plugins.dialog.close();
		document.querySelector("#simply-login input[value=Login]").removeEventListener("click", handleLogin);
		document.querySelector("#simply-login input[value=Cancel]").removeEventListener("click", handleLogin);

		if (evt.target.getAttribute("value") == 'Login') {
			editor.storage.github = new Github({
				username: evt.target.form.username.value,
				password: evt.target.form.password.value
			});
			editor.storage.repo = editor.storage.github.getRepo(editor.storage.repoUser, editor.storage.repoName);
			callback();
		}
	};
	document.querySelector("#simply-login input[value=Login]").addEventListener("click", handleLogin);
	document.querySelector("#simply-login input[value=Cancel]").addEventListener("click", handleLogin);
};
editor.loadToolbar("//yvo.muze.nl/simply-edit/simply/plugin.simply-login.html");
editor.loadStyleSheet("//yvo.muze.nl/simply-edit/simply/css/dialog.css");
document.addEventListener("simply-toolbars-loaded", function() {
	if (document.body.getAttribute("data-simply-edit")) {
		editor.storage.connect(function() {
			editor.storage.repo.read(editor.storage.repoBranch, "data.json", function(err, data) {
				if (data) {
					editor.currentData = JSON.parse(data);
					editor.data.apply(editor.currentData, document);
				}
			});
		});
	}
});
