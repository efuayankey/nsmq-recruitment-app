import pytest
from fastapi.testclient import TestClient
from jose import jwt
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.core.config import settings
from app.core.database import Base, get_db
from app.core.security import create_access_token, hash_password, verify_password
from app.main import app


def test_hash_password_roundtrip():
    hashed = hash_password("s3cret-pass")
    assert hashed != "s3cret-pass"
    assert verify_password("s3cret-pass", hashed) is True
    assert verify_password("wrong-pass", hashed) is False


def test_access_token_carries_subject_and_is_verifiable():
    token = create_access_token("123")
    payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
    assert payload["sub"] == "123"


@pytest.fixture
def client():
    engine = create_engine(
        "sqlite:///:memory:", connect_args={"check_same_thread": False}, poolclass=StaticPool
    )
    Base.metadata.create_all(engine)
    TestingSessionLocal = sessionmaker(bind=engine)

    def override_get_db():
        db = TestingSessionLocal()
        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db
    yield TestClient(app)
    app.dependency_overrides.clear()


def test_register_login_and_me_flow(client: TestClient):
    register_resp = client.post(
        "/auth/register",
        json={
            "email": "student@test.com",
            "password": "password123",
            "full_name": "Test Student",
            "school_name": "Archbishop Porter Girls",
        },
    )
    assert register_resp.status_code == 201
    token = register_resp.json()["access_token"]

    login_resp = client.post(
        "/auth/login", json={"email": "student@test.com", "password": "password123"}
    )
    assert login_resp.status_code == 200

    me_resp = client.get("/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert me_resp.status_code == 200
    assert me_resp.json()["email"] == "student@test.com"


def test_register_rejects_duplicate_email(client: TestClient):
    payload = {"email": "dup@test.com", "password": "password123", "full_name": "Dup"}
    assert client.post("/auth/register", json=payload).status_code == 201
    assert client.post("/auth/register", json=payload).status_code == 400


def test_login_rejects_wrong_password(client: TestClient):
    client.post(
        "/auth/register",
        json={"email": "a@test.com", "password": "password123", "full_name": "A"},
    )
    resp = client.post("/auth/login", json={"email": "a@test.com", "password": "wrong"})
    assert resp.status_code == 401
