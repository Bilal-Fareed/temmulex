# API Endpoint cURL Examples

## ============================================== USER REQUEST CURLS ============================================

## 📝 Signup As Client
```bash
curl --location 'http://localhost:3001/v1/users/signup' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--form 'profile_picture=@"/C:/Users/Pictures/profile_picture.png"' \
--form 'user_type="client"' \
--form 'email="abc@gmail.com"' \
--form 'password="Abc123!!"' \
--form 'title="Mr"' \
--form 'first_name="First"' \
--form 'last_name="Demo"' \
--form 'country="USA"' \
--form 'dob="2026/12/01"' \
--form 'phone="123456789"'
```


## 📝 Signup As Freelancer
```bash
curl --location 'http://localhost:3001/v1/users/signup' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--form 'profile_picture=@"/C:/Users/Pictures/profile_picture.png"' \
--form 'user_type="freelancer"' \
--form 'email="freelancer@gmail.com"' \
--form 'password="Abc123!!"' \
--form 'title="Mr"' \
--form 'first_name="First"' \
--form 'last_name="Demo"' \
--form 'country="USA"' \
--form 'dob="2026/12/01"' \
--form 'phone="123456789"' \
--form 'languages="[\"dcf45f83-291d-413f-938f-2ce3ede51ee3\"]"' \
--form 'location="{\"lat\":0,\"lng\":0}"' \
--form 'services="[{\"serviceId\":\"f740660d-a46c-472a-b934-6323ac0728f5\",\"fixedPriceCents\":100,\"currency\":\"USD\"}]"' \
--form 'cv=@"/C:/Users/pdfs/cv.pdf"' \
--form 'dbs=@"/C:/Users/pdfs/dbs.pdf"'
```


## 📝 Send OTP
```bash
curl --location 'http://localhost:3001/v1/users/send-otp' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com"
}'
```


## 📝 Verify OTP
```bash
curl --location 'http://localhost:3001/v1/users/verify-otp' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com",
    "intent":"EMAIL_VERIFICATION",
    "otp": "0000"
}'
```


## 📝 Login as Client
```bash
curl --location 'http://localhost:3001/v1/users/login' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"abc@gmail.com",
    "password": "Abc123!!",
    "user_type":"client"
}'
```


## 📝 Login as Freelancer
```bash
curl --location 'http://localhost:3001/v1/users/login' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'Content-Type: application/json' \
--data-raw '{
    "email":"freelancer@gmail.com",
    "password": "Abc123!!",
    "user_type":"freelancer"
}'
```


## 📝 Logout
```bash
curl --location --request POST 'http://localhost:3001/v1/users/logout' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--data ''
```


## 📝 List Shoppers With Filters
```bash
curl --location --globoff 'http://localhost:3001/v1/users/top-rated/nearby?lat=-0.011994620971542783&lng=0.0001965761694590108&radius=500000&languages=a44f2482-76c4-4435-93af-64726771a8f8&languages=df56e5f8-d112-4a2a-9186-407bda3e39d4&services=40130a06-2a6a-400f-95f3-0e9b53be0c7c&services=d92c074d-e0e1-46bd-83df-120f5ed0b0db&price_range={%22starting_price%22%3A%200%2C%20%22ending_price%22%3A%2020}&search_text=shopper%27s%20name' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Delete Account
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/delete-account' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Forgot Password
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/forgot-password' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data-raw '{
    "password": "updatePassword@123"
}'
```


## 📝 Update Password
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/update-password' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "old_password": "oldPassword",
    "new_password": "newPassword"
}'
```


## 📝 Get My Profile
```bash
curl --location 'http://localhost:3001/v1/users/my-profile' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
```


## 📝 Update My Profile Details
```bash
curl --location --request PUT 'http://localhost:3001/v1/users/update-profile' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "title": "Mr",
    "first_name": "First Name",
    "last_name": "Last Name",
    "phone": "123456789",
    "country": "USA",
    "dob": "2026/12/01",
    "profile_picture": "http://localhost:3001/v1/file/uploaded"
}'
```


## 📝 Upload User Photo
```bash
curl --location 'http://localhost:3001/v1/users/upload' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--form 'profile_picture=@"/C:/Users/DELL/Downloads/photo.png"'
```


## 📝 Get My Profile Details
```bash
curl --location 'http://localhost:3001/v1/users/my-order?order_status=ongoing&page=1&limit=10' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Get My Order List
```bash
curl --location 'http://localhost:3001/v1/users/my-order?order_status=completed&page=1&limit=10' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE'
```


## 📝 Place Order
```bash
curl --location 'http://localhost:3001/v1/users/place-order' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "freelancer_id": "de6fe813-c292-4da1-a817-eecb2cea9142",
    "service_id": "40130a06-2a6a-400f-95f3-0e9b53be0c7c"
}'
```


## 📝 Rate Booking
```bash
curl --location 'http://localhost:3001/v1/users/booking/feedback' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4OTMyMDkxfQ.grt-eqI0s9_JxOC5EDUVOD6-Qk2pGI6k_XPX9Jq07EI' \
--header 'authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjg1YmIwZTAtYTNkOC00MDU5LTg4NTUtNDk3MTE4NTMyMTIxIiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImVlYjhmNmExLWEzZTAtNGRhZS05NjRkLWY2OTM2MjQwYzVmOSIsImlhdCI6MTc2ODMyNzI5MSwiZXhwIjoxNzY4MzMwODkxfQ.YWUa9AKGLroqHf6_XP2FebkYHYtTtFFXyE9M2EWyEqE' \
--header 'Content-Type: application/json' \
--data '{
    "booking_id": "6670f0bd-7e4b-4dd1-bc51-22de6306e249",
    "rating": 5
}'
```

