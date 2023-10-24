


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
  "username" varchar(100) not null,
  "role" varchar(45) not null,
  "nom" varchar(45),
  "prenom" varchar(45),
  "date_de_naissance" date not null,
  "genre" varchar(45),
  "email" varchar(70) not null,
  "adresse" varchar(45),
  "password" varchar(45),
  "ppbin" bytea,
  "ppform" text,
  "langue" varchar(45) not null,
  "description" text,
  constraint avatar check (
    (ppbin is null and ppform is null)
    or
    (ppbin is not null and ppform is not null)
  )
);


-- CREATE TABLE IF NOT EXISTS `mydb`.`User` (
--   `idUser` INT NOT NULL AUTO_INCREMENT,
--   `username` VARCHAR(100) NOT NULL,
--   `role` VARCHAR(45) NOT NULL,
--   `nom` VARCHAR(45) NULL,
--   `prenom` VARCHAR(45) NULL,
--   `dateDeNaissance` DATE NOT NULL,
--   `genre` VARCHAR(45) NULL,
--   `email` VARCHAR(45) NOT NULL,
--   `adresse` VARCHAR(45) NULL,
--   `password` VARCHAR(45) NULL,
--   `ppbin` MEDIUMBLOB NULL,
--   `ppform` VARCHAR(45) NULL,
--   `langue` VARCHAR(45) NOT NULL,
--   `description` LONGTEXT NULL,
--   PRIMARY KEY (`idUser`),
--   UNIQUE INDEX `idUser_UNIQUE` (`idUser` ASC) VISIBLE)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table etablissement
-- -----------------------------------------------------

create table "etablissement" (
  "id_etablissement" serial primary key,
  "adresse" text not null,
  "nom" varchar(45) not null,
  "approuved" boolean default false,
  "description" text
);



-- CREATE TABLE IF NOT EXISTS `mydb`.`Etablissement` (
--   `idEtablissement` INT NOT NULL AUTO_INCREMENT,
--   `adresse` VARCHAR(45) NOT NULL,
--   `nom` VARCHAR(45) NOT NULL,
--   `approuved` TINYINT NULL DEFAULT 0,
--   `description` LONGTEXT NULL,
--   PRIMARY KEY (`idEtablissement`))
-- ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table note
-- -----------------------------------------------------

