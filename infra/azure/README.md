# Azure Queue Setup

## Overview

This project uses **Azure Storage Queue** for asynchronous booking confirmation processing.

When a reservation is created, the backend enqueues a JSON message to the `booking-confirmations` queue.
A separate background worker (or Azure Function) consumes these messages and sends email confirmations to guests.

## Queue Message Format

```json
{
  "type": "BOOKING_CONFIRMATION",
  "reservationId": 123,
  "guestEmail": "guest@hotel.com",
  "checkIn": "2024-06-01",
  "checkOut": "2024-06-05"
}
```

## Local Development (Azurite)

For local development, we use [Azurite](https://github.com/Azure/Azurite) — an Azure Storage emulator.

Start with Docker Compose dev override:
```bash
docker compose -f docker-compose.yml -f docker-compose.dev.yml up azurite
```

The Azurite emulator provides:
- Blob service: `http://localhost:10000`
- Queue service: `http://localhost:10001`
- Table service: `http://localhost:10002`

Default connection string for Azurite (already configured in `docker-compose.dev.yml`):
```
DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OGLjX+Y96tu9bOa/S7oFtfOrEWpo+4Kg==;QueueEndpoint=http://localhost:10001/devstoreaccount1;
```

## Production Setup (Azure)

1. Create an Azure Storage Account in the [Azure Portal](https://portal.azure.com)
2. Navigate to **Access keys** and copy the connection string
3. Set the `AZURE_QUEUE_CONNECTION_STRING` environment variable

```bash
AZURE_QUEUE_CONNECTION_STRING="DefaultEndpointsProtocol=https;AccountName=<your-account>;AccountKey=<your-key>;EndpointSuffix=core.windows.net"
AZURE_QUEUE_NAME=booking-confirmations
```

## Creating the Queue

The queue is created automatically when the Spring Boot application starts (via `QueueClient.createIfNotExists()`).

To create it manually via Azure CLI:
```bash
az storage queue create \
  --name booking-confirmations \
  --account-name <your-storage-account>
```

## Worker / Consumer

To process messages, you can implement:
- An **Azure Function** with a Queue trigger
- A **Spring Boot scheduled task** (`@Scheduled`) that polls the queue
- A **separate microservice** subscribed to the queue

Example Azure Function queue trigger (Python):
```python
import azure.functions as func
import json
import logging

def main(msg: func.QueueMessage) -> None:
    body = json.loads(msg.get_body().decode('utf-8'))
    logging.info(f"Processing booking confirmation for reservation {body['reservationId']}")
    # Send email to body['guestEmail']
```
