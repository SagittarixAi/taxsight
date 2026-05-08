"""Pydantic schemas for document upload and responses."""
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ExtractedFieldResponse(BaseModel):
    field_name: str
    field_value: str
    confidence: float

    model_config = ConfigDict(from_attributes=True)


class DocumentUploadResponse(BaseModel):
    document_id: int
    filename: str
    extracted_text: str
    status: str


class DocumentResponse(BaseModel):
    id: int
    user_id: int
    filename: str
    file_path: str
    file_type: str
    status: str
    created_at: datetime
    updated_at: datetime
    extracted_fields: list[ExtractedFieldResponse] = []

    model_config = ConfigDict(from_attributes=True)


class DocumentDataResponse(BaseModel):
    document_id: int
    status: str
    extracted_fields: list[ExtractedFieldResponse]
