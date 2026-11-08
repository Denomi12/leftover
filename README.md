# Leftover

Leftover je spletna aplikacija za upravljanje živil v gospodinjstvu, načrtovanje obrokov in zmanjševanje količine zavržene hrane. Uporabniki v skupnem gospodinjstvu spremljajo zalogo živil in roke uporabe, prejemajo opozorila o živilih, ki jim kmalu poteče rok, načrtujejo obroke za prihodnje dni in iz manjkajočih sestavin samodejno dobijo nakupovalni seznam. Ko je obrok pripravljen, se porabljene količine samodejno odštejejo od zaloge.

## Tehnologije

| Del             | Tehnologije                                    |
| --------------- | ---------------------------------------------- |
| Frontend        | Svelte (SvelteKit), TypeScript, Vite           |
| Backend         | Node.js, NestJS, TypeScript, Swagger / OpenAPI |
| Podatkovna baza | PostgreSQL, TypeORM                            |
| Avtentikacija   | JWT, Passport, bcrypt                          |
| Razvoj          | Docker, Docker Compose, ESLint, Prettier       |
| Testiranje      | Playwright (E2E in API testi)                  |

## Struktura repozitorija

```
├── frontend/   # spletni vmesnik (SvelteKit)
├── backend/    # REST API (NestJS)
└── docs/       # dokumentacija projekta
```

## Lokalni zagon

Potrebno: Node.js 24, pnpm, Docker.

```bash
pnpm install
pnpm docker:up
```

Swagger dokumentacija API-ja: http://localhost:3000/api/docs

Migracije (v `backend/`):

```bash
pnpm migration:generate libs/db/migrations/<imeMigracije>
pnpm migration:run
pnpm migration:revert
```

## Dokumentacija

- [Zasnova rešitve](docs/01-zasnova-resitve.md)
- [Funkcionalnosti in obseg](docs/02-funkcionalnosti-in-obseg.md)
- [Podatkovni model](docs/03-podatkovni-model.md)
- [Arhitektura in tehnološki sklad](docs/04-arhitektura-in-tehnoloski-sklad.md)
- [Uporabniške zgodbe](docs/05-uporabniske-zgodbe.md)
- [Wireframes](docs/06-wireframes.md)
- [Arhitekturne odločitve (ADR)](docs/adr/)
