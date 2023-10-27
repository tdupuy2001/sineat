-- -----------------------------------------------------
-- drop every Table
-- -----------------------------------------------------

drop table if exists abonnement cascade;
drop table if exists "collection" cascade;
drop table if exists contenu_collection cascade;
drop table if exists enregistrement_post cascade;
drop table if exists est_commentaire_de cascade;
drop table if exists etablissement cascade;
drop table if exists etablissement_de_type cascade;
drop table if exists liked_collection cascade ;
drop table if exists liked_post cascade;
drop table if exists mot_cle cascade;
drop table if exists mot_cle_post cascade;
drop table if exists note cascade;
drop table if exists note_concerne cascade;
drop table if exists post cascade;
drop table if exists regime cascade;
drop table if exists regime_etablissement cascade;
drop table if exists regimes_de_l_user cascade;
drop table if exists type_etablissement cascade;
drop table if exists type_note cascade;
drop table if exists "user" cascade;

-- -----------------------------------------------------
-- Table user
-- -----------------------------------------------------

create table "user" (
  "id_user" serial primary key,
  "username" text not null,
  "role" text not null default 'user',
  "nom" text,
  "prenom" text,
  "date_de_naissance" date not null,
  "genre" text,
  "email" text not null,
  "adresse" text,
  "password" text,
  "ppbin" bytea,
  "ppform" text,
  "langue" text not null,
  "description" text,
  constraint avatar check (
    (ppbin is null and ppform is null)
    or
    (ppbin is not null and ppform is not null)
  )
);


-- -----------------------------------------------------
-- Table etablissement
-- -----------------------------------------------------

create table "etablissement" (
  "id_etablissement" serial primary key,
  "adresse" text not null,
  "nom" text not null,
  "approuved" boolean default false,
  "description" text
);


-- -----------------------------------------------------
-- Table note
-- -----------------------------------------------------

