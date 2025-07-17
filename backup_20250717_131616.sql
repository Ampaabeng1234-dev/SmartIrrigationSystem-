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
-- Name: irrigation_schedule; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.irrigation_schedule (
    id integer NOT NULL,
    zone_id integer,
    scheduled_time timestamp without time zone NOT NULL,
    duration integer NOT NULL,
    is_completed boolean DEFAULT false,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.irrigation_schedule OWNER TO neondb_owner;

--
-- Name: irrigation_schedule_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.irrigation_schedule_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.irrigation_schedule_id_seq OWNER TO neondb_owner;

--
-- Name: irrigation_schedule_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.irrigation_schedule_id_seq OWNED BY public.irrigation_schedule.id;


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
-- Name: users; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username text NOT NULL,
    email text NOT NULL,
    password text NOT NULL,
    role character varying(20) DEFAULT 'user'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT now()
);


ALTER TABLE public.users OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO neondb_owner;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: weather_data; Type: TABLE; Schema: public; Owner: neondb_owner
--

CREATE TABLE public.weather_data (
    id integer NOT NULL,
    temperature real NOT NULL,
    humidity real NOT NULL,
    description text NOT NULL,
    wind_speed real,
    precipitation real,
    "timestamp" timestamp without time zone DEFAULT now()
);


ALTER TABLE public.weather_data OWNER TO neondb_owner;

--
-- Name: weather_data_id_seq; Type: SEQUENCE; Schema: public; Owner: neondb_owner
--

CREATE SEQUENCE public.weather_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.weather_data_id_seq OWNER TO neondb_owner;

--
-- Name: weather_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: neondb_owner
--

ALTER SEQUENCE public.weather_data_id_seq OWNED BY public.weather_data.id;


--
-- Name: crops id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.crops ALTER COLUMN id SET DEFAULT nextval('public.crops_id_seq'::regclass);


--
-- Name: irrigation_schedule id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_schedule ALTER COLUMN id SET DEFAULT nextval('public.irrigation_schedule_id_seq'::regclass);


--
-- Name: irrigation_zones id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones ALTER COLUMN id SET DEFAULT nextval('public.irrigation_zones_id_seq'::regclass);


--
-- Name: sensor_readings id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings ALTER COLUMN id SET DEFAULT nextval('public.sensor_readings_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: weather_data id; Type: DEFAULT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weather_data ALTER COLUMN id SET DEFAULT nextval('public.weather_data_id_seq'::regclass);


--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.crops (id, name, water_requirement, optimal_moisture, growth_stage, created_at) FROM stdin;
\.


--
-- Data for Name: irrigation_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.irrigation_schedule (id, zone_id, scheduled_time, duration, is_completed, created_at) FROM stdin;
\.


--
-- Data for Name: irrigation_zones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.irrigation_zones (id, name, field, crop_id, is_active, last_watered, created_at) FROM stdin;
\.


--
-- Data for Name: sensor_readings; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.sensor_readings (id, zone_id, moisture_level, temperature, humidity, "timestamp") FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.users (id, username, email, password, role, created_at) FROM stdin;
\.


--
-- Data for Name: weather_data; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.weather_data (id, temperature, humidity, description, wind_speed, precipitation, "timestamp") FROM stdin;
\.


--
-- Name: crops_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.crops_id_seq', 1, false);


--
-- Name: irrigation_schedule_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.irrigation_schedule_id_seq', 1, false);


--
-- Name: irrigation_zones_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.irrigation_zones_id_seq', 1, false);


--
-- Name: sensor_readings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.sensor_readings_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: weather_data_id_seq; Type: SEQUENCE SET; Schema: public; Owner: neondb_owner
--

SELECT pg_catalog.setval('public.weather_data_id_seq', 1, false);


--
-- Name: crops crops_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.crops
    ADD CONSTRAINT crops_pkey PRIMARY KEY (id);


--
-- Name: irrigation_schedule irrigation_schedule_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_schedule
    ADD CONSTRAINT irrigation_schedule_pkey PRIMARY KEY (id);


--
-- Name: irrigation_zones irrigation_zones_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones
    ADD CONSTRAINT irrigation_zones_pkey PRIMARY KEY (id);


--
-- Name: sensor_readings sensor_readings_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_pkey PRIMARY KEY (id);


--
-- Name: users users_email_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_unique UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_unique; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_unique UNIQUE (username);


--
-- Name: weather_data weather_data_pkey; Type: CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.weather_data
    ADD CONSTRAINT weather_data_pkey PRIMARY KEY (id);


--
-- Name: irrigation_schedule irrigation_schedule_zone_id_irrigation_zones_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_schedule
    ADD CONSTRAINT irrigation_schedule_zone_id_irrigation_zones_id_fk FOREIGN KEY (zone_id) REFERENCES public.irrigation_zones(id);


--
-- Name: irrigation_zones irrigation_zones_crop_id_crops_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.irrigation_zones
    ADD CONSTRAINT irrigation_zones_crop_id_crops_id_fk FOREIGN KEY (crop_id) REFERENCES public.crops(id);


--
-- Name: sensor_readings sensor_readings_zone_id_irrigation_zones_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: neondb_owner
--

ALTER TABLE ONLY public.sensor_readings
    ADD CONSTRAINT sensor_readings_zone_id_irrigation_zones_id_fk FOREIGN KEY (zone_id) REFERENCES public.irrigation_zones(id);


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON SEQUENCES TO neon_superuser WITH GRANT OPTION;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: cloud_admin
--

ALTER DEFAULT PRIVILEGES FOR ROLE cloud_admin IN SCHEMA public GRANT ALL ON TABLES TO neon_superuser WITH GRANT OPTION;


--
-- PostgreSQL database dump complete
--

