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

--
-- Data for Name: crops; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.crops (id, name, water_requirement, optimal_moisture, growth_stage, created_at) FROM stdin;
\.


--
-- Data for Name: irrigation_zones; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.irrigation_zones (id, name, field, crop_id, is_active, last_watered, created_at) FROM stdin;
\.


--
-- Data for Name: irrigation_schedule; Type: TABLE DATA; Schema: public; Owner: neondb_owner
--

COPY public.irrigation_schedule (id, zone_id, scheduled_time, duration, is_completed, created_at) FROM stdin;
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
-- PostgreSQL database dump complete
--