create table "note" (
  "id_note" serial,
  "id_etablissement" int not null,
  "id_user" int not null,
  -- "date" date null,
  primary key ("id_note", "id_etablissement", "id_user"),
  constraint "etablissement"
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint "user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create unique index idnote_unique on "note" ("id_note");
create index etablissement_note_idx on "note" ("id_etablissement");
create index user_note_idx on "note" ("id_user");


-- CREATE TABLE IF NOT EXISTS `mydb`.`Note` (
--   `idNote` INT NOT NULL AUTO_INCREMENT,
--   `idEtablissement` INT NOT NULL,
--   `idUser` INT NOT NULL,
--   `date` DATETIME NULL,
--   PRIMARY KEY (`idNote`, `idEtablissement`, `idUser`),
--   UNIQUE INDEX `idNote_UNIQUE` (`idNote` ASC) VISIBLE,
--   INDEX `etablissement_idx` (`idEtablissement` ASC) VISIBLE,
--   INDEX `user_idx` (`idUser` ASC) VISIBLE,
--   CONSTRAINT `etablissement`
--     FOREIGN KEY (`idEtablissement`)
--     REFERENCES `mydb`.`Etablissement` (`idEtablissement`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `user`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table post
-- -----------------------------------------------------

create table "post" (
  "id_post" serial primary key,
  "id_user" int not null,
  "text" text,
  "date" date not null,
  "type" varchar(45) not null,
  "afficher?" boolean not null default true,
  "id_note" int,
  constraint "id_user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade,
  constraint "id_note"
    foreign key ("id_note")
    references "note" ("id_note")
    on delete cascade
    on update cascade
);

create unique index idpost_post_unique on "post" ("id_post");
create index iduser_post_idx on "post" ("id_user");
create index idnote_post_idx on "post" ("id_note");


-- CREATE TABLE IF NOT EXISTS `mydb`.`Post` (
--   `idPost` INT NOT NULL AUTO_INCREMENT,
--   `idUser` INT NOT NULL,
--   `text` LONGTEXT NULL,
--   `date` DATETIME NOT NULL,
--   `type` VARCHAR(45) NOT NULL,
--   `afficher?` TINYINT NOT NULL DEFAULT 1,
--   `idNote` INT NULL,
--   PRIMARY KEY (`idPost`),
--   UNIQUE INDEX `idPost_UNIQUE` (`idPost` ASC) VISIBLE,
--   INDEX `idUser_idx` (`idUser` ASC) VISIBLE,
--   INDEX `idnote_idx` (`idNote` ASC) VISIBLE,
--   CONSTRAINT `idUser`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `idnote`
--     FOREIGN KEY (`idNote`)
--     REFERENCES `mydb`.`Note` (`idNote`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table type_etablissement
-- -----------------------------------------------------

create table "type_etablissement" (
  "id_type_etablissement" serial primary key,
  "nom" varchar(45)
);


-- CREATE TABLE IF NOT EXISTS `mydb`.`TypeEtablissement` (
--   `idTypeEtablissement` INT NOT NULL,
--   `nom` VARCHAR(45) NULL,
--   PRIMARY KEY (`idTypeEtablissement`))
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table type_note
-- -----------------------------------------------------

create table "type_note" (
  "id_type_note" serial primary key,
  "nom" varchar(45) not null
);


-- CREATE TABLE IF NOT EXISTS `mydb`.`TypeNote` (
--   `idTypeNote` INT NOT NULL AUTO_INCREMENT,
--   `nom` VARCHAR(45) NOT NULL,
--   PRIMARY KEY (`idTypeNote`))
-- ENGINE = InnoDB;


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
    on delete cascade,
  constraint user2_fk
    foreign key (id_user2)
    references "user" (id_user)
    on delete cascade
);

create index user2_abonnement_idx on abonnement (id_user2);




-- -----------------------------------------------------
-- Table "collection"
-- -----------------------------------------------------

create table "collection" (
  id_collection serial primary key,
  nom varchar(45) not null,
  "public" boolean not null default true
);

create index idcollection_idx on "collection" ("id_collection");


-- CREATE TABLE IF NOT EXISTS `mydb`.`Collection` (
--   `idCollection` INT NOT NULL AUTO_INCREMENT,
--   `nom` VARCHAR(45) NOT NULL,
--   `public` TINYINT NOT NULL DEFAULT 1,
--   PRIMARY KEY (`idCollection`),
--   UNIQUE INDEX `idCollection_UNIQUE` (`idCollection` ASC) VISIBLE)
-- ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table enregistrement_post
-- -----------------------------------------------------

create table  "enregistrement_post" (
  "id_post" int not null,
  "id_user" int not null,
  primary key ("id_post", "id_user"),
  constraint post
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index user_enregistrement_post_idx on "enregistrement_post" ("id_user");


-- CREATE TABLE IF NOT EXISTS `mydb`.`EnregistrementPost` (
--   `idPost` INT NOT NULL,
--   `idUser` INT NOT NULL,
--   PRIMARY KEY (`idPost`, `idUser`),
--   INDEX `user_idx` (`idUser` ASC) VISIBLE,
--   CONSTRAINT `post`
--     FOREIGN KEY (`idPost`)
--     REFERENCES `mydb`.`Post` (`idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `user`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table contenu_collection
-- -----------------------------------------------------

create table contenu_collection (
  "id_user" int not null,
  "id_post" int not null,
  "id_collection" int not null,
  primary key ("id_user", "id_post", "id_collection"),
  constraint "enregistrement"
    foreign key ("id_user", "id_post")
    references "enregistrement_post" ("id_user", "id_post")
    on delete cascade,
  constraint "collection"
    foreign key ("id_collection")
    references "collection" ("id_collection")
    on delete cascade
);

create index contenu_collection_idx on "contenu_collection" ("id_collection");



-- CREATE TABLE IF NOT EXISTS `mydb`.`ContenuCollection` (
--   `idUser` INT NOT NULL,
--   `idPost` INT NOT NULL,
--   `idCollection` INT NOT NULL,
--   PRIMARY KEY (`idUser`, `idPost`, `idCollection`),
--   INDEX `collection_idx` (`idCollection` ASC) VISIBLE,
--   CONSTRAINT `enregistrement`
--     FOREIGN KEY (`idUser` , `idPost`)
--     REFERENCES `mydb`.`EnregistrementPost` (`idUser` , `idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `collection`
--     FOREIGN KEY (`idCollection`)
--     REFERENCES `mydb`.`Collection` (`idCollection`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;





-- -----------------------------------------------------
-- Table est_commentaire_de
-- -----------------------------------------------------

create table "est_commentaire_de" (
  "id_post1" int not null,
  "id_post2" int not null,
  primary key ("id_post1", "id_post2"),
  constraint post1
    foreign key ("id_post1")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint post2
    foreign key ("id_post2")
    references "post" ("id_post")
    on delete cascade
    on update cascade
);

create index post2_commentairede_idx on "est_commentaire_de" ("id_post2");


-- CREATE TABLE IF NOT EXISTS `mydb`.`EstCommentaireDe` (
--   `idPost1` INT NOT NULL,
--   `idPost2` INT NOT NULL,
--   PRIMARY KEY (`idPost1`, `idPost2`),
--   INDEX `post2_idx` (`idPost2` ASC) VISIBLE,
--   CONSTRAINT `post1`
--     FOREIGN KEY (`idPost1`)
--     REFERENCES `mydb`.`Post` (`idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `post2`
--     FOREIGN KEY (`idPost2`)
--     REFERENCES `mydb`.`Post` (`idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;





-- -----------------------------------------------------
-- Table etablissement_de_type
-- -----------------------------------------------------

create table "etablissement_de_type" (
  "id_etablissement" int not null,
  "id_type_etablissement" int not null,
  primary key ("id_etablissement", "id_type_etablissement"),
  constraint etablissement
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint type_etablissement
    foreign key ("id_type_etablissement")
    references "type_etablissement" ("id_type_etablissement")
    on delete cascade
    on update cascade
);

create index typeetablissement_idx on "etablissement_de_type" ("id_type_etablissement");

-- CREATE TABLE IF NOT EXISTS `mydb`.`EtablissementDeType` (
--   `idEtablissement` INT NOT NULL,
--   `idTypeEtablissement` INT NOT NULL,
--   PRIMARY KEY (`idEtablissement`, `idTypeEtablissement`),
--   INDEX `typeetablissement_idx` (`idTypeEtablissement` ASC) VISIBLE,
--   CONSTRAINT `etablissement`
--     FOREIGN KEY (`idEtablissement`)
--     REFERENCES `mydb`.`Etablissement` (`idEtablissement`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `typeetablissement`
--     FOREIGN KEY (`idTypeEtablissement`)
--     REFERENCES `mydb`.`TypeEtablissement` (`idTypeEtablissement`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table liked_collection
-- -----------------------------------------------------

create table "liked_collection" (
  "id_user" int not null,
  "id_collection" int not null,
  primary key ("id_user", "id_collection"),
  constraint "collection"
    foreign key ("id_collection")
    references "collection" ("id_collection")
    on delete cascade
    on update cascade,
  constraint "user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index collection_idx on "liked_collection" ("id_collection");


-- CREATE TABLE IF NOT EXISTS `mydb`.`LikedCollection` (
--   `idUser` INT NOT NULL,
--   `idCollection` INT NOT NULL,
--   PRIMARY KEY (`idUser`, `idCollection`),
--   INDEX `collection_idx` (`idCollection` ASC) VISIBLE,
--   CONSTRAINT `collection`
--     FOREIGN KEY (`idCollection`)
--     REFERENCES `mydb`.`Collection` (`idCollection`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `user`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table liked_post
-- -----------------------------------------------------

create table "liked_post" (
  "id_post" int not null,
  "id_user" int not null,
  primary key ("id_post", "id_user"),
  constraint "id_post"
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "id_user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade
);

create index "iduser_likedpost_idx" on "liked_post" ("id_user");


-- CREATE TABLE IF NOT EXISTS `mydb`.`LikedPost` (
--   `idPost` INT NOT NULL,
--   `idUser` INT NOT NULL,
--   PRIMARY KEY (`idPost`, `idUser`),
--   INDEX `idUser_idx` (`idUser` ASC) VISIBLE,
--   CONSTRAINT `idPost`
--     FOREIGN KEY (`idPost`)
--     REFERENCES `mydb`.`Post` (`idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `idUser`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table mot_cle
-- -----------------------------------------------------

create table  "mot_cle" (
  "id_mot_cle" serial,
  "mot" varchar(45) not null,
  primary key ("id_mot_cle")
);

create unique index idmotcle_unique_idx on "mot_cle" ("id_mot_cle");


-- CREATE TABLE IF NOT EXISTS `mydb`.`MotCle` (
--   `idMotCle` INT NOT NULL AUTO_INCREMENT,
--   `Mot` VARCHAR(45) NOT NULL,
--   PRIMARY KEY (`idMotCle`),
--   UNIQUE INDEX `idMotCle_UNIQUE` (`idMotCle` ASC) VISIBLE)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table mot_cle_post
-- -----------------------------------------------------

create table "mot_cle_post" (
  "id_mot_cle" int not null,
  "id_post" int not null,
  primary key ("id_mot_cle", "id_post"),
  constraint "post"
    foreign key ("id_post")
    references "post" ("id_post")
    on delete cascade
    on update cascade,
  constraint "mot_cle"
    foreign key ("id_mot_cle")
    references "mot_cle" ("id_mot_cle")
    on delete cascade
    on update cascade
);

create index post_motcle_idx on "mot_cle_post" ("id_post");


-- CREATE TABLE IF NOT EXISTS `mydb`.`MotClePost` (
--   `idMotCle` INT NOT NULL,
--   `idPost` INT NOT NULL,
--   PRIMARY KEY (`idMotCle`, `idPost`),
--   INDEX `post_idx` (`idPost` ASC) VISIBLE,
--   CONSTRAINT `post`
--     FOREIGN KEY (`idPost`)
--     REFERENCES `mydb`.`Post` (`idPost`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `mot cle`
--     FOREIGN KEY (`idMotCle`)
--     REFERENCES `mydb`.`MotCle` (`idMotCle`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;





-- -----------------------------------------------------
-- Table note_concerne
-- -----------------------------------------------------

create table  "note_concerne" (
  "id_note" int not null,
  "id_type_note" int not null,
  "note" int not null,
  primary key ("id_note", "id_type_note"),
  constraint "type"
    foreign key ("id_type_note")
    references "type_note" ("id_type_note")
    on delete cascade
    on update cascade,
  constraint "note"
    foreign key ("id_note")
    references "note" ("id_note")
    on delete cascade
    on update cascade
);

create index type_note_idx on "note_concerne" ("id_type_note");


-- CREATE TABLE IF NOT EXISTS `mydb`.`NoteConcerne` (
--   `idNote` INT NOT NULL,
--   `idTypeNote` INT NOT NULL,
--   `Note` INT NOT NULL,
--   PRIMARY KEY (`idNote`, `idTypeNote`),
--   INDEX `type_idx` (`idTypeNote` ASC) VISIBLE,
--   CONSTRAINT `type`
--     FOREIGN KEY (`idTypeNote`)
--     REFERENCES `mydb`.`TypeNote` (`idTypeNote`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `note`
--     FOREIGN KEY (`idNote`)
--     REFERENCES `mydb`.`Note` (`idNote`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;




-- -----------------------------------------------------
-- Table regime
-- -----------------------------------------------------

create table "regime" (
  "id_regime" serial primary key,
  "nom" varchar(45) not null
);


-- CREATE TABLE IF NOT EXISTS `mydb`.`Regime` (
--   `idRegime` INT NOT NULL,
--   `nom` VARCHAR(45) NOT NULL,
--   PRIMARY KEY (`idRegime`))
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table regime_etablissement
-- -----------------------------------------------------

create table "regime_etablissement" (
  "id_etablissement" int not null,
  "id_regime" int not null,
  primary key ("id_etablissement", "id_regime"),
  constraint "etablissement"
    foreign key ("id_etablissement")
    references "etablissement" ("id_etablissement")
    on delete cascade
    on update cascade,
  constraint "regime"
    foreign key ("id_regime")
    references "regime" ("id_regime")
    on delete cascade
    on update cascade
);

create index regime_etablissement_idx on "regime_etablissement" ("id_regime");


-- CREATE TABLE IF NOT EXISTS `mydb`.`RegimeEtablissement` (
--   `idEtablissement` INT NOT NULL,
--   `idRegime` INT NOT NULL,
--   PRIMARY KEY (`idEtablissement`, `idRegime`),
--   INDEX `regime_idx` (`idRegime` ASC) VISIBLE,
--   CONSTRAINT `etablissement`
--     FOREIGN KEY (`idEtablissement`)
--     REFERENCES `mydb`.`Etablissement` (`idEtablissement`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `regime`
--     FOREIGN KEY (`idRegime`)
--     REFERENCES `mydb`.`Regime` (`idRegime`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table regimes_de_l_user
-- -----------------------------------------------------

create table "regimes_de_l_user" (
  "id_user" int not null,
  "id_regime" int not null,
  primary key ("id_user", "id_regime"),
  constraint "user"
    foreign key ("id_user")
    references "user" ("id_user")
    on delete cascade
    on update cascade,
  constraint "regime"
    foreign key ("id_regime")
    references "regime" ("id_regime")
    on delete cascade
    on update cascade
);

create index regime_user_idx on "regimes_de_l_user" ("id_regime");


-- CREATE TABLE IF NOT EXISTS `mydb`.`RegimesDeLUser` (
--   `idUser` INT NOT NULL,
--   `idRegime` INT NOT NULL,
--   PRIMARY KEY (`idUser`, `idRegime`),
--   INDEX `regime_idx` (`idRegime` ASC) VISIBLE,
--   CONSTRAINT `user`
--     FOREIGN KEY (`idUser`)
--     REFERENCES `mydb`.`User` (`idUser`)
--     ON DELETE cascade
--     ON UPDATE cascade,
--   CONSTRAINT `regime`
--     FOREIGN KEY (`idRegime`)
--     REFERENCES `mydb`.`Regime` (`idRegime`)
--     ON DELETE cascade
--     ON UPDATE cascade)
-- ENGINE = InnoDB;







