var CACHE = "kitchen-v20";
var SHELL = ["./", "./index.html", "./fonts.css", "./karla-400.woff2", "./karla-600.woff2", "./karla-700.woff2", "./cutive-mono-400.woff2", "./special-elite-400.woff2", "./favicon.ico", "./shrimp-scampi.html", "./carbonara.html", "./pot-roast.html", "./red-beans-and-rice.html", "./chicken-tacos.html", "./pork-chops-onion-pear.html", "./tom-kha.html", "./carne-guisada.html", "./peruvian-grilled-chicken.html", "./mash.html", "./mash-steps.js", "./step-player.js", "./kentucky-hot-brown.html", "./grilled-pork-chops.html", "./koji-tomahawk.html", "./meatballs.html", "./baked-bacon-mac-and-cheese.html", "./sausage-antipasto-pasta.html", "./mortadella-sandwich.html", "./peppercorn-mushroom-sauce.html", "./bacon-fat-aioli.html", "./base-vinaigrette.html", "./wilted-house-salad.html", "./quick-pickles.html", "./pickled-carrots-and-cabbage.html", "./pickled-eggs.html", "./movie-theater-popcorn.html", "./mint-julep-kit.html", "./clarified-watermelon-rum-punch.html", "./cold-brew-cafe-du-monde.html", "./bacon-wrapped-hot-dogs.html", "./smoked-ribs.html", "./smoked-chicken-thighs.html", "./bbq-sauce.html", "./chashu-pork-belly.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png"];

self.addEventListener("install", function(e){
  e.waitUntil(
    caches.open(CACHE).then(function(c){ return c.addAll(SHELL); })
      .then(function(){ return self.skipWaiting(); })
      .catch(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener("activate", function(e){
  e.waitUntil(
    caches.keys().then(function(keys){
      return Promise.all(keys.map(function(k){ return k === CACHE ? null : caches.delete(k); }));
    }).then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function(e){
  var req = e.request;
  if(req.method !== "GET") return;
  if(new URL(req.url).origin !== self.location.origin) return;

  var accept = req.headers.get("accept") || "";
  var isPage = req.mode === "navigate" || accept.indexOf("text/html") !== -1;

  if(isPage){
    // Pages go to the network first so a fresh deploy shows up immediately.
    // The cache is the fallback, which is what keeps the kitchen working offline.
    e.respondWith(
      fetch(req).then(function(res){
        if(res && res.status === 200){
          var copy = res.clone();
          caches.open(CACHE).then(function(c){ c.put(req, copy); });
        }
        return res;
      }).catch(function(){
        return caches.open(CACHE).then(function(c){
          return c.match(req, {ignoreSearch:true}).then(function(hit){
            return hit || c.match("./index.html", {ignoreSearch:true});
          });
        });
      })
    );
    return;
  }

  // Everything else (fonts, icons, manifest) stays cache first and refreshes behind the scenes.
  e.respondWith(
    caches.open(CACHE).then(function(c){
      return c.match(req).then(function(hit){
        var net = fetch(req).then(function(res){
          if(res && res.status === 200) c.put(req, res.clone());
          return res;
        }).catch(function(){ return hit; });
        return hit || net;
      });
    })
  );
});
