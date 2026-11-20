// use one helper so product image paths stay rooted under the public folder.
const image = (name) => `/images/products/${name}`;
// make is a small product factory. shared defaults keep seed records complete,
// while the details object overrides only values that differ for one product.
const make = (id,name,brand,category,subcategory,price,oldPrice,photo,details={}) => {
  const p = {
    id,name,brand,category,subcategory,price,oldPrice,
    // nullish coalescing keeps real zero values and uses a default only when absent.
    rating: details.rating ?? Number((4.4 + id % 6 / 10).toFixed(1)),
    reviews: details.reviews ?? 18 + id * 7,
    stock: details.stock ?? (id % 11 === 0 ? 0 : 4 + id * 3 % 24),
    sku: details.sku ?? `RCV-${String(id).padStart(4,"0")}`,
    tag: details.tag ?? (oldPrice ? "PIT DEAL" : "GARAGE PICK"),
    scale: details.scale ?? "1/10", motor: details.motor ?? "—", motorKV: details.motorKV ?? "—",
    battery: details.battery ?? "—", drive: details.drive ?? "—", speed: details.speed ?? "—",
    chassis: details.chassis ?? "—", suspension: details.suspension ?? "—", dimensions: details.dimensions ?? "—",
    weight: details.weight ?? "—", waterproof: details.waterproof ?? "Not rated",
    material: details.material ?? "—", mount: details.mount ?? "—",
    compatibility: details.compatibility ?? `${details.scale ?? "1/10"} scale RC platforms; verify mounting dimensions and connectors before purchase.`,
    description: details.description ?? `${name} is a selected ${subcategory.toLowerCase()} for RC builders. Match fitment and specifications to your chassis before ordering.`,
    image: image(photo), gallery: (details.gallery ?? [photo]).map(image),
    included: details.included ?? "Product as pictured; check specifications for fitment details.",
    warranty: "Demo listing · seller terms would apply in a live store.",
    tags: details.tags ?? [name,brand,category,subcategory,details.motor,details.motorKV,details.battery,details.scale].filter(Boolean),
  };
  // derive a sale percentage from current and previous prices when available.
  p.discount = oldPrice ? Math.round((1 - price / oldPrice) * 100) : 0;
  // entries becomes key/value pairs; filter removes blank specifications; then
  // the object-from-entries method turns the remaining pairs back into details.
  p.specs = Object.fromEntries(Object.entries({
    "Scale / Fit":p.scale, Brand:p.brand, "Motor / Type":p.motor, "Motor KV":p.motorKV,
    Battery:p.battery, Drive:p.drive, "Top speed":p.speed, Chassis:p.chassis,
    Suspension:p.suspension, Dimensions:p.dimensions, Weight:p.weight,
    Waterproofing:p.waterproof, Material:p.material, "Connector / Mount":p.mount,
  }).filter(([,v])=>v&&v!=="—"));
  return p;
};

// these category records are seed/reference data; the storefront category links
// are defined in the separate customer-facing category module.
export const categories = [
  {name:"RC Cars",slug:"rc-cars",description:"Road, rally and race-ready platforms for every kind of driver.",image:image("rally-116.jpg")},
  {name:"Drift Cars",slug:"drift-cars",description:"Rear-drive chassis and precision drift setups.",image:image("drift-mst-red.jpg")},
  {name:"Off-road",slug:"off-road",description:"Buggies, short course trucks and truggies built for dirt.",image:image("buggy-team-magic.jpg")},
  {name:"Rock Crawlers",slug:"rock-crawlers",description:"Low-speed control, portal axles and trail-ready grip.",image:image("crawler-axial.jpg")},
  {name:"Spare Parts",slug:"spare-parts",description:"Keep your chassis running with dependable replacement parts.",image:image("shocks-aluminum.jpg")},
  {name:"Tires & Wheels",slug:"tires-wheels",description:"Choose the right compound, tread and wheel fitment.",image:image("wheel-tire-green.jpg")},
  {name:"Motors & ESC",slug:"motors-esc",description:"Power systems matched for scale and battery.",image:image("motor-hobbywing.jpg")},
  {name:"Batteries & Chargers",slug:"batteries-chargers",description:"Reliable power packs and balance charging equipment.",image:image("battery-absima.jpg")},
  {name:"Tools & Equipment",slug:"tools-equipment",description:"Precision tools for the bench, track and trail.",image:image("hex-driver-set.jpg")},
  {name:"Accessories & Upgrades",slug:"accessories-upgrades",description:"Useful upgrades and details for your next build.",image:image("esc-hobbywing.jpg")},
];

