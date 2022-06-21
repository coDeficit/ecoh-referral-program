const dbName = "pwa_db"
const version = 1
const dbVersion = 1;

var staticCacheName = `djangopwa-v${version}`;

let db;

const storeNames = [
	"people",
    "rewards",
    "orders",
    "rewardrequests"
]

const appShellFiles = [
	"/static/css/style.css",
	"/static/js/script.js",
	"/static/js/jquery-3.6.0.min.js",
	"/static/js/functions.js",
	"/static/css/bootstrap/css/booststrap.min.css",
	"/static/js/bootstrap/js/bootstrap.min.js",
    "/static/js/bootstrap/js/popper.min.js",
	"/static/js/bootstrap/js/bootstrap.bundle.min.js",
	"/static/font-awesome/css/all.css",
	"/static/js/luxon.min.js",
    "/static/js/owl.carousel.min.js",
    "https://kenwheeler.github.io/slick/slick/slick.js",
    "/static/assets/favicons/apple-icon-57x57.png",
    "/static/assets/favicons/apple-icon-60x60.png",
    "/static/assets/favicons/apple-icon-72x72.png",
    "/static/assets/favicons/apple-icon-76x76.png",
    "/static/assets/favicons/apple-icon-114x114.png",
    "/static/assets/favicons/apple-icon-120x120.png",
    "/static/assets/favicons/apple-icon-144x144.png",
    "/static/assets/favicons/apple-icon-152x152.png",
    "/static/assets/favicons/apple-icon-180x180.png",
    "/static/assets/favicons/android-icon-192x192.png",
    "/static/assets/favicons/favicon-32x32.png",
    "/static/assets/favicons/favicon-96x96.png",
    "/static/assets/favicons/favicon-16x16.png",
    "/static/assets/favicons/ms-icon-144x144.png",
    "https://unpkg.com/feather-icons",
    "https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap",
    "/static/css/magaNav/reset.min.css",
    "/static/css/owl.carousel.min.css",
    "/static/css/animate.css",
    "/static/css/theme.css",
    "/static/css/responsive.css"
]

self.addEventListener('install', function (event) {
    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '',
            ]);
        })
    );
});

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);
    console.log("In serviceworker, pathname: " + requestUrl.pathname)
    if (requestUrl.origin === location.origin) {
        if ((requestUrl.pathname === '/')) {
            event.respondWith(caches.match(''));
            return;
        }
    }
    event.respondWith(
        caches.match(event.request).then(function (response) {
            return response || fetch(event.request);
        })
    );
});

async function openDB(callback, callbackParams = []) {
	const openRequest = self.indexedDB.open(dbName, db_version);

	openRequest.onerror = function(event) {
		console.log("Every hour isn't allowed to use IndexedDB?! " + event.target.errorCode);
	};


	openRequest.onupgradeneeded = function(event) {
		db = event.target.result

		for (let storeName of storeNames) {
			if (!db.objectStoreNames.contains(storeName)) {
				// if there's no store of 'storeName' create a new object store
				db.createObjectStore(storeName, { keyPath: "id" })
			}
		}
	};

	openRequest.onsuccess = function(event) {
		console.log( "DB open success, calling callback" )
		db = event.target.result;

		console.log(db)

		if (callback) {
			callback(...callbackParams);
		}
	}
}

async function addToStore(key, value, storeName=storeNames[0]) {
	console.log( "Adding to store, current db object" )
	console.log(`Key: ${key}, value: ${value}, storeName: ${storeName}`)
	console.log(db)
	// start a transaction of actions you want to submit
	const transaction = db.transaction(storeName, "readwrite")

	// create an object store
	const store = transaction.objectStore(storeName);

	// add key and value to the store
	const request = store.put({ key, value });

	request.onsuccess = function() {
		console.log("added to the store", {key: value}, request.result);
	};

	request.onerror = function () {
		console.log("Error did not save to store", request.error);
	};

	transaction.onerror = function (event) {
		console.log("Trans failed", event);
	};

	transaction.oncomplete = function (event) {
		console.log("Trans completed", event);
	}
}

async function getFromStore(key, callback, storeName) {
	// start a transaction
	const transaction = db.transaction(storeName, "readwrite");

	// create an object store
	const store = transaction.objectStore(storeName);

	// get key and value from the store
	const request = store.get(key);

	request.onsuccess = function(event) {
		if (callback) {
			callback(event.target.result.value); // this removes the {key:"key", value:"value"} structure
		}
	};

	request.onerror = function() {
		console.log("Error did not read to store", request.error);
	};

	transaction.onerror = function(event) {
		console.log("Trans failed", event);
	};

	transaction.oncomplete = function (event) {
		console.log("Trans completed ", event)
	}
}