# sct-2016-client

Predmetni projekat iz predmeta Konstrukcija i testiranje softvera i Napredne veb tehnologije.

## Članovi tima

- SW3-2013  Stefan Ristanović
- SW9-2013  Bojan Blagojević
- SWF-2013  Dragutin Marjanović
- SW20-2013 Aleksa Zrnić

###

Aktivna verzija **v1.5**

## Struktura projekta

Organizacija entiteta projekta organizovana je na sledeći način:
```
- app
  - shared          // komponente koje se koriste na više mesta
  - components      // komponente, svaka u svom folderu (HTML, controller.js, directive.js, service.js)
- assets
  - css             // svi stilovi i stvari vezane za stilove
  - img             // sve slike
  - js              // JavaScript koji nije vezan za Angular konkretno
  - libs            // biblioteke, bower ih tu smešta
- index.html
```

## Rad sa **bower**-om

Instaliranje i pokretanje klijenta vrši putem nekog od dostupnih `command-line shell` (Command Prompt, PowerShell ili neki Unix ekvivalent).

Potrebno je da imate instaliran **npm** - *Node Package Manager*.

**Instaliranje `bower`-a**

```
$ npm install -g bower
```

**Dodavanje novih biblioteka**

Dodavanje i čuvanje nove biblioteke u `bower.json` datototeci vrši se komandom:
```
 bower install <package> --save
```

**Dobavljanje biblioteka**

Sve biblioteke se preuzimaju komandom (nakon pozicioniranja u direktorijum sa `bower.json` datotekom):
```
bower install
```
**Lokacija biblioteka**

Lokacija biblioteka navedena je u `.bowerrc` datoteci.


## Pokretanje klijent aplikacije

**Instaliranje jednostavnog http-servera**

```
$ npm install -g http-server
```

**Pokretanje servera**

Pokretanje klijenta se vrši pozicioniranjem u **awt-test-siit-project-2016-client** direktorijum i izvršavanjem komande:
```
http-server
```
Nakon uspešno izvršene prethodne komande biće prikazan URL klijenta.