// this is the canonical seed catalogue used by the database seed script. each call
// passes core product fields plus optional technical details to the factory.
export const products = [
 make(1,"RMX 2.5 Brushless Drift Car","MST","Drift Cars","Brushless drift cars",24999,28999,"drift-mst-red.jpg",{tag:"BEST SELLER",motor:"Brushless 3652",motorKV:"2500 KV",battery:"2S LiPo",drive:"RWD",speed:"45 km/h",chassis:"Composite gravity frame",suspension:"Adjustable oil dampers",dimensions:"420 × 195 × 125 mm",weight:"1.55 kg",waterproof:"Splash-resistant electronics",sku:"MST-533904R",gallery:["drift-mst-red.jpg","drift-mst-gallery.jpg","drift-mst-black.jpg"],description:"Ready-to-run rear-wheel-drive drift platform with gyro assistance, adjustable steering geometry and a low-mounted brushless system.",included:"Assembled chassis, 2.4 GHz radio, gyro, brushless motor and ESC."}),
 make(2,"RMX 2.5 E30 Drift Chassis","MST","Drift Cars","Drift chassis kits",19999,22999,"drift-mst-black.jpg",{motor:"Brushless 3652",motorKV:"2500 KV",battery:"2S LiPo",drive:"RWD",speed:"45 km/h",chassis:"Composite RMX platform",suspension:"Oil-filled dampers",dimensions:"420 × 195 mm",weight:"1.48 kg",sku:"MST-533901BK",gallery:["drift-mst-black.jpg","drift-mst-gallery.jpg"]}),
 make(3,"RMX RWD Competition Chassis Kit","MST","Drift Cars","Drift chassis kits",16499,null,"drift-chassis-kit.jpg",{drive:"RWD",chassis:"High-specific-gravity composite",suspension:"Hydraulic dampers",dimensions:"257 mm wheelbase",weight:"1.2 kg kit",sku:"MST-532206",compatibility:"MST RMX 2.5 parts; requires radio, ESC, motor, servo, battery and body.",description:"Builder-focused chassis kit with adjustable motor positions and a stable rear spur-gear transmission.",included:"Chassis kit, decals and instructions; electronics sold separately."}),
 make(4,"1/16 High-Speed Rally Car","GoStock","RC Cars","Rally cars",6999,7999,"rally-116.jpg",{scale:"1/16",motor:"Brushed 390",battery:"2S 1500 mAh LiPo",drive:"4WD",speed:"36 km/h",chassis:"Reinforced composite tub",suspension:"Independent coil-over shocks",dimensions:"280 × 190 × 120 mm",weight:"0.92 kg",waterproof:"Splash resistant",sku:"GS-RALLY-116",tag:"36 KM/H"}),
 make(5,"1/8 Electric Off-Road Buggy","Team Magic","Off-road","Electric buggies",38999,42999,"buggy-team-magic.jpg",{scale:"1/8",motor:"Brushless 4274",motorKV:"2250 KV",battery:"4S–6S LiPo",drive:"4WD",speed:"Up to 90 km/h",chassis:"7075 aluminium race plate",suspension:"Big-bore threaded oil shocks",dimensions:"510 × 310 × 185 mm",weight:"4.2 kg",waterproof:"WP ESC",sku:"TM-B8ER-6S",compatibility:"1/8 4WD buggy; 4–6S LiPo, 150A ESC and 17 mm wheel hex."}),
 make(6,"Trailhawk 1/10 Rock Crawler","Axial","Rock Crawlers","Trail crawlers",31999,35999,"crawler-axial.jpg",{scale:"1/10",motor:"540 brushed 55T",battery:"2S LiPo / NiMH",drive:"4WD portal axles",speed:"Trail gearing · 8 km/h",chassis:"Steel ladder frame",suspension:"Four-link with oil shocks",dimensions:"510 × 230 × 255 mm",weight:"3.1 kg",waterproof:"Water-resistant receiver box",sku:"AXI-AX90004",tag:"TRAIL READY"}),
 make(7,"1/12 Track-Day Racing Car","Tamiya","RC Cars","Touring cars",10999,null,"drift-mst-gallery.jpg",{scale:"1/12",motor:"Brushed 540",battery:"2S LiPo / 7.2 V NiMH",drive:"RWD",speed:"35 km/h setup dependent",chassis:"Composite tub chassis",suspension:"Double wishbone",dimensions:"340 × 155 × 105 mm",weight:"1.15 kg",sku:"TAM-TRACK-12"}),
 make(8,"1/10 4WD Touring Chassis","MST","RC Cars","Touring cars",14999,16999,"drift-mst-red.jpg",{motor:"Brushless 3650",motorKV:"3000 KV",battery:"2S LiPo",drive:"4WD shaft drive",speed:"55 km/h setup dependent",chassis:"Composite touring tub",suspension:"Independent oil dampers",dimensions:"420 × 190 × 130 mm",weight:"1.62 kg",sku:"MST-TCR-10"}),
 make(9,"Quake Brushless Monster Truck","ARRMA","Off-road","Monster trucks",27999,31999,"monster-quake.jpg",{scale:"1/10",motor:"Brushless 3660",motorKV:"4000 KV",battery:"2S–3S LiPo",drive:"2WD",speed:"50+ mph on 3S",chassis:"Reinforced composite tub",suspension:"Oil-filled coil-over shocks",dimensions:"430 × 340 × 210 mm",weight:"2.7 kg",waterproof:"Waterproof ESC and receiver",sku:"ARA3537T1",tag:"BASHER PICK"}),
 make(10,"Pro2 Short Course Truck RTR","Team Associated","Off-road","Short course trucks",34999,null,"shortcourse-associated.jpg",{scale:"1/10",motor:"Reedy brushless",motorKV:"3300 KV",battery:"2S–3S LiPo",drive:"2WD",speed:"50 km/h setup dependent",chassis:"Low-CG composite chassis",suspension:"Oil-filled threaded shocks",dimensions:"515 × 295 × 190 mm",weight:"2.9 kg",waterproof:"Water-resistant ESC",sku:"ASC-70040"}),
 make(11,"SRX8 Electric Racing Truggy","Serpent","Off-road","Truggies",44999,49999,"truggy-serpent.jpg",{scale:"1/8",motor:"Brushless 4274",motorKV:"2000 KV",battery:"4S–6S LiPo",drive:"4WD",speed:"80 km/h setup dependent",chassis:"7075 aluminium chassis",suspension:"Big-bore oil shocks",dimensions:"536 × 422 mm",weight:"4.1 kg",sku:"SER-600070"}),
 make(12,"4-Way RC Wheel Wrench","Hudy","Tools & Equipment","Wheel wrenches",499,null,"four-way-wrench.jpg",{scale:"Universal",material:"Hardened steel",dimensions:"7 / 5.5 / 5 / 4 mm sockets",mount:"12 mm RC wheel nuts",compatibility:"For common 1/10 RC wheel nuts; confirm nut size."}),
 make(13,"Aluminium Hydraulic Shock Set 90 mm","Yeah Racing","Spare Parts","Shock absorbers",2499,2999,"shocks-aluminum.jpg",{material:"CNC aluminium body",dimensions:"90 mm eye-to-eye",mount:"Universal 3 mm ball ends",compatibility:"1/10 buggy platforms using 90 mm shocks; measure extended length.",included:"Four shocks, springs, collars and mounting ends."}),
 make(14,"Compact RC Soldering Station","Hakko","Tools & Equipment","Soldering equipment",3299,null,"soldering-station.jpg",{scale:"Universal",material:"Temperature-controlled soldering iron",dimensions:"200–480 °C adjustable",mount:"Fine tip · bench stand included",compatibility:"For RC wiring repairs; use appropriate solder and ventilation."}),
 make(15,"Reinforced Front Suspension Arms","RPM","Spare Parts","Suspension arms",1299,1499,"suspension-arms.jpg",{material:"Impact-resistant nylon composite",mount:"Model-specific pin mounts",dimensions:"Front arm pair",compatibility:"Trailhawk 1/10 crawler front end only."}),
 make(16,"Hardened Differential Gear Set","Hot Racing","Spare Parts","Differential gears",1799,null,"diff-gears.jpg",{material:"Hardened steel",dimensions:"13T / 38T gear set",mount:"1/8 buggy differential",compatibility:"Selected 1/8 4WD buggy differentials; match tooth count."}),
 make(17,"Metal Gear Steering Servo 20 kg","Savox","Spare Parts","Steering servos",2899,3299,"servo-20kg.png",{motor:"Digital coreless",mount:"Standard 1/10 servo mount",dimensions:"40.8 × 20.2 × 38 mm",compatibility:"Standard-size 1/10 servo mount; check voltage and spline."}),
 make(18,"Aluminium Motor Mount 36 mm","Yeah Racing","Spare Parts","Motor mounts",899,null,"motor-mount.jpg",{material:"6061 aluminium",mount:"36 mm 1/10 motor pattern",compatibility:"Check chassis motor mount pattern and shaft alignment."}),
 make(19,"Rubber-Sealed Bearing Assortment","FastEddy","Spare Parts","Bearings",1199,null,"bearing-kit.jpg",{material:"Steel with rubber seals",dimensions:"8 sizes · 28 pieces",mount:"Metric RC bearing assortment",compatibility:"Measure inner and outer diameter before ordering."}),
 make(20,"Steel CVD Driveshaft Pair","MIP","Spare Parts","Driveshafts",2299,2599,"cvd-driveshaft.webp",{material:"Hardened steel",dimensions:"96 mm compressed",mount:"12 mm axle interfaces",compatibility:"Selected 1/10 4WD touring chassis; verify shaft length."}),
 make(21,"All-Terrain Tire & Wheel Set","Pro-Line","Tires & Wheels","Off-road tires",1599,1899,"wheel-tire-green.jpg",{material:"Medium compound rubber / nylon rim",dimensions:"12 mm hex · 105 mm OD",mount:"12 mm hex",compatibility:"1/10 stadium trucks using 12 mm hex hubs."}),
 make(22,"High-Grip Drift Tire Set","MST","Tires & Wheels","Drift tires",999,null,"drift-mst-red.jpg",{material:"Hard compound PVC",dimensions:"26 mm width · 64 mm OD",mount:"12 mm hex",compatibility:"1/10 drift wheels with 12 mm hex hubs."}),
 make(23,"Dish Rim Set 1/10 12 mm Hex","HPI Racing","Tires & Wheels","Wheels and rims",1199,1399,"wheel-tire-green.jpg",{material:"Molded nylon",dimensions:"52 mm wheel · 12 mm offset",mount:"12 mm hex",compatibility:"Check offset and body clearance on 1/10 touring builds."}),
 make(24,"QuicRun 3652SL Brushless Motor 4000 KV","Hobbywing","Motors & ESC","Brushless motors",3999,4499,"motor-hobbywing.jpg",{motor:"4-pole sensorless brushless",motorKV:"4000 KV",battery:"2S–3S LiPo",dimensions:"36 × 52 mm",weight:"0.35 kg",mount:"3.175 mm shaft",compatibility:"1/10 scale 2S–3S ESC; check motor can clearance."}),
 make(25,"Firma 3150 KV Brushless Motor","Spektrum","Motors & ESC","Brushless motors",4299,null,"motor-spektrum.jpg",{motor:"4-pole brushless inrunner",motorKV:"3150 KV",battery:"2S–3S LiPo",dimensions:"36 × 52 mm",mount:"3.175 mm shaft",compatibility:"1/10 4WD platforms with compatible 3S ESC."}),
 make(26,"QuicRun WP8BL150 G2 ESC","Hobbywing","Motors & ESC","Electronic speed controllers",6499,7299,"esc-hobbywing.jpg",{motor:"Sensorless brushless ESC",battery:"3S–6S LiPo",waterproof:"Waterproof case",dimensions:"56 × 48 × 42 mm",mount:"150 A · 6.5 mm bullets",compatibility:"1/8 brushless systems using 3S–6S LiPo."}),
 make(27,"MAX10-SCT 120 A Brushless ESC","Hobbywing","Motors & ESC","Electronic speed controllers",5199,null,"esc-hobbywing.jpg",{motor:"Brushless ESC",battery:"2S–4S LiPo",waterproof:"Splash resistant",mount:"120 A continuous · 4 mm bullets",compatibility:"1/10 short course and touring systems."}),
 make(28,"Digital RC Workshop Caliper","ProTek","Tools & Equipment","Measuring tools",1299,null,"digital-caliper.webp",{scale:"Universal",material:"Stainless steel",dimensions:"0–150 mm / 0–6 in",mount:"Digital LCD · mm/in mode",compatibility:"For measuring RC parts and setup dimensions."}),
 make(29,"7.4 V 8500 mAh 2S LiPo Pack","Absima","Batteries & Chargers","LiPo batteries",4299,null,"battery-absima.jpg",{battery:"2S · 7.4 V · 8500 mAh · 140C",dimensions:"138 × 47 × 25 mm",weight:"0.39 kg",mount:"Hardcase · 5 mm bullets",compatibility:"Use only with a 2S LiPo balance charger and suitable tray.",description:"High-capacity hardcase pack for 1/10 racing platforms. Charge under supervision."}),
 make(30,"5200 mAh 3S Smart LiPo","Spektrum","Batteries & Chargers","LiPo batteries",4499,4999,"battery-spektrum.jpg",{battery:"3S · 11.1 V · 5200 mAh · 100C",dimensions:"138 × 47 × 38 mm",weight:"0.42 kg",mount:"IC5 connector",compatibility:"3S-rated ESC and chassis tray; verify connector polarity."}),
 make(31,"APC-1 80 W Balance Charger","Absima","Batteries & Chargers","LiPo chargers",2799,null,"charger-absima.jpg",{scale:"Universal",battery:"LiPo / LiFe 1–6S",dimensions:"130 × 115 × 61 mm",weight:"0.38 kg",mount:"AC/DC input · balance board",compatibility:"Select correct chemistry and cell count."}),
 make(32,"2.4 GHz Radio Transmitter & Receiver","FlySky","Accessories & Upgrades","Radio systems",3499,3999,"radio-transmitter.jpg",{scale:"Universal",battery:"4 AA cells or 2S input",dimensions:"6-channel handset",mount:"2.4 GHz AFHDS receiver included",compatibility:"Compatible with standard PWM servos and ESCs."}),
 make(33,"Titanium Hex Driver Set 4-piece","Urgenex","Tools & Equipment","Hex drivers",1499,null,"hex-driver-set.jpg",{scale:"Universal",material:"Titanium-coated steel shafts",dimensions:"1.5 / 2.0 / 2.5 / 3.0 mm",mount:"Metric hex fasteners"}),
 make(34,"Pit Bench Setup Stand","RCVERSE","Tools & Equipment","Setup tools",1899,2199,"setup-station.jpg",{material:"Anodized aluminium and rubber",dimensions:"Adjustable 110–160 mm",mount:"Universal chassis cradle",compatibility:"1/10 chassis with flat centre section."}),
 make(35,"LiPo Cell Voltage Checker","RC4WD","Tools & Equipment","Battery tools",699,null,"battery-checker.jpg",{scale:"Universal",battery:"2S–8S LiPo / LiFe",dimensions:"Balance plug interface",mount:"XH balance connector"}),
 make(36,"Aluminium Cooling Fan 30 mm","Yeah Racing","Accessories & Upgrades","Cooling upgrades",899,null,"cooling-fan.jpg",{material:"Aluminium fan housing",dimensions:"30 × 30 × 10 mm",mount:"5–8.4 V receiver lead",compatibility:"Check fan voltage and available motor-can clearance."}),
 make(37,"LED Light Bar & Headlight Kit","RC4WD","Accessories & Upgrades","Lighting kits",1299,null,"led-lightbar.jpg",{mount:"2-pin receiver power lead",compatibility:"1/10 crawlers and scale trucks with body clearance."}),
 make(38,"Clear 1/10 Drift Body Shell","MST","Accessories & Upgrades","Bodies",2199,2499,"drift-body-clear.jpg",{material:"Clear polycarbonate",dimensions:"257 mm wheelbase · 190 mm width",mount:"1/10 touring body posts",compatibility:"Check wheelbase, body posts and wheel offset before trimming."}),
 make(39,"XT60 Connector Pair & Wire Set","Amass","Accessories & Upgrades","Connectors",399,null,"xt60-connectors.jpg",{material:"Nylon shell · gold-plated contacts",mount:"XT60 · 12 AWG leads",compatibility:"Confirm polarity and soldering skill before installation."}),
 make(40,"Body Clip & Pin Assortment","Tamiya","Accessories & Upgrades","Body hardware",299,null,"body-clips.jpg",{material:"Spring steel",dimensions:"Small/medium RC body clips",mount:"Standard 1/10 body posts"}),
];

