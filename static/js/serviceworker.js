function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

const dbName = "pwa_db"
const version = 5;
const dbVersion = 2;

var staticCacheName = `djangopwa-v${version}`;

let db;

const storeNames = [
	"people",
    "rewards",
    "orders",
    "rewardrequests",
    "statistics"
]

const referralRegex = /\/api\/people\/\d+\/referrals/
const referralStatisticsRegex = /\/api\/people\/\d+\/referrals\/statistics/
const referralRewardRegex = /\/api\/people\/\d+\/referral-rewards/

try {
    const AUTH_TOKEN = getCookie("auth_token")   
} catch (error) {
    const AUTH_TOKEN = null
}

const appShellFiles = [
	"/static/css/style.css",
	"/static/js/script.js",
	"/static/js/jquery-3.6.0.min.js",
	"/static/js/functions.js",
	"/static/css/bootstrap/booststrap.min.css",
	"/static/js/bootstrap/bootstrap.min.js",
    "/static/js/bootstrap/popper.min.js",
	"/static/js/bootstrap/bootstrap.bundle.min.js",
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
    "/static/css/responsive.css",
    "/static/assets/images/logo.png",
    "/static/assets/images/pexels-lay-low-4605240.png",
    "/static/assets/images/img-1.png"
]

self.addEventListener('install', function (event) {
    console.log("[Service Worker] Install")

    event.waitUntil(
        caches.open(staticCacheName).then(function (cache) {
            return cache.addAll([
                '',
            ]);
        })
    );

    event.waitUntil( (async() => {
        const cache = await caches.open(staticCacheName);
        console.log("[Service Worker] caching all: app shell and content");
        await cache.addAll(appShellFiles)
    }) )
});

self.addEventListener('activate', (ev) => {
	// when the service worker has been activated to replace an old one.
	// Extendable Event
	console.log('activated');

	// delete old versions of caches.

	ev.waitUntil(
		caches.keys().then( (keys) => {
			return Promise.all(
				keys.filter( (key) => {
					if (key != staticCacheName) {
						return true;
					}
				} )
				.map( (key) => caches.delete(key) )
			).then( (empties) => {
				// empties is an Array of boolean values.
				// one for each cache deleted
				// TODO:
			} )
		} )
	)
} )

function setVariableToValue(value, array) {
    array[0] = value;
}

const AUTH_TOKEN = getCookie("auth_token")

self.addEventListener('fetch', function (event) {
    var requestUrl = new URL(event.request.url);

    if (event.request.method == 'GET' ) {

        if (referralStatisticsRegex.test(requestUrl.pathname)) {
            console.log("User requested statistics")

            // try to get stats from API and store in indexedDB, if not possible; return the current record of the statistics
            fetch(requestUrl.origin + requestUrl.pathname, {
                method: 'GET',
                headers: {
                    'Authorization': `Token: ${AUTH_TOKEN}`
                }
            }).then(function(response) {
                response = response.json()
    
                addToStore(1, response, "statistics")
                
                return response
            }).catch(function(err) {
                let cachedStats = [];
                getFromStore("statistics", 1, setVariableToValue, callbackParams=[cachedStats])
                
                return cachedStats[0];
            });
        }

        else if (referralRegex.test(requestUrl.pathname)) {
            console.log("User requested referrals")

            // try to get referrals from API and store in indexedDB, if not possible return the referrals in indexedDB

            fetch(requestUrl.origin + requestUrl.pathname, {
                method: 'GET',
                headers: {
                    "Authorization": `Token: ${AUTH_TOKEN}`
                }
            }).then(function(response) {
                console.log("Fetch successful")

                response = response.json()

                for (let person of response) {
                    console.log("Adding a person to the indexedDB")

                    person["saved"] = true

                    // storing the person in the db
                    addToStore(person.id, person, "people")
                }

                let people=[];

                getFromStore("people", null, setVariableToValue, [people])
                
                console.log("Data gotten from indexedDB: ")
                console.log(people)

                return response;
            }).catch(function(err) {
                let personID = getCookie("person_id")
                let people=[];

                getFromStore("people", null, setVariableToValue, [people])

                console.log(people)
            })
        }

        else if (referralRewardRegex.test(requestUrl.pathname)) {
            fetch(requestUrl.origin + requestUrl.pathname, {
                method: 'GET'
            }).then(function(response) {

            })
        }

        else {
            console.log("[Service Worker] this request was not accessing the API: " + event.request.url)
        }
    }

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
	const openRequest = self.indexedDB.open(dbName, dbVersion);

	openRequest.onerror = function(event) {
		console.log("Every hour isn't allowed to use IndexedDB?! " + event.target.errorCode);
	};


	openRequest.onupgradeneeded = function(event) {
		db = event.target.result

		for (let storeName of storeNames) {
			if (!db.objectStoreNames.contains(storeName)) {
				// if there's no store of 'storeName' create a new object store
				db.createObjectStore(storeName, { keyPath: "id"})
			}
		}
	};

	openRequest.onsuccess = function(event, callback=null, callbackParams=[]) {
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

async function getFromStore(storeName, key=null, callback=null, callbackParams=[]) {
	// start a transaction
	const transaction = db.transaction(storeName, "readwrite");

	// create an object store
	const store = transaction.objectStore(storeName);

	// get key and value from the store
	const request = key ? store.get(key) : store.getAll();

	request.onsuccess = function(event) {
		if (callback) {
			callback(event.target.result, ...callbackParams); // this removes the {key:"key", value:"value"} structure
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