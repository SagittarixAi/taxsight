def test_upload_without_auth(client):
    response = client.post("/api/documents/upload")
    assert response.status_code == 401


def test_upload_invalid_file_type(client, auth_headers):
    files = {"file": ("test.txt", b"hello world", "text/plain")}
    response = client.post("/api/documents/upload", files=files, headers=auth_headers)
    assert response.status_code == 400
    assert "Unsupported file type" in response.json()["detail"]