## 📝 Get Orders List for Users
```bash
curl --location 'http://localhost:3001/v1/users/my-order?order_status=completed' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json'
```


## 📝 Place Order
```bash
curl --location 'http://localhost:3001/v1/users/place-order' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjVkNmNmZTUtYjRlOC00YzVhLThiM2YtNDQyOTgwZmY0NzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6IjkyY2RhOWZmLTI4YzMtNDE3OS04YWYxLWU1MzBjZDE2Njg3NCIsImlhdCI6MTc3MjQwNDMyNCwiZXhwIjoxNzczMDA5MTI0fQ.ZBaW2-QS58whJCSRZhVt3GJ85dzjGt4oOxkt8W1Fxgg' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjVkNmNmZTUtYjRlOC00YzVhLThiM2YtNDQyOTgwZmY0NzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6IjkyY2RhOWZmLTI4YzMtNDE3OS04YWYxLWU1MzBjZDE2Njg3NCIsImlhdCI6MTc3MjQwNDMyNCwiZXhwIjoxNzcyNDA3OTI0fQ.N97QJryBcfXpqqFl_9ZfoFnQ4T4ym4ymBYPrd6X6nlg' \
--header 'Content-Type: application/json' \
--data '{
    "freelancer_id":"15c2bb71-526e-4c0c-aa27-898c5b3fa764",
    "service_id":"b5de0efc-057a-4968-89e8-5cdfcc47145e"
}'
```


## 📝 Give Rating for Order
```bash
curl --location 'http://localhost:3001/v1/users/booking/feedback' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjVkNmNmZTUtYjRlOC00YzVhLThiM2YtNDQyOTgwZmY0NzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6IjkyY2RhOWZmLTI4YzMtNDE3OS04YWYxLWU1MzBjZDE2Njg3NCIsImlhdCI6MTc3MjQwNDMyNCwiZXhwIjoxNzczMDA5MTI0fQ.ZBaW2-QS58whJCSRZhVt3GJ85dzjGt4oOxkt8W1Fxgg' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMjVkNmNmZTUtYjRlOC00YzVhLThiM2YtNDQyOTgwZmY0NzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6IjkyY2RhOWZmLTI4YzMtNDE3OS04YWYxLWU1MzBjZDE2Njg3NCIsImlhdCI6MTc3MjQwNDMyNCwiZXhwIjoxNzcyNDA3OTI0fQ.N97QJryBcfXpqqFl_9ZfoFnQ4T4ym4ymBYPrd6X6nlg' \
--header 'Content-Type: application/json' \
--data '{
    "booking_id":"262d6b7b-b33c-4bbd-8d1b-05df37a13e9a",
    "rating":"5"
}'
```



## ============================================== FREELANCER REQUEST CURLS ============================================

## 📝 Get Freelancer Profile Details
```bash
curl --location 'http://localhost:3001/v1/freelancers/my-profile' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo'
```


## 📝 Upload Freelancer Document and Photo
```bash
curl --location 'http://localhost:3001/v1/freelancers/upload' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--form 'dbs=@"/C:/Users/DELL/Downloads/pdf-sample_0.pdf"'
```


## 📝 Add Service to Freelancer Profile
```bash
curl --location 'http://localhost:3001/v1/freelancers/add-service' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json' \
--data '{
    "serviceId": "b5de0efc-057a-4968-89e8-5cdfcc47145e",
    "title": "Hairstylish",
    "fixedPriceCents": "15",
    "description": "Best Hairstylish in the Town",
    "currency": "USD"
}'
```


## 📝 Delete Service from Freelancer Profile
```bash
curl --location --request DELETE 'http://localhost:3001/v1/freelancers/40130a06-2a6a-400f-95f3-0e9b53be0c7c/service' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json'
```



## 📝 Update Service Details in Freelancer Profile
```bash
curl --location 'http://localhost:3001/v1/freelancers/update-service' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json' \
--data '{
    "serviceId": "b5de0efc-057a-4968-89e8-5cdfcc47145e",
    "title": "Tommy & Guy",
    "fixedPriceCents": "30",
    "description": "Best Hairstylish in K-Town"
}'
```


## 📝 Get Orders List for Freelancer
```bash
curl --location 'http://localhost:3001/v1/freelancers/my-orders?order_status=completed' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json'
```


## 📝 Mark Order as Complete by Freelancer
```bash
curl --location --request PUT 'http://localhost:3001/v1/freelancers/262d6b7b-b33c-4bbd-8d1b-05df37a13e9a/complete' \
--header 'x-device-id: test-device-id' \
--header 'x-user-agent: android' \
--header 'x-refresh-token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzczMDA3MDcyfQ.kSeYvr7B4T_jUj_nzRM-pnxomrny_sUB5aWYvbmW-V8' \
--header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiMTVjMmJiNzEtNTI2ZS00YzBjLWFhMjctODk4YzViM2ZhNzY0IiwidmVyc2lvbiI6MCwidG9rZW5JZCI6ImJlZTZlZDliLTEzNDctNDMyOS1iZTZlLTNmNWI3N2JkNmUyNiIsImlhdCI6MTc3MjQwMjI3MiwiZXhwIjoxNzcyNDA1ODcyfQ.YHI2NVb-z09F-Ha2c2dRUKtsbpR-SoUpwMHWheY3qbo' \
--header 'Content-Type: application/json'
```