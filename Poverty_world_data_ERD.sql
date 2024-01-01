-- Exported from QuickDBD: https://www.quickdatabasediagrams.com/
-- Link to schema: https://app.quickdatabasediagrams.com/#/d/noNYjB
-- NOTE! If you have used non-SQL datatypes in your design, you will have to change these here.


CREATE TABLE "poverty_wor1d_data" (
    "country_code" VARCHAR   NOT NULL,
    "country_name" VARCHAR   NOT NULL,
    "region" VARCHAR   NOT NULL,
    "corruption_index_score" INT   NOT NULL,
    "rank" INT   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    "female_gross_enrolment" INT   NOT NULL,
    "male_gross_enrolment" INT   NOT NULL,
    "income_less_than_two_one_five" INT   NOT NULL,
    CONSTRAINT "pk_poverty_wor1d_data" PRIMARY KEY (
        "country_code"
     )
);

CREATE TABLE "poverty_corruption" (
    "country_code" VARCHAR   NOT NULL,
    "country_name" VARCHAR   NOT NULL,
    "region" VARCHAR   NOT NULL,
    "corruption_index_score" INT   NOT NULL,
    "rank" INT   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    CONSTRAINT "pk_poverty_corruption" PRIMARY KEY (
        "country_code"
     )
);

CREATE TABLE "poverty_education" (
    "country_code" VARCHAR   NOT NULL,
    "country_name" VARCHAR   NOT NULL,
    "region" VARCHAR   NOT NULL,
    "latitude" FLOAT   NOT NULL,
    "longitude" FLOAT   NOT NULL,
    "female_gross_enrolment" INT   NOT NULL,
    "male_gross_enrolment" INT   NOT NULL,
    CONSTRAINT "pk_poverty_education" PRIMARY KEY (
        "country_code"
     )
);

CREATE TABLE "poverty_income" (
    "country_code" VARCHAR   NOT NULL,
    "country_name" VARCHAR   NOT NULL,
    "income_less_than_two_one_five" INT   NOT NULL,
    CONSTRAINT "pk_poverty_income" PRIMARY KEY (
        "country_code"
     )
);

ALTER TABLE "poverty_wor1d_data" ADD CONSTRAINT "fk_poverty_wor1d_data_country_code" FOREIGN KEY("country_code")
REFERENCES "poverty_corruption" ("country_code");

ALTER TABLE "poverty_corruption" ADD CONSTRAINT "fk_poverty_corruption_country_code" FOREIGN KEY("country_code")
REFERENCES "poverty_education" ("country_code");

ALTER TABLE "poverty_education" ADD CONSTRAINT "fk_poverty_education_country_code" FOREIGN KEY("country_code")
REFERENCES "poverty_income" ("country_code");

ALTER TABLE "poverty_income" ADD CONSTRAINT "fk_poverty_income_country_code" FOREIGN KEY("country_code")
REFERENCES "poverty_wor1d_data" ("country_code");

