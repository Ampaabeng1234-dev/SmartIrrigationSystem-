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
-- Name: crops; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.crops (
    id integer NOT NULL,
    name text NOT NULL,
    water_requirement text NOT NULL,
    optimal_moisture integer NOT NULL,
    growth_stage text NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.crops OWNER TO neondb_owner;

--
-- Name: crops_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.crops_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.crops_id_seq OWNER TO neondb_owner;

--
-- Name: crops_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.crops_id_seq OWNED BY public.crops.id;


--
-- Name: crops id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.crops ALTER COLUMN id SET DEFAULT nextval('public.crops_id_seq'::regclass);


--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.crops (id, name, water_requirement, optimal_moisture, growth_stage, created_at) FROM stdin;
\.


--
-- Name: crops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.crops_id_seq', 1, false);


--
-- Name: crops crops_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

