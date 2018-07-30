--
-- PostgreSQL database dump
--

-- Dumped from database version 10.0
-- Dumped by pg_dump version 10.4

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET client_min_messages = warning;

ALTER TABLE IF EXISTS ONLY public.hd_landscape DROP CONSTRAINT IF EXISTS pk_hd_landscape;
DROP TABLE IF EXISTS public.hd_landscape;
SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: hd_landscape; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hd_landscape (
    geo_level character varying(15) NOT NULL,
    geo_code character varying(10) NOT NULL,
    geo_version character varying(100) DEFAULT ''::character varying NOT NULL,
    "Indicator" character varying(128) NOT NULL,
    total double precision
);


--
-- Data for Name: hd_landscape; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hd_landscape (geo_level, geo_code, geo_version, "Indicator", total) FROM stdin;
country	NG	2009	Public Health Expenditure(% of GDP)	0.900000000000000022
country	NG	2009	Pupil Teacher Ratio Primary School	38
country	NG	2009	Domestic Food Price Level Index	6.29999999999999982
country	NG	2009	Gender Development Index	0.849999999999999978
country	NG	2009	Population living below income poverty line, PPP $1.90 a day (%)	53.5
country	NG	2009	Homicide rate (per 100,000 people)	10.0999999999999996
country	NG	2009	Internet users (% of population)	47.3999999999999986
country	NG	2009	Forest area (% of total land area)	7.70000000000000018
country	SN	2009	Public Health Expenditure(% of GDP)	2.39999999999999991
country	SN	2009	Pupil Teacher Ratio Primary School	32
country	SN	2009	Domestic Food Price Level Index	8.69999999999999929
country	SN	2009	Gender Development Index	0.890000000000000013
country	SN	2009	Population living below income poverty line, PPP $1.90 a day (%)	38
country	SN	2009	Homicide rate (per 100,000 people)	7.90000000000000036
country	SN	2009	Internet users (% of population)	21.6999999999999993
country	SN	2009	Forest area (% of total land area)	43
country	TZ	2009	Public Health Expenditure(% of GDP)	2.60000000000000009
country	TZ	2009	Pupil Teacher Ratio Primary School	43
country	TZ	2009	Domestic Food Price Level Index	4.79999999999999982
country	TZ	2009	Gender Development Index	0.939999999999999947
country	TZ	2009	Population living below income poverty line, PPP $1.90 a day (%)	46.6000000000000014
country	TZ	2009	Homicide rate (per 100,000 people)	7.90000000000000036
country	TZ	2009	Internet users (% of population)	5.40000000000000036
country	TZ	2009	Forest area (% of total land area)	52
\.


--
-- Name: hd_landscape pk_hd_landscape; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hd_landscape
    ADD CONSTRAINT pk_hd_landscape PRIMARY KEY (geo_level, geo_code, geo_version, "Indicator");


--
-- PostgreSQL database dump complete
--

