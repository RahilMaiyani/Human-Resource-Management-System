# Document Vault - Quick Start & Testing Guide

## 🚀 Quick Start

### 1. Backend Setup

The backend is already configured. Verify Cloudinary credentials in `.env`:

```env
CLOUDINARY_CLOUD_NAME=df1j7mi5v
CLOUDINARY_API_KEY=824474439855745
CLOUDINARY_API_SECRET=w3IFa6U7zbmsIL_WtaRYBCpoHXU
```

### 2. Start the Backend

```bash
cd server
npm install  # (if not already done)
npm run dev
```

The server should show:
```
Server running on port : 5000
```

### 3. Start the Frontend

```bash
cd client
npm install  # (if not already done)
npm run dev
```

The frontend should be available at `http://localhost:5173`

---

## ✅ Testing Workflow

### 1. Login as Employee

1. Navigate to `http://localhost:5173`
2. Login with employee credentials (or create one via admin)
3. You should see the sidebar with "Document Vault" link
4. Click on "Document Vault" → `/employee/vault`

### 2. Upload a Document

1. Click "Upload Document" button
2. Fill in:
   - **Title**: "Employment Contract" (or any title)
   - **Category**: Select "Contract"
   - **File**: Choose a PDF, image, or document file (< 5MB)
3. Click "Upload"
4. Should see success toast and document appears in grid

### 3. Test File Validations

#### Test Size Validation:
- Try uploading a file > 5MB
- Should see error: "File size must be less than 5MB"

#### Test Type Validation:
- Try uploading an `.exe` or other unsupported type
- Should see error: "Invalid file type. Allowed: PDF, PNG, JPG, JPEG, GIF, DOC, DOCX, TXT"

### 4. Preview Document

1. Click "View" button on a document card
2. For PDFs: Should show embedded PDF viewer
3. For images: Should display image
4. For other types: Should show download link
5. Close modal by clicking X or outside modal

### 5. Download Document

1. Click "Download" button on document card
2. File should download from Cloudinary URL

### 6. Delete Document

1. Click trash icon on document card
2. Confirm deletion in browser alert
3. Document should be removed from DOM
4. Should see success toast
5. Document should be deleted from:
   - Cloudinary (checked server logs)
   - MongoDB (next page refresh confirms)

### 7. Verify Ownership/Security

#### As Employee:
- Should only see own documents
- Cannot delete other users' documents

#### As Admin:
1. Login as admin
2. Navigate to Users page
3. To view employee's documents:
   - Use the AdminDocumentViewer component (can be integrated into Users page)
   - Or use API directly: `GET /api/documents/user/:userId`
4. Admin should be able to view but not modify/delete

---

## 🔍 API Testing (with cURL or Postman)

### Get auth token first:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"employee@example.com","password":"password"}'
```

Gets response:
```json
{"token":"eyJhbGc..."}
```

### Upload Document:

```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "title=My Contract" \
  -F "category=Contract" \
  -F "file=@/path/to/file.pdf"
```

### Get User's Documents:

```bash
curl -X GET http://localhost:5000/api/documents/my-documents \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Get Specific User's Documents (Admin):

```bash
curl -X GET http://localhost:5000/api/documents/user/USER_ID \
  -H "Authorization: Bearer ADMIN_TOKEN"
```

### Delete Document:

```bash
curl -X DELETE http://localhost:5000/api/documents/DOCUMENT_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐛 Debugging

### Check Cloudinary Upload

1. Login to Cloudinary dashboard: `https://cloudinary.com/`
2. Navigate to Media Library
3. Look for folder named `officelink_vault`
4. Files should appear when uploaded

### Check MongoDB

1. Login to MongoDB Atlas: `https://mongodb.com/`
2. Navigate to your cluster browser
3. Look for `documents` collection in the database
4. Verify document records are created

### Browser Console Errors

1. Open DevTools (F12)
2. Check Console tab for:
   - Network errors (401 Unauthorized usually means auth issue)
   - Component errors
   - API response issues

### Server Logs

Watch the backend terminal for:
- Upload middleware logs
- Database operation status
- Cloudinary response messages

