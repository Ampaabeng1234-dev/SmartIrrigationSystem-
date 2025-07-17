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
-- Name: irrigation_zones; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.irrigation_zones (
    id integer NOT NULL,
    name text NOT NULL,
    field text NOT NULL,
    crop_id integer,
    is_active boolean DEFAULT false,
    last_watered timestamp without time zone,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.irrigation_zones OWNER TO neondb_owner;

--
-- Name: irrigation_zones_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.irrigation_zones_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.irrigation_zones_id_seq OWNER TO neondb_owner;

--
-- Name: irrigation_zones_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.irrigation_zones_id_seq OWNED BY public.irrigation_zones.id;


--
-- Name: irrigation_zones id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones ALTER COLUMN id SET DEFAULT nextval('public.irrigation_zones_id_seq'::regclass);


--
-- Data for Name: irrigation_zones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.irrigation_zones (id, name, field, crop_id, is_active, last_watered, created_at) FROM stdin;
\.


--
-- Name: irrigation_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.irrigation_zones_id_seq', 1, false);


--
-- Name: irrigation_zones irrigation_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones
    ADD CONSTRAINT irrigation_zones_pkey PRIMARY KEY (id);


--
-- Name: irrigation_zones irrigation_zones_crop_id_crops_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones
    ADD CONSTRAINT irrigation_zones_crop_id_crops_id_fk FOREIGN KEY (crop_id) REFERENCES public.crops(id);


--
-- PostgreSQL database dump complete
--

