# Pregled projekta

Pregled temelji na primerjavi dokumentacije z implementacijo v zaledju in uporabniškem vmesniku, brez zagona aplikacije.

## Implementirane funkcionalnosti MVP

Implementiranih je vseh šest funkcionalnosti MVP iz dokumenta 02-funkcionalnosti-in-obseg.md:

- skupna zaloga živil s količino, enoto in rokom uporabe;
- razvrščanje po roku uporabe in oznaki »Kmalu poteče« ter »Poteklo«;
- načrtovanje obrokov s sestavinami in prikazom manjkajočih količin;
- samodejni nakupovalni seznam s skupnimi manjkajočimi količinami;
- samodejno odštevanje zaloge ob pripravi obroka;
- ustvarjanje gospodinjstev, vabila in dostop glede na vloge lastnik, član in gost.

## Pregled petih uporabniških zgodb

Pregledanih je prvih pet zgodb iz dokumenta 05-uporabniske-zgodbe.md.

| Zgodba | Ustreznost implementacije |
| --- | --- |
| US-01 – Evidenca zaloge | Da. Vnos se preverja, količina mora biti pozitivna, zaloga je omejena na gospodinjstvo, gost ne more dodajati. |
| US-02 – Opozorila o roku | Da. Razvrščanje in oznake za potekla živila ter rok v naslednjih treh dneh so implementirani. |
| US-03 – Načrt obrokov | Da. Preverjajo se obvezna polja in sestavine, obroki so urejeni po datumu, prikazane so zaloga in manjkajoče količine; gost ima samo vpogled. |
| US-04 – Nakupovalni seznam | Da. Manjkajoče sestavine se samodejno dodajajo in seštevajo za več obrokov; zadostna zaloga se upošteva. |
| US-05 – Odštevanje porabe | Da. Zaloga se zmanjša brez negativnih količin, prazne postavke se izbrišejo, ponovna potrditev in potrjevanje gosta sta preprečena. |