// source pages are recorded for image credit and later licensing review.
export const productImageSources = [
 ["drift-mst-red.jpg","https://hobbiesdirect.com.au/products/mst-rmx-25-lbmt-rc-drift-car-electric-brushless-rwd-110-scale-rtr-red-533904r-44377"],
 ["drift-mst-black.jpg","https://www.drifted.nl/en/rmx-25-2wd-rtr-brushless-jz3-toyota-soarer-black.html"],
 ["drift-chassis-kit.jpg","https://www.mrcplaza.com.au/products/mst-rmx-2-5-rwd-classic-kit"],
 ["drift-mst-gallery.jpg","https://hobbiesdirect.com.au/products/mst-rmx-25-gr86rb-rc-drift-car-electric-brushless-110-scale-rtr-light-blue-533913lb-47774"],
 ["rally-116.jpg","https://www.onbuy.com/gb/p/remote-control-car-116-off-road-rc-racing-car-36kmh-high-speed-4wd-radio-monster-truck-24ghz-waterproof-radio-controlled-electric-buggy~p53467865/"],
 ["buggy-team-magic.jpg","https://www.liverc.com/news/new-team-magic-b8er-6s-rtr-18-scale-electric-buggy/"],
 ["crawler-axial.jpg","https://www.patrickmodelisme.com/axial-ax10-scorpion-artr-1-10-rock-crawler.html"],
 ["crawler-redcat.jpg","https://www.redcatracing.com/products/redcat-vertex-10w-1-10-scale-brushless-electric-rock-crawler-copy"],
 ["monster-quake.jpg","https://www.absolutehobbyz.com/arrma-110-quake-223s-dsc-2wd-rtr-brushless-monster-truck-red.html"],
 ["shortcourse-associated.jpg","https://60years.associatedelectrics.com/pro2-sc10sw-rtr-white/"],
 ["truggy-serpent.jpg","https://hobbiesdirect.com.au/products/tlr-8ight-xtxte-rc-truggy-nitroelectric-4wd-18-scale-race-kit-tlr04009-32075"],
 ["tire-wheel-set.jpg","https://www.ebay.com/itm/404477660941"],
 ["wheel-tire-green.jpg","https://www.walmart.com/ip/Rc-Tires-1-10-Truck-Tires-and-Wheels-Remote-Control-Truck-Tires-Green/16266213048"],
 ["shocks-aluminum.jpg","https://www.ebay.com/itm/226579882674"],
 ["motor-hobbywing.jpg","https://nzhobbies.com/hobbywing-30404401-quicrun-3652sl-black-g2-motor-quicrun-3652-4000kv-sl-g2-motor/"],
 ["motor-spektrum.jpg","https://www.towerhobbies.com/cars-and-trucks/parts-electronics-and-accessories/motors/"],
 ["esc-hobbywing.jpg","https://tamico.de/Hobbywing-QuicRun-WP8BL150-G2-Brushless-Regler-150A-3-6S-fuer-18"],
 ["battery-absima.jpg","https://www.absima.shop/RC-ACCESSORIES/Charging-Technology-Battery/LiPo-Batteries/Competition-LiPo-HV-140C-2S1P-HC-8500mAh-5mm.htm"],
 ["battery-spektrum.jpg","https://tamico.de/Spektrum-LiPo-Akku-6800mAh-3S-111V-Smart-Pro-Basher-120C-IC5"],
 ["charger-absima.jpg","https://www.hoelleinshop.com/All-you-need-for-electric-flight/Chargers-and-power-supplies/Chargers-12V-and-230V/Absima/Ladegeraet-Absima-APC-1-fuer-1-6S-max-10A-80W-incl-Zubehoer.htm"],
 ["hex-driver-set.jpg","https://urgenexrc.com/products/4pcs-black-gold-titanium-hex-driver-set-1-5-2-0-2-5-3-0mm-for-traxxas-rc-car-truck-fpv-helicopter"],
 ["suspension-arms.jpg","https://modeltune.com.au/products/front-arms-c-hubs-steering-blocks-for-axial-scx10-ii"],
 ["diff-gears.jpg","https://www.joom.com/en/products/5f17dc0a7e849d0106ef6a02"],
 ["servo-20kg.png","https://speedyfpv.com/products/20kg-servo-metal-gears"],
 ["motor-mount.jpg","https://997raceway.com/products/yeah-racing-aluminum-motor-mount"],
 ["bearing-kit.jpg","https://www.amainhobbies.com/fasteddy-bearings-1-10-scale-sealed-bearing-kit-fed-10sc/p265020"],
 ["cvd-driveshaft.webp","https://wheelspinmodels.co.uk/i/313738/"],
 ["four-way-wrench.jpg","https://www.buddyrc.com/products/4-way-wheel-wrench"],
 ["soldering-station.jpg","https://www.outsiders.co.nz/products/rc-soldering-station"],
 ["digital-caliper.webp","https://pick1up.com/products/protek-rc-digital-caliper-6in"],
 ["setup-station.jpg","https://rcamerica.com/products/rc-car-setup-stand"],
 ["battery-checker.jpg","https://super-rc.co.uk/products/lipo-battery-checker"],
 ["cooling-fan.jpg","https://www.mrcplaza.com.au/products/yeah-racing-aluminum-high-speed-motor-cooling-fan"],
 ["led-lightbar.jpg","https://www.walmart.com/ip/RC-LED-Light-Bar-Headlights-Set/"],
 ["drift-body-clear.jpg","https://www.amainhobbies.com/mst-1-10-rc-drift-car-body-clear-mst-720008/p1529021"],
 ["xt60-connectors.jpg","https://epartners.co.nz/products/xt60-xt-60-male-female-plug-and-connector-set"],
 ["body-clips.jpg","https://www.walmart.com/ip/RC-Car-Body-Clips/"],
 ["radio-transmitter.jpg","https://www.hobbymatehobby.com/products/flysky-2-4g-6ch-transmitter-receiver"],
 ["hex-driver-set.jpg","https://urgenexrc.com/products/4pcs-black-gold-titanium-hex-driver-set-1-5-2-0-2-5-3-0mm-for-traxxas-rc-car-truck-fpv-helicopter"],
 ["wheel-tire-green.jpg","https://www.walmart.com/ip/Rc-Tires-1-10-Truck-Tires-and-Wheels-Remote-Control-Truck-Tires-Green/16266213048"],
];