---

## 📊 Expected Data Structure

### MongoDB Document Example:

```json
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "title": "Employment Contract",
  "category": "Contract",
  "fileUrl": "https://res.cloudinary.com/df1j7mi5v/image/upload/v1234567890/officelink_vault/abc123.pdf",
  "publicId": "officelink_vault/abc123",
  "fileType": "pdf",
  "fileSize": 245120,
  "createdAt": "2024-04-30T10:00:00.000Z",
  "updatedAt": "2024-04-30T10:00:00.000Z"
}
```

### API Response Example:

```json
{
  "msg": "Document uploaded successfully",
  "document": {
    "_id": "...",
    "userId": "...",
    "title": "Employment Contract",
    "category": "Contract",
    "fileUrl": "https://...",
    "publicId": "...",
    "fileType": "pdf",
    "fileSize": 245120,
    "createdAt": "2024-04-30T10:00:00.000Z",
    "updatedAt": "2024-04-30T10:00:00.000Z"
  }
}
```

---

## 🔐 Security Verification

### Scenario 1: Unauthorized Access
- Try accessing `/api/documents/my-documents` without token
- Should get: `401 Unauthorized`

### Scenario 2: Access Another User's Document
- Get User B's document ID
- As User A, try: `DELETE /api/documents/USER_B_DOC_ID`
- Should get: `403 Access denied`

### Scenario 3: Admin Override
- As Admin, same DELETE request
- Should succeed with: `200 Document deleted successfully`

---

## 📱 Responsive Design Testing

1. **Mobile (< 768px)**
   - Grid should show 1 column
   - Upload modal should be full width
   - Navigation should be hamburger menu

2. **Tablet (768px - 1024px)**
   - Grid should show 2 columns
   - Modal should be responsive

3. **Desktop (> 1024px)**
   - Grid should show 3 columns
   - Full width features

---

## 🎯 Feature Verification Checklist

- [ ] Can upload documents
- [ ] File size validation works (5MB limit)
- [ ] File type validation works
- [ ] Category selection appears
- [ ] Document appears in grid after upload
- [ ] Category badge shows with correct color
- [ ] File type icon shows with correct color
- [ ] Download button downloads file
- [ ] View button opens preview modal
- [ ] PDF preview loads in iframe
- [ ] Image preview displays
- [ ] Non-previewable files show download option
- [ ] Delete button removes document
- [ ] Delete confirmation appears
- [ ] Empty state shows when no documents
- [ ] Skeleton loader shows during loading
- [ ] Only owner/admin can delete
- [ ] Admin can view other user's documents
- [ ] Toast notifications appear
- [ ] Sidebar link navigates correctly
- [ ] Protected route prevents unauthorized access

---

## 🚨 Common Issues & Solutions

### Issue: CORS Error on Upload
**Solution**: Ensure Cloudinary middleware is initialized before routes in `server.js`

### Issue: "No file uploaded" Error
**Solution**: Ensure form has `enctype="multipart/form-data"` (handled by FormData in component)

### Issue: 401 Unauthorized on API calls
**Solution**: Check token exists in localStorage and is valid JWT

### Issue: Files not appearing in grid
**Solution**: Check browser Network tab - should see 200 response from `/my-documents` endpoint

### Issue: Cloudinary folder doesn't exist
**Solution**: First upload creates folder automatically. Check API response for publicId path.

### Issue: Preview modal won't load iframe
**Solution**: Ensure Cloudinary URL is HTTPS and CORS is enabled on Cloudinary account

---

## 📞 Support

If you encounter issues:

1. Check server logs for backend errors
2. Check browser console for frontend errors
3. Verify Cloudinary credentials in `.env`
4. Verify MongoDB connection string
5. Check JWT token validity
6. Review API response structure

---

## 🎓 Next Steps

After successful testing:

1. Deploy backend to production
2. Deploy frontend to production
3. Update `.env` with production Cloudinary account
4. Test with real user data
5. Monitor Cloudinary usage and costs
6. Implement backup/archival strategy
7. Add audit logging for admin actions

