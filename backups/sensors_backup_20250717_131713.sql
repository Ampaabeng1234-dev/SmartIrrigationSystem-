--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: sensor_readings; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.sensor_readings (
    id integer NOT NULL,
    zone_id integer,
    moisture_level real NOT NULL,
    temperature real,
    humidity real,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.sensor_readings OWNER TO neondb_owner;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.sensor_readings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.sensor_readings_id_seq OWNER TO neondb_owner;

--
-- Name: sensor_readings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.sensor_readings_id_seq OWNED BY public.sensor_readings.id;


--
-- Name: sensor_readings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings ALTER COLUMN id SET DEFAULT nextval('public.sensor_readings_id_seq'::regclass);


--
-- Data for Name: sensor_readings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sensor_readings (id, zone_id, moisture_level, temperature, humidity, "timestamp") FROM stdin;
\.


--
-- Name: sensor_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sensor_readings_id_seq', 1, false);


--
-- Name: sensor_readings sensor_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_pkey PRIMARY KEY (id);


--
-- Name: sensor_readings sensor_readings_zone_id_irrigation_zones_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_zone_id_irrigation_zones_id_fk FOREIGN KEY (zone_id) REFERENCES public.irrigation_zones(id);


--
-- PostgreSQL database dump complete
--

