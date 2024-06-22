W pliku tsconfig.json mam takie opcje:
"target": "es2016",
"lib": ["ES2015", "DOM"],
"module": "commonjs",
"esModuleInterop": true,
"forceConsistentCasingInFileNames": true,
"strict": true,
"skipLibCheck": true

Najważniejsza z nich to "lib" w której dodane jest ES2015 bo bez tego nie chciało
mi działać await. 
Następnie w terminalu wystarczy wykonać polecenie: tsc