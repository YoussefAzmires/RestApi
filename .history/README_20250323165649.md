
## Endpoints

### **POST** `/MaintenanceRecords`
**Description:** Adds a new maintenance record.  
**Request Body Example:**
```json
{
  "carPart": "brake pads",
  "lastChanged": "2023-03-15T00:00:00.000Z",
  "nextChange": "2024-03-15T00:00:00.000Z"
}
```
**Response Example:**
```json
{
  "_id": "67de0cae836a6455f1f51b1d",
  "carPart": "brake pads",
  "lastChanged": "2023-03-15T00:00:00.000Z",
  "nextChange": "2024-03-15T00:00:00.000Z"
}
```

---

### **GET** `/MaintenanceRecords`
**Description:** Retrieves all maintenance records.  
**Response Example:**
```json
[
  {
    "_id": "67de0cae836a6455f1f51b1d",
    "carPart": "brake pads",
    "lastChanged": "2023-03-15T00:00:00.000Z",
    "nextChange": "2024-03-15T00:00:00.000Z"
  },
  {
    "_id": "67de0caf836a6455f1f51b1e",
    "carPart": "oil filter",
    "lastChanged": "2023-06-10T00:00:00.000Z",
    "nextChange": "2024-06-10T00:00:00.000Z"
  }
]
```

---

### **GET** `/MaintenanceRecords/:carPart`
**Description:** Retrieves a specific maintenance record by car part.  
**Response Example:**
```json
{
  "_id": "67de0cae836a6455f1f51b1d",
  "carPart": "brake pads",
  "lastChanged": "2023-03-15T00:00:00.000Z",
  "nextChange": "2024-03-15T00:00:00.000Z"
}
```

---

### **PUT** `/MaintenanceRecords/:carPart`
**Description:** Updates an existing maintenance record.  
**Request Body Example:**
```json
{
  "carPart": "brake discs",
  "lastChanged": "2023-09-20T00:00:00.000Z",
  "nextChange": "2024-09-20T00:00:00.000Z"
}
```
**Response Example:**
```json
{
  "_id": "67de0cae836a6455f1f51b1d",
  "carPart": "brake discs",
  "lastChanged": "2023-09-20T00:00:00.000Z",
  "nextChange": "2024-09-20T00:00:00.000Z"
}
```

---

### **DELETE** `/MaintenanceRecords/:carPart`
**Description:** Deletes a maintenance record.  
**Response Example:**
```json
{
  "message": "Maintenance record deleted successfully"
}
```

---

