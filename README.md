# Snipted API

![CI Status](https://github.com/Kishan-Thanki/snipted/actions/workflows/ci.yml/badge.svg)

A high-performance, secure backend for sharing code snippets. Built with **FastAPI**, **PostgreSQL (Supabase)**, and **Docker**.

## Features

* **FastAPI Framework:** High performance, easy to use, and ready for production.
* **Secure Authentication:** HTTP-Only Cookies (JWT) implementation. No tokens in LocalStorage.
* **Rate Limiting:** Protects against spam (5 req/min for creation).
* **Strict Pagination:** Prevents database overload (Max 100 items/page).
* **Search Engine:** Full text search on titles and code content + Tag filtering.
* **Testing:** 100% Test Coverage with Pytest.
* **Database:** SQLAlchemy ORM with SQLModel and Postgres.

## Tech Stack

* **Language:** Python 3.12+
* **Framework:** FastAPI
* **Database:** PostgreSQL (Supabase)
* **ORM:** SQLModel / SQLAlchemy
* **Testing:** Pytest & TestClient
* **Security:** Passlib (Bcrypt), Python-Jose (JWT), SlowAPI