create table "note" (
  "id_note" serial,
  "id_etablissement" int not null,
  "id_user" int not null,
  -- "date" date null,
  primary key ("id_note", "id_etablissement", "id_user"),
  constraint "etablissement_note_fk"
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint "user_note_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create unique index idnote_unique on "note" ("id_note");
create index etablissement_note_idx on "note" ("id_etablissement");
create index user_note_idx on "note" ("id_user");



-- -----------------------------------------------------
-- Table post
-- -----------------------------------------------------

create table "post" (
  "id_post" serial primary key,
  "id_user" int not null,
  "text" text,
  "date" date not null,
  "type" text not null,
  "afficher" boolean not null default true,
  "id_note" int,
  constraint "id_user_post_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade,
  constraint "id_note_post_fk"
    foreign key ("id_note")
    references "note" ("id_note")
    on delete cascade
    on update cascade
);

create unique index idpost_post_unique on "post" ("id_post");
create index iduser_post_idx on "post" ("id_user");
create index idnote_post_idx on "post" ("id_note");


-- -----------------------------------------------------
-- Table type_etablissement
-- -----------------------------------------------------

create table "type_etablissement" (
  "id_type_etablissement" serial primary key,
  "nom" text not null
);


-- -----------------------------------------------------
-- Table type_note
-- -----------------------------------------------------

create table "type_note" (
  "id_type_note" serial primary key,
  "nom" text not null
);


-- -----------------------------------------------------
-- Table abonnement
-- -----------------------------------------------------

create table abonnement (
  id_user1 int not null,
  id_user2 int not null,
  primary key (id_user1, id_user2),
  constraint user_fk
    foreign key (id_user1)
    references "user" (id_user)
    on delete cascade
    on update cascade,
  constraint user2_fk
    foreign key (id_user2)
    references "user" (id_user)
    on delete cascade
    on update cascade
);

create index user2_abonnement_idx on abonnement (id_user2);




-- -----------------------------------------------------
-- Table "collection"
-- -----------------------------------------------------

create table "collection" (
  id_collection serial primary key,
  nom text not null,
  "public" boolean not null default true
);

create index idcollection_idx on "collection" ("id_collection");


-- -----------------------------------------------------
-- Table enregistrement_post
-- -----------------------------------------------------

create table  "enregistrement_post" (
  "id_user" int not null,
  "id_post" int not null,
  primary key ("id_post", "id_user"),
  constraint post_enre_post_fk
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "user_enre_post_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index user_enregistrement_post_idx on "enregistrement_post" ("id_user");


-- -----------------------------------------------------
-- Table contenu_collection
-- -----------------------------------------------------

create table contenu_collection (
  "id_user" int not null,
  "id_post" int not null,
  "id_collection" int not null,
  primary key ("id_user", "id_post", "id_collection"),
  constraint "enregistrement_cont_coll_fk"
    foreign key ("id_user", "id_post")
    references "enregistrement_post" ("id_user", "id_post")
    on delete cascade
    on update cascade,
  constraint "collection_cont_coll_fk"
    foreign key ("id_collection")
    references "collection" ("id_collection")
    on delete cascade
    on update cascade
);

create index contenu_collection_idx on "contenu_collection" ("id_collection");


-- -----------------------------------------------------
-- Table est_commentaire_de
-- -----------------------------------------------------

create table "est_commentaire_de" (
  "id_post1" int not null,
  "id_post2" int not null,
  primary key ("id_post1", "id_post2"),
  constraint post1_fk
    foreign key ("id_post1")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint post2_fk
    foreign key ("id_post2")
    references "post" ("id_post")
    on delete cascade
    on update cascade
);

create index post2_commentairede_idx on "est_commentaire_de" ("id_post2");


-- -----------------------------------------------------
-- Table etablissement_de_type
-- -----------------------------------------------------

create table "etablissement_de_type" (
  "id_etablissement" int not null,
  "id_type_etablissement" int not null,
  primary key ("id_etablissement", "id_type_etablissement"),
  constraint etablissement_eta_de_ty_fk
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint type_etablissement_eta_de_ty_fk
    foreign key ("id_type_etablissement")
    references "type_etablissement" ("id_type_etablissement")
    on delete cascade
    on update cascade
);

create index typeetablissement_idx on "etablissement_de_type" ("id_type_etablissement");


-- -----------------------------------------------------
-- Table liked_collection
-- -----------------------------------------------------

create table "liked_collection" (
  "id_user" int not null,
  "id_collection" int not null,
  primary key ("id_user", "id_collection"),
  constraint "collection_liked_coll_fk"
    foreign key ("id_collection")
    references "collection" ("id_collection")
    on delete cascade
    on update cascade,
  constraint "user_liked_coll_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index collection_idx on "liked_collection" ("id_collection");


-- -----------------------------------------------------
-- Table liked_post
-- -----------------------------------------------------

create table "liked_post" (
  "id_post" int not null,
  "id_user" int not null,
  primary key ("id_post", "id_user"),
  constraint "id_post_liked_post_fk"
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "id_user_liked_post_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index "iduser_likedpost_idx" on "liked_post" ("id_user");


-- -----------------------------------------------------
-- Table mot_cle
-- -----------------------------------------------------

create table  "mot_cle" (
  "id_mot_cle" serial,
  "mot" text not null,
  primary key ("id_mot_cle")
);

create unique index idmotcle_unique_idx on "mot_cle" ("id_mot_cle");


-- -----------------------------------------------------
-- Table mot_cle_post
-- -----------------------------------------------------

create table "mot_cle_post" (
  "id_mot_cle" int not null,
  "id_post" int not null,
  primary key ("id_mot_cle", "id_post"),
  constraint "post_mot_cle_fk"
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "mot_cle_mot_cle_fk"
    foreign key ("id_mot_cle")
    references "mot_cle" ("id_mot_cle")
    on delete cascade
    on update cascade
);

create index post_motcle_idx on "mot_cle_post" ("id_post");


-- -----------------------------------------------------
-- Table note_concerne
-- -----------------------------------------------------

create table  "note_concerne" (
  "id_note" int not null,
  "id_type_note" int not null,
  "grade" int not null,
  primary key ("id_note", "id_type_note"),
  constraint "type_note_concerne_fk"
    foreign key ("id_type_note")
    references "type_note" ("id_type_note")
    on delete cascade
    on update cascade,
  constraint "note_note_concerne_fk"
    foreign key ("id_note")
    references "note" ("id_note")
    on delete cascade
    on update cascade
);

create index type_note_idx on "note_concerne" ("id_type_note");


-- -----------------------------------------------------
-- Table regime
-- -----------------------------------------------------

create table "regime" (
  "id_regime" serial primary key,
  "nom" text not null
);

-- -----------------------------------------------------
-- Table regime_etablissement
-- -----------------------------------------------------

create table "regime_etablissement" (
  "id_etablissement" int not null,
  "id_regime" int not null,
  primary key ("id_etablissement", "id_regime"),
  constraint "etablissement_regime_eta_fk"
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint "regime_regime_eta_fk"
    foreign key ("id_regime")
    references "regime" ("id_regime")
    on delete cascade
    on update cascade
);

create index regime_etablissement_idx on "regime_etablissement" ("id_regime");


-- -----------------------------------------------------
-- Table regimes_de_l_user
-- -----------------------------------------------------

create table "regimes_de_l_user" (
  "id_user" int not null,
  "id_regime" int not null,
  primary key ("id_user", "id_regime"),
  constraint "user_regime_use_fk"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade,
  constraint "regime_regime_use_fk"
    foreign key ("id_regime")
    references "regime" ("id_regime")
    on delete cascade
    on update cascade
);

create index regime_user_idx on "regimes_de_l_user" ("id_regime");
