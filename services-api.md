# Services API

## Tasks

### ```/api/tasks```
Returns array with all tasks for a user

## Roles

### ```/api/roles/map?company=<company name>```
Returns arrays with all roles/groups for a company

```/api/roles/map?company=Bø vidaregåande skule```

returns

```
[
  "alle",
  "bovidaregaandeskule",
  "skole"
]
```

### ```/api/roles/list```
Returns array with all roles/groups

```
[
  {
    id: "alle",
    name: "Alle"
  },
  {
    id: "administrasjonen",
    name: "Administrasjonen"
  },
  {
    id: "skole",
    name: "Skole"
  },
  {
    id: "tannhelse",
    name: "Tannhelse"
  },
  {
    id: "administrativledelse",
    name: "Administrativ ledelse"
  },
...
...
```

## Shortcuts

```/api/shortcuts?roles=<role1>,<role2>,<role3>```

Returns array with shortcuts for roles

```api/shortcuts?roles=alle,administrasjonen,skole```

Returns

```
[
  {
    title: "Min side",
    description: "Ferier, fravær og reiseregninger",
    system: "visma",
    url: "http://tfk-fh-visma01:8200/enterprise",
    icon: "assessment"
  },
  {
    title: "Compilo",
    description: "Kvalitets og avvikssystem",
    system: "compilo",
    url: "https://kvalitetslosen.t-fk.no/",
    icon: "timeline"
  },
  {
    title: "Læring",
    description: "Oversikt over interne kurs og elektronisk opplæringsmateriell",
    system: "Sharepoint",
    url: "https://rom.t-fk.no/laering/Sider/default.aspx",
    icon: "school"
  },
  {
    title: "Servicetorget",
    description: "Servicetorg for IT, arkiv mm.",
    system: "CS",
    url: "https://rom.t-fk.no/laering/Sider/default.aspx",
    icon: "contact_mail"
  },
...
...
```

## Links

```/api/links?roles=<role1>,<role2>,<role3>```

Returns array with links for roles

```api/links?roles=alle,administrasjonen,skole```

Returns

```
[
  {
    title: "Arbeidsrom",
    description: "Område for samarbeid og dokumentdeling",
    system: "Sharepoint",
    url: "https://rom.t-fk.no/Arbeidsrom/Sider/default.aspx",
    icon: "work"
  },
  {
    title: "Prosjektveiviseren",
    description: "Rom for prosjektstyring",
    system: "Sharepoint",
    url: "https://rom.t-fk.no/sites/Prosjektveiviseren/SitePages/Portefolje.aspx",
    icon: "folder"
  },
  {
    title: "Kontaktinformasjon",
    description: "Kontaktinformasjon til Telemark fylkeskommune",
    system: "Sharepoint",
    url: "https://rom.t-fk.no/informasjon/kontaktinformasjon/Sider/default.aspx",
    icon: "contact_phone"
  },
  {
    title: "Kontaktinformasjon skoler",
    description: "Kontaktinformasjon til skolene i Telemark fylkeskommune",
    system: "Sharepoint",
    url: "https://rom.t-fk.no/informasjon/kontaktinformasjon/Sider/Skoler.aspx",
    icon: "school"
  },
...
...
```

## Content

```/api/content/{user}?roles=<role1>,<role2>,<role3>```

Returns content for a users roles/groups

```api/content/gasg?roles=alle,administrasjonen,skole```

Returns

```
{
  "user":"gasg",
  "data": {
    "ads": [
      {
        "title": "Test AD",
        "summary": "",
        "description": "",
        "tags": [
          "administrasjonen"
        ],
        "url": "http://dev.telemarkportalen.vpdev.no/artikler/2016/test-ad",
        "matrixData": [
          {
            "htmlContent": "<p><img src=\"http://dev.telemarkportalen.vpdev.no/images/esd0492.jpg\"></p>"}
        ],
        "jsonUrl": "http://dev.telemarkportalen.vpdev.no/artikler/93.json"}
    ],
    "news": [
      {
        "title": "Nye tjenestebiler ",
        "summary": "<p>Våre to Octavia er byttet ut med El Golf og Ford Focus er byttet ut med Golf Hybrid.</p>",
        "description": "<p>Disse er nå tilgjengelig for bruk. Vi tenker el biler i første omgang er beregnet for kjøring i Grenland- Nome og vil du lengre så er hybrid ett godt alternativ, men ønsket vårt er å kjøre den også på strøm så lenge som mulig. &nbsp;</p>\r\n\r\n<p>Bilene vil ha fast oppstillingsplass ved vår ladestasjon. Når bilene settes tilbake etter bruk skal de settes ved ladestasjonen og kontakten plugges i. Vår lokale leverandør Skien Bil vil mandag 23 mai Kl 13-15 avholde infomøte vedr bilene samt at det blir gitt informasjon ute ved bilene og vist ulike instruksjoner. Også åpent for spørsmål vedr bruk av el og hybridbil. Møteinnkalling kommer til alle på mail. Så for dere som bruker tjenestebil ofte så håper jeg dere stiller opp på dette.</p>\r\n\r\n<p>Mvh Team Service v/ Tom Erik\r\n</p>",
        "tags": [
          "administrasjonen"
        ],
        "url": "http://dev.telemarkportalen.vpdev.no/artikler/2016/nye-tjenestebiler",
        "matrixData": [],
        "jsonUrl": "http://dev.telemarkportalen.vpdev.no/artikler/92.json"}
     ]
  }
}
```